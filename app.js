require('dotenv').config();

const path = require('path');
const express = require('express');
const compress = require('compression');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const responseTime = require('response-time');
const Sequelize = require('sequelize');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(responseTime());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compress());

app.use(express.static(path.join(__dirname, 'public')));

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: true
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const User = sequelize.define('user', {
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    }
});

// force: true will drop the table if it already exists
User.sync({ force: true }).then(() => {
    // Table created
    return User.create({
        firstName: 'John',
        lastName: 'Hancock'
    });
});

app.listen(port, () => {
    console.log('server started on port: ' + port);
});

