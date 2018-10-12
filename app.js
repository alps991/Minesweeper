const path = require('path');
const express = require('express');
const compress = require('compression');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const responseTime = require('response-time');
const { Client } = require('pg');
const Sequelize = require('sequelize');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(responseTime());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compress());

app.use(express.static(path.join(__dirname, 'public')));

const sequelize = new Sequelize(process.env.DATABASE_URL);

app.listen(port, () => {
    console.log('server started on port: ' + port);
});

