require('dotenv').config()
const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 3000
const dbHandler = require('./dbHandler')

const app = express().use(express.json(), cors())

// Táblák szinkronizálása
async function syncTables() {
    try {
        console.log('🔄 Táblák szinkronizálása...');

        await dbHandler.userTable.sync();
        await dbHandler.productTable.sync();
        await dbHandler.categoryTable.sync();
        await dbHandler.subcategoryTable.sync();
        await dbHandler.partnerTable.sync();
        await dbHandler.stockMovementTable.sync();
        await dbHandler.orderTable.sync();
        await dbHandler.orderItemTable.sync();
        await dbHandler.invoiceTable.sync();
        await dbHandler.logTable.sync();

        console.log('✅ Táblák szinkronizálva');
    } catch (error) {
        console.error('❌ Hiba a táblák szinkronizálásakor:', error);
    }
}

syncTables()

// Modulok/útválasztók betöltése
const users = require('./users');
const products = require('./products');
const categories = require('./categories');
const subcategories = require('./subcategories');
const partners = require('./partners');
const orders = require('./orders');
const stockMovements = require('./stockMovements');
const invoices = require('./invoices');
const { router: logs, logAction } = require('./log');
app.use("/", users)
app.use("/", products)
app.use("/", categories)
app.use("/", subcategories)
app.use("/", partners)
app.use("/", orders)
app.use("/", stockMovements);
app.use("/", invoices);
app.use('/', logs);

app.use((req, res) => res.status(404).json({ message: "Útvonal nem található" }));

app.listen(PORT, () => { console.log(`A szerver a  ${PORT} porton fut.`); });