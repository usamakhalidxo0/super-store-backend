const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const ErrorHandler = require('./helpers/ErrorHandler');

const productRouter = require('./routes/productRouter')
const adminRouter = require('./routes/adminRouter');

const app = express()

app.use(express.json());
app.use(cookieParser());
if(process.env.NODE_ENV=='dev')
    app.use(morgan('dev'));
app.use(cors());

app.use('/api/v1/admin',adminRouter);
app.use('/api/v1/products',productRouter);

app.use(ErrorHandler);

module.exports = app;