const thisApp = require('./app.js');
var express = require('express');
var app = express();
app.use(express.json());
app.set('view engine', 'ejs');
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
var router = express.Router();
const http = require('http');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
const urlencoded = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();
var routes = require('./routes.js');
var data = {};
const DataController = require('./controllers/DataController.js');
const companyController = require('./controllers/companyController.js');



//route api for getting bus data from the db
router.get('/buses/', function (req, res) {
    DataController.getAllBuses((err, results) => {
        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json(results.rows);
        }
    });
})

//api route for getting all companies
router.get('/companies/', function (req, res) {
    companyController.getAllCompanies((err, results) => {
        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json(results.rows);
        }
    });
})


module.exports = router