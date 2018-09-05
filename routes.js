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


// npm install --save neo4j-driver
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://54.236.56.38:34142', neo4j.auth.basic('micheal', 'businesses-stapler-photograph'));
var session = driver.session();



//default index route
router.get('/', function (req, res) {
    session
        .run("MATCH (n:Movie) RETURN n LIMIT 24")
        .then(function (result) {
            var movieArray = [];
            result.records.forEach(function (record) {
                movieArray.push({
                    id: record._fields[0].identity.low,
                    title: record._fields[0].properties.title,
                    year: record._fields[0].properties.year
                });
            });

            session
                .run('MATCH (n:Actor) RETURN n LIMIT 23')
                .then(function (result2) {
                    var actorArray = [];
                    result2.records.forEach(function (record) {
                        actorArray.push({
                            id: record._fields[0].identity.low,
                            name: record._fields[0].properties.name,
                        })
                    })

                    res.render('index', {
                        movies: movieArray,
                        actors: actorArray

                    });

                })
                .catch(function (err) {
                    console.log(err)
                })


                .catch(function (err) {
                    console.log(err)
                })

        })

        .catch(function (err) {
            console.log(err)
        })
});

//add the route to add requests
router.post('/buscompany/add', function (req, res) {
    //supposed to save these to the database
    var company_name = req.body.company_name;

    companyController.registerCompany(req.body.company_name, (result, err) => {
        if (err) {
            res.status(400).json(err)

        } else {

            res.status(200).json(result);
        }
    });

    //get all the companies from the database
    companyController.getAllCompanies((err, results) => {
        for (var g = 0; g < results.rows.length; g++) {

            session
                .run('CREATE(n:Company {companyname:{companynameParam}}) RETURN n.companyname', { companynameParam: results.rows[g].companyname })
                .then(function (result) {

                    res.redirect('/')
                    session.close(company_name)

                })

                .catch(function (err) {
                    console.log(err)

                });
        }
    });
})

// add bus company
router.post('/bus/add', function (req, res) {

    var bus_numberplate = req.body.bus_numberplate;
    var seats = 45;
    //supposed to save these to the database

    DataController.registerBus(req.body.bus_numberplate, seats, (result, err) => {
        if (err) {
            res.status(400).json(err)

        } else {

            res.status(200).json(result);
        }
    });

    //run a loop to get all records from the database however
    //there is an error in the console. however no worries for now
    // get all buses record from the datasea
    DataController.getAllBuses((err, results) => {
        for (var g = 0; g < results.rows.length; g++) {
            session
                .run('CREATE(n:Bus {numberplate:{bus_numberplateParam}}) RETURN n.bus_numberplate', { bus_numberplateParam: results.rows[g].numberplate })
                .then(function (result) {
                    res.redirect('/')
                    res.finished = true
                    session.close(bus_numberplate)
                })
                .catch(function (err) {
                    console.log(err)
                });
        }
    });
})


// add bus company
router.post('/route/add', function (req, res) {
    var route_name = req.body.route_name;

    //ment to save these in the database

    session
        .run('CREATE(n:Route {route_name:{route_nameParam}}) RETURN n.route_name', { route_nameParam: route_name })
        .then(function (result) {
            res.redirect('/')
            session.close(route_name)
        })

        .catch(function (err) {
            console.log(err)
        });

})

//add bus stop name
router.post('/bstop/add', function (req, res) {
    var bus_stopname = req.body.bus_stopname;

    //ment to save these in the database

    session
        .run('CREATE(n:Bstop {bus_stopname:{bus_stopnameParam}}) RETURN n.bus_stopname', { bus_stopnameParam: bus_stopname })
        .then(function (result) {
            res.redirect('/')
            session.close(bus_stopname)
        })

        .catch(function (err) {
            console.log(err)

        });

})

//add passenger
router.post('/passenger/add', function (req, res) {
    var passenger_name = req.body.passenger_name;

    //ment to save these in the database

    session
        .run('CREATE(n:Passenger {passenger_name:{passenger_nameParam}}) RETURN n.passenger_name', { passenger_nameParam: passenger_name })
        .then(function (result) {
            res.redirect('/')
            session.close(passenger_name)
        })

        .catch(function (err) {
            console.log(err)

        });

})


//add places or locations

router.post('/place/add', function (req, res) {
    var place_name = req.body.place_name;

    //ment to save these in the database

    session
        .run('CREATE(n:Place {place_name:{place_nameParam}}) RETURN n.place_name', { place_nameParam: place_name })
        .then(function (result) {
            res.redirect('/')
            session.close(place_name)
        })

        .catch(function (err) {
            console.log(err)

        });
})

//building a relationships between places and bus stop
router.post('/place/bstop/add', function (req, res) {
    var bus_stopname = req.body.busstop_name;
    var place_name = req.body.place_name;

    session
        .run('MATCH(a:Place {place_name:{place_nameParam}}), (b:Bstop {bus_stopname:{bus_stopnameParam}}) MERGE(b)-[r:LOCATED_IN]-(a) RETURN a,b ', { place_nameParam: place_name, bus_stopnameParam: bus_stopname })
        .then(function (result) {
            res.redirect('/')
            session.close()
        })

        .catch(function (err) {
            console.log(err)

        });

})

//building a relationships between bus stops and busess
router.post('/bus/bstop/add', function (req, res) {
    var bus_stopname = req.body.busstop_name;
    var numberplate = req.body.bus_numberplate;
    var time = req.body.time;

    session
    .run('MERGE(a:Bus {numberplate:{numberplateParam}}) MERGE(b:Bstop {bus_stopname:{bus_stopnameParam}}) MERGE(b)-[r:PASSED_AT {time:{timeParam}}]-(a) RETURN a,b ', {timeParam:time, numberplateParam: numberplate, bus_stopnameParam: bus_stopname })
    .then(function (result) {
            res.redirect('/')
            session.close()
        })

        .catch(function (err) {
            console.log(err)
        });
})

//building a relationships between bus routes and buses
router.post('/bus/route/add', function (req, res) {
    var route_name = req.body.route_name;
    var bus_numberplate = req.body.bus_numberplate;

    session
        .run('MATCH(a:Route {route_name:{route_nameParam}}), (b:Bus {bus_numberplate:{bus_numberplateParam}}) MERGE(b)-[r:PASSED_AT]-(a) RETURN a,b ', { route_nameParam: route_name, bus_numberplateParam: bus_numberplate })
        .then(function (result) {
            res.redirect('/')
            session.close()
        })

        .catch(function (err) {
            console.log(err)
        });
})


//building a relationships between passengers and bus stops
router.post('/passenger/busstop/add', function (req, res) {
    var passenger_name = req.body.passenger_name;
    var bus_stopname = req.body.busstop_name;

    session
        .run('MATCH(a:Passenger {passenger_name:{passenger_nameParam}}), (b:Bstop {bus_stopname:{bus_stopnameParam}}) MERGE(b)-[r:BOARDED_FROM]-(a) RETURN a,b ', { passenger_nameParam: passenger_name, bus_stopnameParam: bus_stopname })
        .then(function (result) {
            res.redirect('/')
            session.close()
        })

        .catch(function (err) {
            console.log(err)
        });
})


//building a relationships between routes to bus stops
router.post('/route/busstop/add', function (req, res) {
    var route_name = req.body.route_name;
    var bus_stopname = req.body.busstop_name;

    session
        .run('MATCH(a:Route {route_name:{route_nameParam}}), (b:Bstop {bus_stopname:{bus_stopnameParam}}) MERGE(b)-[r:LOCATED_ON]-(a) RETURN a,b ', { route_nameParam: route_name, bus_stopnameParam: bus_stopname })
        .then(function (result) {
            res.redirect('/')
            session.close()
        })

        .catch(function (err) {
            console.log(err)
        });
})

//link bus stop to another bus stop give the properties as time and distance
router.post('/busstop/busstop/add', function (req, res) {
    var bus_stopname1 = req.body.busstop_name1;
    var bus_stopname = req.body.busstop_name;
    var cost = req.body.cost;


    session
        .run('MERGE (a:Bstop {bus_stopname:{bus_stopname1Param}}) MERGE (b:Bstop {bus_stopname:{bus_stopnameParam}}) MERGE(b)-[:COST {cost:{costParam}}]-(a) RETURN a,b ', { costParam: cost, bus_stopname1Param: bus_stopname1, bus_stopnameParam: bus_stopname })
        .then(function (result) {
            res.redirect('/')
            session.close()
        })

        .catch(function (err) {
            console.log(err)
        });
})

//building a relationships between bus companies  and  Buses
router.post('/bus/company/add', function (req, res) {
    var bus_numberplate = req.body.bus_numberplate;
    var company_name = req.body.company_name;
    session
        .run('MATCH(a:Company {company_name:{company_nameParam}}), (b:Bus {bus_numberplate:{bus_numberplateParam}}) MERGE(b)-[r:OWNED_BY]-(a) RETURN a,b ', { company_nameParam: company_name, bus_numberplateParam: bus_numberplate })
        .then(function (result) {
            res.redirect('/')
            session.close()
        })
        .catch(function (err) {
            console.log(err)
        });
})

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