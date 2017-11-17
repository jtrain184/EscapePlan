
//document.addEventListener('DOMContentLoaded', bindButtons);

function clickAvailability() {
	var availabilityDiv = document.getElementById("availability");
	if (availabilityDiv.style.display == 'block')
		availabilityDiv.style.display = 'none';
	else
		availabilityDiv.style.display = 'block';
	console.log("FOUND IT!");
}



function sendIsAvailable() {

	var req = new XMLHttpRequest();
	var id = document.getElementById("volunteerId").textContent;

	console.log("this is what we are wondering: " + id);

	var payload = {
		iId:id,
		iAvailable: 1 // value for is available
	};

	req.open('POST','http://67.158.10.37:3000/Ivolunteer?do=updateAvailability', true);
	req.addEventListener('load', function(){
		if(req.status >= 200 && req.status < 400){
			// Update the value in the table:
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





function sendIsNotAvailable() {


	var req = new XMLHttpRequest();
	var id = document.getElementById("volunteerId").textContent;

	console.log("this is what we are wondering: " + id);

	var payload = {
		iId:id,
		iAvailable: 0 // value for is NOT available
	};

	req.open('POST','http://67.158.10.37:3000/Ivolunteer?do=updateAvailability', true);
	req.addEventListener('load', function(){
		if(req.status >= 200 && req.status < 400){
			// Update the value in the table:
			document.getElementById("availabilityText").textContent = "No";
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



