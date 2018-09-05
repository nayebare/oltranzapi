var express = require('express')
var path = require('path')
var logger = require('morgan')
var bodyParser = require('body-parser')
var app = express()
var neo4j = require('neo4j-driver').v1
var routes = require('./routes.js');

app.use(express.json());
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
var router = express.Router();
const http = require('http');
router.use(bodyParser.urlencoded({ extended: false }));
const urlencoded = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();
var data = {};

//view engine 
app.set('views', path.join(__dirname, 'views'))
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
var router = express.Router();

//run app
app.listen(3000);
/*
Setting ejs as the base template
*/
app.set('view engine', 'ejs');

app.use('/', routes);

console.log('Server started on port 3000');
module.export = app;
