/**
 * Created by Christopher on 11/14/2017.
 */
document.addEventListener('DOMContentLoaded', bindButtons);
function editCap() {
    var input = document.getElementById("cap");
    input.disabled = false;
    console.log("click me hard");
}
function bindButtons() {
    document.getElementById('cap').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            var input = document.getElementById('cap');

            console.log("You entered me!");

            console.log(input.parentNode.parentNode.lastChild.previousSibling.childNodes);
            var id = input.parentNode.parentNode.lastChild.previousSibling.textContent;
            console.log(id);

            var req = new XMLHttpRequest();




            req.open('GET','http://67.158.10.37:3000/shelterUpdate?id=' + id + '&cap=' + input.value, true);
            req.addEventListener('load', function(){
                if(req.status >= 200 && req.status < 400){
                    input.disabled = true;
                    console.log("I'm a changed person now ;)");
                }
                else{
                    console.log("Error in network request: " + req.statusText);
                }
            });
            req.send(null);


        }
    });
}