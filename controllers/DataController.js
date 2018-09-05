
"use strict"
var busModel = require('../models/DataModel.js');


module.exports.registerBus = async function registerBus(numberplate, seats, callback) {
    console.log("controller......");
    var bus = new busModel(numberplate, seats); 
     bus.registerBus(callback);
}


//get all bus number plates
module.exports.getAllBuses = function getAllBuses(callback) {
    console.log("controllers .....get all buses")
    busModel.getAllBuses(callback);
}
