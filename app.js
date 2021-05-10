const express = require('express')
const productRouter = require('./routes/productRouter')

const app = express()

app.use('/products',productRouter)

module.exports = app;