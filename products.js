// products.js
const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const dbHandler = require("./dbHandler");
const authenticateJWT = require("./authenticateJWT");
const authorizeRole = require("./authorizeRole");
const { logAction } = require("./log");

// Termékek keresése / listázása
router.get("/products", authenticateJWT(), authorizeRole(["admin", "sales"]), async (req, res) => {
    try {
        const { q } = req.query;
        let where = {};

        if (q && q.trim() !== "") {
        where = {
            [Op.or]: [
            { sku: { [Op.like]: `%${q}%` } },
            { name: { [Op.like]: `%${q}%` } }
            ]
        };
        }

        const products = await dbHandler.productTable.findAll({
        where,
        order: [["name", "ASC"]],
        limit: 100
        });

        return res.status(200).json(products);
    } catch (error) {
        console.error("Hiba a termékek lekérésekor:", error);
        return res.status(500).json({ message: "Nem sikerült lekérni a termékeket." });
    }
});

// Új termék létrehozása
router.post("/products", authenticateJWT(), authorizeRole(["admin"]), async (req, res) => {
    let { newSku, newName, newCategoryId, newSubcategoryId, newUnit, newPrice, newMinStockLevel, newIsActive } = req.body;

    if (!newSku || !newName || !newCategoryId || !newUnit || !newPrice) {
        return res.status(400).json({ message: "Kötelező mező kitöltése szükséges!" });
    }

    if (newSku.length <= 3) {
        return res.status(400).json({ message: "A termék SKU-nak legalább 4 karakter hosszúnak kell lennie!" });
    }

    if (newName.length <= 3) {
        return res.status(400).json({ message: "A termék nevének minimum 4 karakter hosszúnak kell lennie!" });
    }

    try {
        const [skuExists, nameExists] = await Promise.all([
        dbHandler.productTable.findOne({ where: { sku: newSku } }),
        dbHandler.productTable.findOne({ where: { name: newName } })
        ]);

        if (skuExists) {
        return res.status(409).json({ message: "Ez a termék SKU már létezik!" });
        }
        if (nameExists) {
        return res.status(409).json({ message: "Ez a termék név már létezik!" });
        }

        const newProduct = await dbHandler.productTable.create({
        sku: newSku,
        name: newName,
        categoryId: newCategoryId,
        subcategoryId: newSubcategoryId || null,
        unit: newUnit,
        price: newPrice,
        stockQuantity: 0,
        minStockLevel: newMinStockLevel || 0,
        isActive: newIsActive !== undefined ? newIsActive : true
        });

        await logAction({
        userId: req.user.id,
        action: "PRODUCT_CREATE",
        targetType: "Product",
        targetId: newProduct.id,
        payload: {
            sku: newSku,
            name: newName,
            categoryId: newCategoryId,
            subcategoryId: newSubcategoryId || null,
            unit: newUnit,
            price: newPrice
        },
        req
        });

        return res.status(201).json({ message: "Termék sikeresen rögzítve!", product: newProduct });
    } catch (error) {
        console.error("Termék mentési hiba:", error);
        return res.status(500).json({ message: "A termék mentése sikertelen volt. Kérjük, próbáld újra!" });
    }
});

module.exports = router;
