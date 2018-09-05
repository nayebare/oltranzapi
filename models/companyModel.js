/**
 * Author Jeannette Mukamana Bayi + Micheal Nayebare 2018 7/July/2018
 */

var schema = require('../middleware/database.js');
const nodemailer = require('nodemailer');
"use strict"

class companyModel {
    constructor(company_name) {
        this.company_name = company_name;
    }

    getCompanyname() {
        return this.company_name;
    }

    toString() {
        return ` ${this.company_name}`;
    }

    registerCompany(callback) {
        console.log("company model section ......");
        //saving the bus model
        schema.registerCompany(this, callback);
    }
}
//export the class to be accessed  by other files
module.exports = companyModel;

//get all companies
module.exports.getAllCompanies = function getAllCompanies(callback) {
    console.log("models .... get all companies")
    schema.selectCompanies(callback);
}
