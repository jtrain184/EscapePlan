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

// ====== DATABASE SETUP ============== TODO Chris
var mysql = require("./mysqlSetup.js");

// TEST CALL:
app.get('/select',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM test', function(err, rows, next){
      if(err){
            next(err);
            return;
      }
      res.send(JSON.stringify(rows));
      });
});



// HOME PAGE:
app.get("/", function(req,res, next){
    res.render('home');
});


// victim activate system page
app.get("/activate", function(req,res, next){
    var context = {};

    var lat = req.query.lat;
    var lon = req.query.lon;

    mysql.pool.query("INSERT INTO victim (`location_lat`, `location_lon`) VALUES (?,?)", [lat, lon], function (err, result) {
        if (err) {
            next(err);
            return;
        }
    });


    res.render('victim');
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




// VOLUNTEER INTERFACE:
app.get("/Ivolunteer", function(req,res, next){
    res.render('Ivolunteer');
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





