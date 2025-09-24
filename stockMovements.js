const express = require('express');
const router = express.Router();
const { stockMovementTable, productTable, userTable, logTable, sequelize } = require('./dbHandler');
const { logAction } = require('./log');
const authenticateJWT = require('./authenticateJWT');
const authorizeRole = require('./authorizeRole');

// Készletmozgási azonosító (pl. KT-2025-00001) generálása
async function generateMovementNumber(transaction) {
  const year = new Date().getFullYear();
  const lastStockMovement = await stockMovementTable.findOne({
    order: [['id', 'DESC']],
    transaction
  });
  return `KT-${year}-${String((lastStockMovement ? lastStockMovement.id : 0) + 1).padStart(5, '0')}`;
}

// Bemeneti adatok validálása
function validateStockFields(body) {
  const { productId, quantity } = body;
  if (!productId || quantity === undefined) {
    return { valid: false, message: "Hiányzó mezők: productId és quantity szükségesek." };
  }
  if (quantity <= 0) {
    return { valid: false, message: "A mennyiségnek pozitívnak kell lennie." };
  }
  return { valid: true };
}

// Segédfüggvény az adatbázis tranzakciók kezelésére
async function withTransaction(req, res, action) {
  const transaction = await sequelize.transaction(); 
  try {
    await action(transaction); 
    await transaction.commit(); 
  } catch (error) {
    await transaction.rollback(); 
    return res.status(500).json({ message: "Művelet sikertelen.", error: error.message });
  }
}


// Terméklista lekérése
router.get('/products', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
  try {
    const products = await productTable.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Hiba történt a termékek lekérésekor.", error: error.message });
  }
});

// Készletmozgások listázása
router.get('/stockMovements', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
  try {
    const { type, from, to, productId } = req.query; 
    const where = {};  
    if (type) where.type = type; 
    if (productId) where.productId = productId; 
    if (from || to) { 
      where.date = {}; 
      if (from) where.date['$gte'] = new Date(from); 
      if (to) where.date['$lte'] = new Date(to);    
      
    }


    if (req.user.role === 'sales' && req.user.id) {
      where.userId = req.user.id;
    }
    const movements = await stockMovementTable.findAll({ where, order: [['date', 'DESC']] });
    res.status(200).json(movements);
  } catch (error) {
    res.status(500).json({ message: "Hiba történt a készletmozgások lekérésekor.", error: error.message });
  }
});

// Bevételezés
router.post('/stockMovements/in', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
  const validation = validateStockFields(req.body);
  if (!validation.valid) return res.status(400).json({ message: validation.message });

  await withTransaction(req, res, async (transaction) => {
    const { productId, quantity, note } = req.body;
    const userId = req.user.id;

    const product = await productTable.findByPk(productId, { transaction });
    if (!product) return res.status(404).json({ message: "Termék nem található." });

    const newQuantity = product.availableStock + quantity;
    const movementNumber = await generateMovementNumber(transaction);

    const movement = await stockMovementTable.create({
      productId,
      type: 'in',
      quantity,
      userId,
      note,
      movementNumber,
      transferReason: null,
    }, { transaction });

    await product.update({
      stockQuantity: newQuantity,
      availableStock: newQuantity,
      isActive: newQuantity > 0
    }, { transaction });

    await logAction({
      userId,
      action: 'STOCK_IN',
      targetType: 'StockMovement',
      targetId: movement.id,
      payload: {
        productId: movement.productId,
        quantity: movement.quantity,
        movementNumber: movement.movementNumber,
        note: movement.note || null,
      },
      req,
      transaction
    });

    res.status(201).json({ message: "Készletmozgás rögzítve.", movement });
  });
});

// Készlet kivezetése
router.post('/stockMovements/out', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
  const validation = validateStockFields(req.body);
  if (!validation.valid) return res.status(400).json({ message: validation.message });

  await withTransaction(req, res, async (transaction) => {
    const { productId, quantity, note } = req.body;
    const userId = req.user.id;

    const product = await productTable.findByPk(productId, { transaction });
    if (!product) return res.status(404).json({ message: "Termék nem található." });

    if (product.availableStock < quantity) {
      return res.status(400).json({ message: "Nincs elegendő készlet a kivételhez." });
    }

    const newQuantity = product.availableStock - quantity;
    const movementNumber = await generateMovementNumber(transaction);

    const movement = await stockMovementTable.create({
      productId,
      type: 'out',
      quantity,
      userId,
      note,
      movementNumber,
      transferReason: null
    }, { transaction });

    await product.update({
      stockQuantity: newQuantity,
      availableStock: newQuantity,
      isActive: newQuantity > 0
    }, { transaction });

    await logAction({
      userId,
      action: 'STOCK_IN',
      targetType: 'StockMovement',
      targetId: movement.id,
      payload: {
        productId: movement.productId,
        quantity: movement.quantity,
        movementNumber: movement.movementNumber,
        note: movement.note || null,
      },
      req,
      transaction
    });

    res.status(201).json({ message: "Készlet kivétele rögzítve.", movement });
  });
});

// Áthelyezés 
router.post('/stockMovements/transfer', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
  const validation = validateStockFields(req.body);
  if (!validation.valid) return res.status(400).json({ message: validation.message });

  await withTransaction(req, res, async (transaction) => {
    const { productId, quantity, transferReason } = req.body;
    const userId = req.user.id;

    const product = await productTable.findByPk(productId, { transaction });
    if (!product) return res.status(404).json({ message: "Termék nem található." });

    if (product.availableStock < quantity) {
      return res.status(400).json({ message: "Nincs elegendő készlet az áthelyezéshez." });
    }

    const movementNumber = await generateMovementNumber(transaction);

    const movement = await stockMovementTable.create({
      productId,
      type: 'transfer',
      quantity,
      userId,
      transferReason: transferReason || null,
      movementNumber
    }, { transaction });

    // Áthelyezésnél a teljes készlet nem változik, ezért product frissítés nincs
    await logAction({
      userId,
      action: 'STOCK_TRANSFER',
      targetType: 'StockMovement',
      targetId: movement.id,
      payload: {
        productId: movement.productId,
        quantity: movement.quantity,
        transferReason: movement.transferReason,
        movementNumber: movement.movementNumber
      },
      req,
      transaction
    });

    res.status(201).json({ message: "Áthelyezés rögzítve.", movement });
  });
});

module.exports = router;