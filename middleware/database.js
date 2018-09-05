//database schema model for 
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://jvnunenmsixtda:fd050031169d5d2adc01d0c0f191a73c8b67a7a9eafbeca96f6973a052e45fcb@ec2-50-19-232-205.compute-1.amazonaws.com:5432/d3o1u74nfnh9jm?ssl=true';
const client = new pg.Client(connectionString);
client.connect()
const results = [];

//function to enter bus data into the database
module.exports.registerBus = async function (communicationMode, callback) {
    var numberplate = communicationMode.getNumberplate();
    var seats = 45;

    client.query('INSERT INTO public.bus(numberplate,seats)VALUES($1,$2)',
        [numberplate, seats], (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log('data saved successfully');
            }
        })
}



//register all companies
module.exports.registerCompany = async function (communicationMode, callback) {
    var company_name = communicationMode.getCompanyname();
    client.query('INSERT INTO public.company(companyname)VALUES($1)',
        [company_name], (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log('data saved successfully');
            }
        })
}


/*****All the get scripts go here**** */
module.exports.selectAllBuses = async function selectAllBuses(callback) {
    const query = client.query('SELECT * FROM public.bus', (err, result) => {
        if (err) {
            callback(err, results)
        } else {
            query.on('row', (row) => {
                results.push(row);
            });

            query.on('end', () => {
               // console.log("get all buses ...........", result);
                callback(err, result)
            });

        }

    });
}

//get all company name
module.exports.selectCompanies = async function selectCompanies(callback) {
    const query = client.query('SELECT * FROM public.company', (err, result) => {
        if (err) {
            callback(err, results)
        } else {
            query.on('row', (row) => {
                results.push(row);
            });

            query.on('end', () => {
               // console.log("get all companies ...........", result);
                callback(err, result)
            });

        }

    });
}