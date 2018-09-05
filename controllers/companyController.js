
"use strict"
var companyModel = require('../models/companyModel.js');

module.exports.registerCompany = async function registerCompany(company_name, callback) {
    console.log("controller company controller......");
    var company = new companyModel(company_name); 
     company.registerCompany(callback);
}

//get all companies
module.exports.getAllCompanies = function getAllCompanies(callback) {
    console.log("controllers .....get all companies")
    companyModel.getAllCompanies(callback);
}


