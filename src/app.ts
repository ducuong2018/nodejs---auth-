import express from "express";
const  app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

// setup env
require('dotenv').config();

// setup body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// setup morgan (for log request on terminal)
app.use(morgan('tiny'));

// CORS
// app.use((req, res, next) => {
//     try {
//         res.header("Access-Control-Allow-Origin", "*");
//         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-token");
//         res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//         next();
//     } catch (e) {
//         res.status(400).json({
//             error: 'CORS'
//         });
//     }
// });

const db = require('./models/index');
(async function connectDb() {
    try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})()

// router
import AuthRouter from "./routers/AuthRouter";
import ProfileRouter from "./routers/ProfileRouter";
import User from "./routers/UserRouter"
app.use('/', AuthRouter);
app.use('/',ProfileRouter);
app.use('/',User);


module.exports = app;
