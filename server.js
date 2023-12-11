const express = require('express');
const dbconnect = require('./config/dbconnect');
const app = express()
const dotenv = require('dotenv').config();
const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandle');
const morgan = require('morgan')
const port = process.env.PORT;
dbconnect();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/api/user', authRouter)
app.use('/api/product', productRouter)
app.use(notFound);
app.use(errorHandler);

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))