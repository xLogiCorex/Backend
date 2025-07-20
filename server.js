
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 3000
const dbHandler = require('./dbHandler')


const app = express().use(express.json(),cors())


dbHandler.userTable.sync({ alter: true })
dbHandler.productTable.sync({ alter: true })
dbHandler.categoryTable.sync({ alter: true })
dbHandler.subcategoryTable.sync({ alter: true })
dbHandler.partnerTable.sync({ alter: true })
dbHandler.stockMovementTable.sync({ alter: true })
dbHandler.orderTable.sync({ alter: true })
dbHandler.orderItemTable.sync({ alter: true })
dbHandler.invoiceTable.sync({ alter: true })
dbHandler.logTable.sync({ alter: true })

const users = require('./users');
const products = require('./products');
const categories = require('./categories');
const subcategories = require('./subcategories');
const partners = require('./partners');
const orders = require('./orders');
app.use("/",users)
app.use("/",products)
app.use("/",categories)
app.use("/",subcategories)
app.use("/",partners)
app.use("/",orders)

app.use((req, res) => res.status(404).json({ message: "Útvonal nem található" }));

app.listen(PORT, () => {console.log(`A szerver a  ${PORT} porton fut.`);});