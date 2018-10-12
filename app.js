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

const Game = sequelize.define('game', {
    player: {
        type: Sequelize.STRING
    },
    time: {
        type: Sequelize.INTEGER
    }
});


User.sync({ force: true }).then(() => {
    return Game.create({
        player: 'John',
        time: 23
    });
});

app.listen(port, () => {
    console.log('server started on port: ' + port);
});

