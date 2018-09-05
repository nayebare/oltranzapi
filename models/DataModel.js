/**
 * Author Jeannette Mukamana Bayi + Micheal Nayebare 2018 7/July/2018
 */

var schema = require('../middleware/database.js');
const nodemailer = require('nodemailer');
"use strict"

class busModel {
    constructor(numberplate, seats) {
        this.numberplate = numberplate;
        this.seats = seats;
    }

    getNumberplate() {
        return this.numberplate;
    }

    getSeats() {
        return this.seats;
    }


    toString() {
        return ` ${this.numberplate}, ${this.seats}`;
    }

    registerBus(callback) {
        console.log("bus models section ......");
        //saving the bus model
        schema.registerBus(this, callback);
    }
 
}
module.exports = busModel;

module.exports.getAllBuses = function getAllBuses(callback) {
    console.log("models .... get all buses")
    schema.selectAllBuses(callback);
}

module.exports.getReport = function getReport(region, callback) {
    console.log("models get .......... reoprt")
    schema.getReport(region, callback);
}


module.exports.getCoordinates = function getCoordinates(callback) {
    console.log("models .... coordinates")
    schema.getCoordinates(callback);
}

//get population data
module.exports.getPopulation = function getPopulation(callback) {
    console.log("models .... population")
    schema.getPopulation(callback);
}

//get infrustructure data
module.exports.getInfrustructure = function getInfrustructure(callback) {
    console.log("models .... infrustructure")
    schema.getInfrustructure(callback);
}
