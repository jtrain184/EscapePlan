/*****************************************************
 * AUTHOR: Group 17
 *    (Oregon State University, CS 361)
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
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// for static pages
app.use(express.static("public"));

// ====== DATABASE SETUP ============== 
var mysql = require("./mysqlSetup.js");


// HOME PAGE:
app.get("/", function (req, res, next) {
    app.locals.test = "test";
    res.render('home');
});


// |=====================================================|
// |                 VICTIM INTERACTIONS                 |
// |=====================================================|

// VICTIM ACTIVATE SYSTEM PAGE
app.get("/activate", function (req, res, next) {
    res.render('activate');
});


// INITIAL VICTIM PAGE (creates new victim with location long/lat coordiantes)
app.post("/victim", function (req, res, next) {
    var context = {};
    var action = req.query.do;

    // If loading from Volunteer Confirmation Page
    if (action == "volConfirm") {
        context.confirm = "The volunteer has arrived";
        res.render('victim', context);
    }

    //if a volunteer has accepted
    else if (action == "help") {
        var volID = req.body.id;

        //add volunteer to case file
        mysql.pool.query("UPDATE caseFile SET volID=? WHERE id=?", [volID, app.locals.caseID], function (err, result, next) {
            if (err) {
                next(err);
                return;
            }

        });

        //get and load the volunteers info on the victim's page
        mysql.pool.query("SELECT volunteer.fname, volunteer.lname, volunteer.pnum, " +
            "volunteer.carMake, volunteer.carModel, volunteer.carColor FROM volunteer " +
            "WHERE volunteer.id=?", [volID], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            context.help = result;

            res.render('victim', context);
        });

    }

    // If loading from activate page
    else {
        // Test output
        console.log(req.body);

        var lat = req.body.lat;
        var lon = req.body.lon;

        //  To grab victim ID for use in new case files
        var vicID = null;

        //Create a new victim
        mysql.pool.query("INSERT INTO victim (`location_lat`, `location_lon`) VALUES (?,?)", [lat, lon], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            console.log("This is the result: " + result.insertId);
            vicID = result.insertId;

        });

        //call the function to create a new caseFile after 0.5 secs(needed to set the vicID)
        setTimeout(newCase, 500);

        //Create a new case file
        function newCase() {
            console.log("This is the var: " + vicID);
            mysql.pool.query("INSERT INTO caseFile (`vicID`) VALUES (?)", [vicID], function (err, result, next) {
                if (err) {
                    next(err);
                    return;
                }
                app.locals.caseID = result.insertId;
            });
        }

        context.newVic = "Victim and Case Created";
        res.render('victim', context);
    }
});


//When no volunteers or shelters are available
app.get("/victim", function (req, res, next) {
    var context = {};

    //add comment to caseFILE
    mysql.pool.query("UPDATE caseFile SET comments=? WHERE id=?",
        ["No volunteers/shelters available", app.locals.caseID], function (err, result, next) {
            if (err) {
                next(err);
                return;
            }

        });
    context.noHelp = "No Help Available";
    res.render('victim', context);
});


// |=====================================================|
// |             VOLUNTEER INTERACTIONS                  |
// |=====================================================|


// VOLUNTEER LOG IN PAGE
app.get("/volunteerLogIn", function (req, res, next) {
    res.render('volunteerLogIn');
});


// VOLUNTEER INTERFACE:
app.post("/Ivolunteer", function (req, res, next) {
    var context = {};
    var action = req.query.do;

    //================ Volunteer Log In ========================//
    if (action == "login") {
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
    else if (action == "updateAvailability") {
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
app.post("/volAccDec", function (req, res, next) {
    var context = {};
    var unavailable = 0;

    var sID = req.body.id;
    //add shelter to case file
    mysql.pool.query("UPDATE caseFile SET sID=? WHERE id=?", [sID, app.locals.caseID], function (err, result, next) {
        if (err) {
            next(err);
            return;
        }
    });

    /********************************************************
     Code To Update Shelter Capacity Here
     ********************************************************/

    var shelterCap;
    mysql.pool.query("SELECT shelter.name, shelter.location_lat, shelter.location_lon, shelter.capacity " +
        "FROM shelter WHERE shelter.id=?", [sID], function (err, shelterInfo) {
        if (err) {
            next(err);
            return;
        }
        console.log(context);
        context.shelter = shelterInfo;
        shelterCap = context.shelter[0].capacity;
    });

    setTimeout(changeCap, 500);
    function changeCap() {
        if (shelterCap == 1) {
            //change avail
            mysql.pool.query("UPDATE shelter SET availability=? WHERE id=?", [0, sID], function (err, result, next) {
                if (err) {
                    next(err);
                    return;
                }
            });
        }
        //update capacity
        mysql.pool.query("UPDATE shelter SET capacity=capacity - 1 WHERE id=?", [sID], function (err, result, next) {
            if (err) {
                next(err);
                return;
            }
        });

    }


    mysql.pool.query("SELECT volunteer.id, volunteer.fname, volunteer.lname " +
        "FROM volunteer WHERE volunteer.availability != ?", [unavailable], function (err, result) {
        if (err) {
            next(err);
            return;
        }
        console.log(context);
        context.results = result;
        res.render('volAccDec', context);
    });

});

// ================= VOLUNTEER ARRIVAL CONFIRMATION ========= //
app.get("/volArrConfirm", function (req, res, next) {
    res.render('volArrConfirm');
});


// |=====================================================|
// |                 SHELTER INTERACTIONS                |
// |=====================================================|

// SHELTER LOG IN PAGE:
app.get("/shelterLogIn", function (req, res, next) {
    res.render('shelterLogIn');
});


// SHELTER INTERFACE:
app.post("/Ishelter", function (req, res, next) {
    var context = {};

    var action = req.query.do;

    //================ Shelter Log In ========================//
    if (action == "login") {
        var usr = req.body.uname;
        var psw = req.body.psw;

        mysql.pool.query("SELECT shelter.id, shelter.name, shelter.pnum, shelter.capacity, Availability.description " +
            "FROM shelter INNER JOIN Availability ON shelter.availability = Availability.availability " +
            "WHERE usr=? AND pass=?", [usr, psw], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            context.results = result;
            res.render('Ishelter', context);
        });
    }

    //================ Update Shelter Capacity ========================//
    else if (action == "updateCap") {
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
app.get("/shelterConfirm", function (req, res, next) {
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


// |=====================================================|
// |                ADMIN INTERACTIONS                   |
// |=====================================================|

// Admin LOG IN PAGE:
app.get("/adminLogIn", function (req, res, next) {
    res.render('adminLogIn');
});


// admin INTERFACE:
app.post("/Iadmin", function (req, res, next) {
    var context = {};
    var action = req.query.do;

    //================ Admin Log In ========================//
    if (action == "login") {
        var usr = req.body.uname;
        var psw = req.body.psw;

        mysql.pool.query("SELECT id, name FROM admin WHERE usr=? AND pass=?", [usr, psw], function (err, result) {
            if (err) {
                next(err);
                return;
            }

            context.admin = result;

            // Grab ALL the shelter data:
            mysql.pool.query("SELECT * FROM shelter", function (err, rows, fields) {
                if (err) {
                    next(err);
                    return;
                }

                // shelter information can be accessed through these objects:
                context.numShelters = rows.length;
                context.shelter = [];

                storeShelterInfo(rows, context);


                // Grab ALL the volunteer data:
                mysql.pool.query("SELECT * FROM volunteer", function (err, rows, fields) {
                    if (err) {
                        next(err);
                        return;
                    }

                    // volunteer information can be accessed through these objects:
                    context.numVolunteers = rows.length;
                    context.volunteer = [];

                    storeVolunteerInfo(rows, context);

                    // NOW THAT WE HAVE COLLECTED ALL THE DATA,
                    // FINALLY RENDER THE PAGE:
                    res.render('Iadmin', context);

                }); // end selecting volunteers
            }); // end selecting shelters
        }); // end selecting admin
    } // end action == login

    else if (action == "filter") {
        var adminID = req.body.adminID;
        var userList = req.body.userList;
        var queryOptions = {
            availableList:req.body.availableList,
            volunteerRating:req.body.volunteerRating,
            shelterCap:req.body.shelterCap
        }
        setQuery(queryOptions);
        /*
        var availableList = req.body.availableList;
        var volunteerRating = req.body.volunteerRating;
        var shelterCap = req.body.shelterCap;

        console.log(req.body);


        //set availability query
        var volunteerAvailability;
        var shelterAvailability;
        if (availableList == "all") {
            shelterAvailability = " (shelter.availability = 1 OR shelter.availability = 0) ";
            volunteerAvailability = " (volunteer.availability = 1 OR volunteer.availability = 0) ";
        }
        if (availableList == "0") {
            shelterAvailability = " shelter.availability = 0 ";
            volunteerAvailability = " (volunteer.availability = 0) ";
        }
        if (availableList == "1") {
            shelterAvailability = " shelter.availability = 1 ";
            volunteerAvailability = " (volunteer.availability = 1) ";
        }

        //set volunteer approval rating
        if (volunteerRating == "all") {
            volunteerRating = " volunteer.approvalRating > -1 ";
        }
        if (volunteerRating == "0.5") {
            volunteerRating = " volunteer.approvalRating > 0.49 ";
        }
        if (volunteerRating == "0.49") {
            volunteerRating = " volunteer.approvalRating < 0.5 ";
        }
        //set shelter capacity query
        if (shelterCap == "all") {
            shelterCap = " shelter.capacity > -1 ";
        }
        if (shelterCap == "0") {
            shelterCap = " shelter.capacity = 0 ";
        }
        if (shelterCap == "1") {
            shelterCap = "(shelter.capacity > 0 AND shelter.capacity < 5) ";
        }
        if (shelterCap == "5") {
            shelterCap = " shelter.capacity > 4 ";
        }
*/

        mysql.pool.query("SELECT id, name FROM admin WHERE id=?", [adminID], function (err, result) {
            if (err) {
                next(err);
                return;
            }

            context.admin = result;

            // ==================    Filter only by availability ========================= //
            if (userList == "all") {
                // Grab ALL the shelter data:
                mysql.pool.query("SELECT * FROM shelter WHERE " + queryOptions.shelterAvailability + " AND " + queryOptions.shelterCap, function (err, rows, fields) {
                    if (err) {
                        next(err);
                        return;
                    }
                    // shelter information can be accessed through these objects:
                    context.numShelters = rows.length;
                    context.shelter = [];

                    storeShelterInfo(rows, context);

                    // Grab ALL the volunteer data:
                    mysql.pool.query("SELECT * FROM volunteer WHERE " + queryOptions.volunteerAvailability + " AND " + queryOptions.volunteerRating, function (err, rows, fields) {
                        if (err) {
                            next(err);
                            return;
                        }
                        // volunteer information can be accessed through these objects:
                        context.numVolunteers = rows.length;
                        context.volunteer = [];

                        storeVolunteerInfo(rows, context);

                        res.render('Iadmin', context);
                    }); //end select volunterr info

                });//end select shelter info
            } // ============================ End of Filter only by availability ========================= //

            // ============================ Filter Shelter Options ========================= //
            if (userList == "shelter") {
                // Grab ALL the shelter data:
                mysql.pool.query("SELECT * FROM shelter WHERE " + queryOptions.shelterAvailability + " AND " + queryOptions.shelterCap, function (err, rows, fields) {
                    if (err) {
                        next(err);
                        return;
                    }
                    // shelter information can be accessed through these objects:
                    context.numShelters = rows.length;
                    context.shelter = [];

                    storeShelterInfo(rows, context);
                    res.render('Iadmin', context);
                });
            } // ============================ End of Filter Shelter Options ========================= //

            // ============================ Filter Volunteer Options ========================= //
            if (userList == "volunteer") {
                // Grab ALL the volunteer data:
                mysql.pool.query("SELECT * FROM volunteer WHERE " + queryOptions.volunteerAvailability + " AND " + queryOptions.volunteerRating, function (err, rows, fields) {
                    if (err) {
                        next(err);
                        return;
                    }
                    // volunteer information can be accessed through these objects:
                    context.numVolunteers = rows.length;
                    context.volunteer = [];

                    storeVolunteerInfo(rows, context);
                    res.render('Iadmin', context);
                });
            } // ============================ End of Filter Volunteer Options ========================= //

        }); // end selecting admin
    }//end if do = filter

}); //end of Iadmin


//Admin functions
function storeShelterInfo(rows, context) {
    var index;
    for (index = 0; index < context.numShelters; index++) {
        var row = rows[index];
        context.shelter.push({
            id: row.id,
            name: row.name,
            pnum: row.pnum,
            location_lat: row.location_lat,
            location_lon: row.location_lon,
            capacity: row.capacity,
            availability: row.availability
        });
    } // end for
}

function storeVolunteerInfo(rows, context) {
    var index;
    for (index = 0; index < context.numVolunteers; index++) {
        var row = rows[index];
        context.volunteer.push({
            id: row.id,
            fname: row.fname,
            lname: row.lname,
            pnum: row.pnum,
            availability: row.availability,
            approvalRating: row.approvalRating,
            carMake: row.carMake,
            carModel: row.carModel,
            carColor: row.carColor
        });
    } // end for
}

function setQuery(queryOptions){
    //set availability query
    if (queryOptions.availableList == "all") {
        queryOptions.shelterAvailability = " (shelter.availability = 1 OR shelter.availability = 0) ";
        queryOptions.volunteerAvailability = " (volunteer.availability = 1 OR volunteer.availability = 0) ";
    }
    if (queryOptions.availableList == "0") {
        queryOptions.shelterAvailability = " shelter.availability = 0 ";
        queryOptions.volunteerAvailability = " (volunteer.availability = 0) ";
    }
    if (queryOptions.availableList == "1") {
        queryOptions.shelterAvailability = " shelter.availability = 1 ";
        queryOptions.volunteerAvailability = " (volunteer.availability = 1) ";
    }

    //set volunteer approval rating
    if (queryOptions.volunteerRating == "all") {
        queryOptions.volunteerRating = " volunteer.approvalRating > -1 ";
    }
    if (queryOptions.volunteerRating == "0.5") {
        queryOptions.volunteerRating = " volunteer.approvalRating > 0.49 ";
    }
    if (queryOptions.volunteerRating == "0.49") {
        queryOptions.volunteerRating = " volunteer.approvalRating < 0.5 ";
    }
    //set shelter capacity query
    if (queryOptions.shelterCap == "all") {
        queryOptions.shelterCap = " shelter.capacity > -1 ";
    }
    if (queryOptions.shelterCap == "0") {
        queryOptions.shelterCap = " shelter.capacity = 0 ";
    }
    if (queryOptions.shelterCap == "1") {
        queryOptions.shelterCap = "(shelter.capacity > 0 AND shelter.capacity < 5) ";
    }
    if (queryOptions.shelterCap == "5") {
        queryOptions.shelterCap = " shelter.capacity > 4 ";
    }

}


// |=====================================================|
// |                OTHER / TOOLS                        |
// |=====================================================|

// ==============Reset All Tables =================== //
// BULLET POINTS
// DO THIS LATER
app.get('/systemReset', function (req, res, next) {
    var context = {};
    mysql.pool.query("DROP TABLE IF EXISTS todo", function (err) {
        var createString = "CREATE TABLE todo(" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "name VARCHAR(255) NOT NULL," +
            "reps INT," +
            "weight INT," +
            "date DATE," +
            "lbs BOOLEAN)";
        mysql.pool.query(createString, function (err) {
            context.results = "Table Reset";
            res.render('toDo', context);
        })
    });
});


// ================== ERRORS =============

app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.send('500 - Server Error');
});


// ============ PORT SETUP =============

app.listen(app.get('port'), "0.0.0.0", function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});





