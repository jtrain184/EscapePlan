
//document.addEventListener('DOMContentLoaded', bindButtons);


function displayVolunteers(filter) {
  // filter decides whether or not ALL volunteers are displayed or just active
  // 0 == all (default)
  // 1 == active volunteers only
  


	// How to show/hide the div:
	//var someDiv = document.getElementById("nameOfElementId");
	//someDiv.style.display = 'none'; // hides the div
  //someDiv.style.display = 'block'; // shows the div
}


function deleteShelter(id) {
  // make a post call, etc...
  
  alert("In the future, I will delete shelter with id: " + id);
}


function deleteVolunteer(id) {
  // make a post call, etc...
  
  alert("In the future, I will delete volunteer with id: " + id);
}

function showOptions(){
	var select = document.getElementById("userList");
	var option = select.options[select.selectedIndex].value;


	if(option == "volunteer"){
		//show the volunteer rating div
		var div = document.getElementById("volunteerRating");
		div.style.display = "inline-block";

		//hide the shelter capacity div
        var otherDiv = document.getElementById("shelterCap");
        otherDiv.style.display = "none";

	}
	if(option == "shelter"){
		//show the shelter capacity div
        var div = document.getElementById("shelterCap");
        div.style.display = "inline-block";

        //hide the volunteer rating div
        var otherDiv = document.getElementById("volunteerRating");
        otherDiv.style.display = "none";

	}
	if(option == "all"){
        //hide the volunteer rating div
        var otherDiv = document.getElementById("volunteerRating");
        otherDiv.style.display = "none";

        //hide the shelter capacity div
        var otherDiv = document.getElementById("shelterCap");
        otherDiv.style.display = "none";
	}
}






/*    EXAMPLE CODE MAKE A POST REQUEST TO escapePlan.js:
function sendAvailable(status) {

	var req = new XMLHttpRequest();
	var id = document.getElementById("volunteerId").textContent;

	var payload = {
		iId:id,
		iAvailable: status // 1 = available, 0 = not
	};

	req.open('POST','http://67.158.10.37:3000/Ivolunteer?do=updateAvailability', true);
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
*/


