/**
 * Created by Christopher on 11/14/2017.
 */

//used for tracking the volunteer list
var index = 0;

window.onload = displayRow;

//displays by default, the first volunteer in the table
function displayRow(){
    if(document.getElementById("i0")) {
        var row = document.getElementById("i0");
        row.style.display = "block";
    }
}

function accept(volID){
    //create a form to send Volunteer Info to Victim
    var form = document.createElement('form');
    form.style.visibility = 'hidden';
    form.method = 'POST';
    form.action = 'http://67.158.10.37:3000/victim?do=help';

    //create input to hold POST data being sent eg:Volunteer ID
    var input = document.createElement('input');
    input.name = 'id';
    input.value = volID;

    //add input to form, then add form to page
    form.appendChild(input);
    document.body.appendChild(form);

    //submit the form to the server
    form.submit();
}

function reject(){
    //hide the Volunteer that rejected service
    var row = document.getElementById("i" + index);
    row.style.display = "none";

    //increase the index
    index++;

    //show the next volunteer
    if(document.getElementById("i" + index)) {
        row = document.getElementById("i" + index);
        row.style.display = "block";
    }
    //if no more volunteers are left
    else{
        document.getElementById('noVolunteers').innerHTML = "No Volunteers Available. Alerting System";
        var button = document.getElementById('reject');
        button.disabled = true;

        //navigate to the victim page and alert them no volunteers are available
        window.location.href = 'http://67.158.10.37:3000/victim?do=noHelp';
    }
}
