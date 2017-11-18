/*****************************************************
 * AUTHOR: Group 17 
 * 	(Oregon State University, CS 361)
 * Date: 11/13/2017
 * Description: Main code for running the Escape Plan 
 * Server
 * ***************************************************/


// ====== SETUP ==================
var express = require('express');
var app = express();
app.set('port', 3000);



// ======= HANDLEBARS SETUP ==========

var myHandlebars = require("express-handlebars").create({
  defaultLayout: "main",
    // (as in, main.handlebars, the file I made in my dir
});

app.engine("handlebars", myHandlebars.engine);
app.set("view engine", "handlebars"); // by default use ".handlebars" files


// ======== BODY PARSER ============
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// for static pages
app.use(express.static("public"));

// ====== DATABASE SETUP ============== 
var mysql = require("./mysqlSetup.js");



// HOME PAGE:
app.get("/", function(req,res, next){
    app.locals.test = "test";
    res.render('home');
});



// VICTIM ACTIVATE SYSTEM PAGE
app.get("/activate", function(req,res, next){
    res.render('activate');
});


// INITIAL VICTIM PAGE (creates new victim with location long/lat coordiantes)
app.post("/victim", function(req,res, next){
    var context = {};
    // Test output
    console.log(req.body);
    
    
    var lat = req.body.lat;
    var lon = req.body.lon;

    //  To grab victim ID for use in new case files
    var vicID;

    //Create a new victim
    mysql.pool.query("INSERT INTO victim (`location_lat`, `location_lon`) VALUES (?,?)", [lat, lon], function (err, result, next) {
        if (err) {
            next(err);
            return;
        }
        vicID = result.insertId;
    });

    //Create a new case file
    mysql.pool.query("INSERT INTO caseFile (`vicID`) VALUES (?)", [vicID], function (err, result, next) {
        if (err) {
            next(err);
            return;
        }
        app.locals.caseID = result.insertId;
    });

    res.render('victim');
});



// VOLUNTEER LOG IN PAGE
app.get("/volunteerLogIn", function(req,res, next){
    res.render('volunteerLogIn');
});


// VOLUNTEER INTERFACE:
app.post("/Ivolunteer", function(req,res, next){
    var context = {};
    var action = req.query.do;

    //================ Volunteer Log In ========================//
    if(action == "login") {
        var usr = req.body.uname;
        var psw = req.body.psw;

        mysql.pool.query("SELECT volunteer.id, volunteer.fname, volunteer.lname, volunteer.pnum, volunteer.approvalRating, Availability.description " +
            "FROM volunteer INNER JOIN Availability ON volunteer.availability = Availability.availability " +
            "WHERE usr=? AND pass=?", [usr, psw], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            context.results = result;
    	    res.render('Ivolunteer', context);
        });
    }


    //================ Update Availability ========================//
    else if(action == "updateAvailability"){
        var id = req.body.iId;
        var avail = req.body.iAvailable;

        mysql.pool.query("UPDATE volunteer SET availability=? WHERE id=?", [avail, id], function (err, result) {
            if (err) {
                next(err);
                return;
            }
        });

    	res.render('Ivolunteer');
    }

});



// =========== VOLUNTEER CONFIRMATION ============== //
app.get("/volAccDec", function(req,res, next){
    var context = {};
    var unavailable = 0;

    mysql.pool.query("SELECT volunteer.id, volunteer.fname, volunteer.lname, volunteer.pnum, " +
        "volunteer.location_lat, volunteer.location_lon, volunteer.carMake, volunteer.carModel, " +
        "volunteer.carColor FROM volunteer WHERE volunteer.availability != ?", [unavailable], function (err, result) {
        if (err) {
            next(err);
            return;
        }
       // console.log(result);
        context.results = result;
        res.render('volAccDec', context);
    });

});


// SHELTER LOG IN PAGE:
app.get("/shelterLogIn", function(req,res, next){
    res.render('shelterLogIn');
});


// SHELTER INTERFACE:
app.post("/Ishelter", function(req,res, next) {
    var context = {};

    var action = req.query.do;

    //================ Shelter Log In ========================//
    if(action == "login")
    {
        var usr = req.body.uname;
        var psw = req.body.psw;

        mysql.pool.query("SELECT shelter.id, shelter.name, shelter.pnum, shelter.capacity, Availability.description " +
            "FROM shelter INNER JOIN Availability ON shelter.availability = Availability.availability " +
            "WHERE usr=? AND pass=?", [usr, psw], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            console.log(result);
            context.results = result;
            res.render('Ishelter', context);
        });
    }

    //================ Update Shelter Capacity ========================//
    else if(action == "updateCap"){
        var id = req.body.iId;
        var cap = req.body.iCap;

        mysql.pool.query("UPDATE shelter SET capacity=? WHERE id=?", [cap, id], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            /*
             console.log(result);
             context.results = result;
             res.render('Ishelter', context);
             */
        });
        res.render('Ishelter');
    }
});






// =========== SHELTER CONFIRMATION ============== //
app.get("/shelterConfirm", function(req,res, next){
    var context = {};
    var unavailable = 0;

        mysql.pool.query("SELECT shelter.id, shelter.name FROM shelter WHERE shelter.availability != ?", [unavailable], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            console.log(result);
            context.results = result;
            res.render('shelterConfirm', context);
        });

});




// ==============Reset All Tables =================== //
// BULLET POINTS
// DO THIS LATER
app.get('/systemReset', function(req,res,next){
    var context = {};
    mysql.pool.query("DROP TABLE IF EXISTS todo", function(err){
        var createString = "CREATE TABLE todo(" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "name VARCHAR(255) NOT NULL," +
            "reps INT," +
            "weight INT," +
            "date DATE," +
            "lbs BOOLEAN)";
        mysql.pool.query(createString, function(err){
            context.results = "Table Reset";
            res.render('toDo', context);
        })
    });
});





// ================== ERRORS =============

app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});


// ============ PORT SETUP =============

app.listen(app.get('port'), "0.0.0.0", function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});





