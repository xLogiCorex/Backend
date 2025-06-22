const express = require('express');
const JWT = require('jsonwebtoken');
const dbHandler = require('./dbHandler');
const cors = require('cors');
require('dotenv').config()
PORT= process.env.PORT

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


app.get('/users', async (req, res) => {
 res.status(200).json(await dbHandler.userTable.findAll())
})

app.get('/products', async (req, res) => {
 res.status(200).json(await dbHandler.productTable.findAll())
})



app.listen(PORT, () => {console.log(`A szerver a  ${PORT} porton fut.`);});