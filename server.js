const express = require('express')
//const JWT = require('jsonwebtoken')
const dbHandler = require('./dbHandler')
const cors = require('cors')
require('dotenv').config()
const PORT = process.env.PORT
//const SECRET = process.env.SECRET
//const bcrypt = require('bcrypt')
//const axios = require('axios')
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

// lekérem a különböző fájlokban lévő routokat
const users = require('./users')
const products = require('./products')
const categories = require('./categories')
const subcategories = require('./subcategories')
const partners = require('./partners')
const orders = require('./orders')

// használom a különböző routokat
app.use("/", users)
app.use("/",products)
app.use("/",categories)
app.use("/",subcategories)
app.use("/",partners)
app.use("/",orders)

app.listen(PORT, () => {console.log(`A szerver a  ${PORT} porton fut.`);});