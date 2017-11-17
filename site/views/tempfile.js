
// SHELTER INTERFACE:
app.post("/Ivolunteer", function(req,res, next) {
    var context = {};
    var action = req.query.do;


	req.open('POST','http://67.158.10.37:3000/Ivolunteer?do=updateAvailability', true);


    //================ Update Shelter Capacity ========================//
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


