/**
 * Created by Christopher on 11/14/2017.
 */

var index = 0;
var editInstructions = document.getElementById("editInstructions");

document.addEventListener('DOMContentLoaded', bindButtons);
window.onload = displayRow;

function displayRow(){
    if(document.getElementById("i0")) {
        console.log("Bye");
        var row = document.getElementById("i0");
        row.style.display = "block";
    }
}

function editCap() {
    var editInstructions = document.getElementById("editInstructions");

    //display instructions to user
    if (editInstructions.style.display == 'none')
        editInstructions.style.display = 'block';

    //allow user to edit the capacity
    var input = document.getElementById("cap");
    input.disabled = false;
    input.focus();

}
function bindButtons() {
    if(document.getElementById('cap')) {             
        document.getElementById('cap').addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                // Hide edit instructions to user after they have pressed Enter
                var editInstructions = document.getElementById("editInstructions");
                editInstructions.style.display = 'none';
                var input = document.getElementById('cap');

                //get ID of shelter
                var id = input.parentNode.parentNode.lastChild.previousSibling.textContent;

                var req = new XMLHttpRequest();
                var payload = {
                    iId: id,
                    iCap: input.value
                };

                req.open('POST', 'http://67.158.10.37:3000/IShelter?do=updateCap', true);
                req.addEventListener('load', function () {
                    if (req.status >= 200 && req.status < 400) {
                        input.disabled = true;
                        console.log("I'm a changed person now ;)");
                    }
                    else {
                        console.log("Error in network request: " + req.statusText);
                    }
                });
                req.setRequestHeader('Content-Type', 'application/json');
                req.send(JSON.stringify(payload));
                console.log(payload);
                event.preventDefault();


            }
        });
    }
}

function reject(){
    var row = document.getElementById("i" + index);
    row.style.display = "none";

    index++;

    if(document.getElementById("i" + index)) {
        row = document.getElementById("i" + index);
        row.style.display = "block";
    }
    else{
        document.getElementById('noShelter').innerHTML = "No Shelters Available. Alerting System";
        var button = document.getElementById('reject');
        button.disabled = true;

        //navigate to the victim page and alert them no volunteers are available
        window.location.href = 'http://67.158.10.37:3000/victim?do=noHelp';
    }

}


function accept(sID){
    //create a form to send Shelter Info to Volunteer
    var form = document.createElement('form');
    form.style.visibility = 'hidden';
    form.method = 'POST';
    form.action = 'http://67.158.10.37:3000/volAccDec';

    //create input to hold POST data being sent eg:Shelter ID
    var input = document.createElement('input');
    input.name = 'id';
    input.value = sID;

    //add input to form, then add form to page
    form.appendChild(input);
    document.body.appendChild(form);

    //submit the form to the server
    form.submit();
}


function clickAvailability() {
    var availabilityDiv = document.getElementById("availability");
    if (availabilityDiv.style.display == 'block')
        availabilityDiv.style.display = 'none';
    else
        availabilityDiv.style.display = 'block';
    console.log("FOUND IT!");
}





function sendAvailable(status) {


    var req = new XMLHttpRequest();
    var id = document.getElementById("sid").textContent;

    var payload = {
        iId:id,
        iAvailable: status // 1 = available, 0 = not
    };

    req.open('POST','http://67.158.10.37:3000/Ishelter?do=updateAvailability', true);
    req.addEventListener('load', function(){
        if(req.status >= 200 && req.status < 400){

            // Update the value in the table:
            if (status == 0)
                document.getElementById("availabilityText").textContent = "No";
            else
                document.getElementById("availabilityText").textContent = "Yes";
        }
        else{
            console.log("Error in network request: " + req.statusText);
        }
    });
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(payload));
    event.preventDefault();


    // Hide the availability div again:
    var availabilityDiv = document.getElementById("availability");
    availabilityDiv.style.display = 'none';
}


