const express = require('express');
const router = express.Router();
const { stockMovementTable, productTable, userTable, logTable, sequelize } = require('./dbHandler');
const { logAction } = require('./log');  
const authenticateJWT = require('./authenticateJWT');
const authorizeRole = require('./authorizeRole');


// Segédfüggvények

async function generateMovementNumber(transaction) {
  const year = new Date().getFullYear();
  const lastStockMovement = await stockMovementTable.findOne({
    order: [['id', 'DESC']],
    transaction
  });
  return `KT-${year}-${String((lastStockMovement ? lastStockMovement.id : 0) + 1).padStart(5, '0')}`;
}

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

async function withTransaction(req, res, action) {
  const transaction = await sequelize.transaction(); // Tranzakció létrehozása
  try {
    await action(transaction); // A tranzakciós művelet végrehajtása
    await transaction.commit(); // Tranzakció elkötelezése, tehát minden sikeres volt
  } catch (error) {
    await transaction.rollback(); // Tranzakció visszagörgetése hiba esetén
    return res.status(500).json({ message: "Művelet sikertelen.", error: error.message });
  }
}

// Routes

// Terméklista lekérése (admin és sales jogosultsággal)
router.get('/products', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
  try {
    const products = await productTable.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Hiba történt a termékek lekérésekor.", error: error.message });
  }
});

// Készletmozgások listázása (csak adminnak, sales csak saját mozgásait láthatja)
router.get('/stockMovements', authenticateJWT(), authorizeRole(['admin', 'sales']), async (req, res) => {
  try {
    const { type, from, to, productId } = req.query; // Kivesszük az URL-ből érkező query paramétereket: type, from, to, productId
    const where = {};   // Létrehozunk egy üres objektumot, amibe később feltételeket teszünk
    if (type) where.type = type; // Ha a type query paraméter meg van adva (pl. "in", "out", "transfer"), akkor a where objektumba betesszük: where.type = "in" például.
    if (productId) where.productId = productId; // Ha van productId a query-ben, akkor ezt is hozzáadjuk szűrési feltételként (pl. where.productId = 5).
    if (from || to) { // Ha van from vagy to dátum a query-ben, akkor a where.date objektumba betesszük a megfelelő feltételeket
      where.date = {}; // Létrehozunk egy üres objektumot a dátumoknak
      if (from) where.date['$gte'] = new Date(from); // $gte = Greater Than or Equal (nagyobb vagy egyenlő mint), 
      if (to) where.date['$lte'] = new Date(to);    // $lte = Less Than or Equal (kisebb vagy egyenlő mint)
      // Így például ha from = "2023-01-01" és to = "2023-12-31", akkor a where.date objektum így néz ki: { $gte: new Date("2023-01-01"), $lte: new Date("2023-12-31") }
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

// Bevételezés létrehozása (admin, sales)
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

// Készlet kivezetése (OUT) - admin és sales jogosultsággal
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

// Áthelyezés (TRANSFER) - admin és sales jogosultsággal
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