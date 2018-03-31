let container, canv, input, dateInput, button; 
let sleepQualityInput, sleepLengthInput, sleepLengthContainer;


let loggedInUser;

function setup(){
	container = createElement('div').id('container');
	canv = createCanvas(600, 400).parent(container);
	input = createInput('beverages').parent(container);

	//sleepQualityInput = createInput('sleep quality').parent(container);
	sleepQualityInput = document.createElement("INPUT");
	sleepQualityInput.setAttribute("type", "number");
	sleepQualityInput.setAttribute("min", 0);
	sleepQualityInput.setAttribute("max", 100);
	sleepQualityInput.setAttribute("id", 'sleepQualityInput');
	document.getElementById('container').appendChild(sleepQualityInput);



 //    sleepLengthInput = createElement("INPUT").id('sleepLengthInput');
	// sleepLengthHour = document.createElement("INPUT");
	// sleepLengthHour.setAttribute("type", "number");
	// sleepLengthHour.setAttribute("min", 0);
	// sleepLengthHour.setAttribute("id", 'sleepLengthHour');
	// sleepLengthMinute = document.createElement("INPUT");
	// sleepLengthMinute.setAttribute("type", "number");
	// sleepLengthMinute.setAttribute("min", 0);
 //    sleepLengthMinute.setAttribute("max", 59);
 //    sleepLengthMinute.setAttribute("id", 'sleepLengthMinute');
 //    document.getElementById('sleepLengthInput').appendChild(sleepLengthHour);
 //    document.getElementById('sleepLengthInput').appendChild(sleepLengthMinute);
    
 //    document.getElementById('container').appendChild(sleepLengthInput);


	sleepLengthInput = createInput('sleep length').parent(container);




	dateInput = document.createElement("INPUT");
    dateInput.setAttribute("type", "date");
    dateInput.setAttribute("value", new Date());
    dateInput.setAttribute("id", 'dateInput');
    document.getElementById('container').appendChild(dateInput);


    //sleepInput = createFileInput(formatCSV);



   	

	button = createButton('submit').parent(container);
	button.mousePressed(submitToFirebase);
	container.hide(); // don't show by default, wait until user signs in 

	//.parent(container);

	
}

function plotChart(){
	background(200);
	let entries;
	return firebase.database().ref('/users/' + loggedInUser.uid).once('value').then(function(snapshot) {
		entries = snapshot.val().entries;
		let keys = Object.keys(entries);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let entry = entries[key];
		    console.log(entry);
		    console.log(key);
		    let x = (width / keys.length) * i; 
		    let y = (height/5) * entry.bevs;
		    ellipse(x, y, 20, 20);
		}
	});
	console.log(entries);

}

function loginUser(){
	loggedInUser = firebase.auth().currentUser;
	container.show();
	
	plotChart();
}

function logoutUser(){
	container.hide();
}

function submitToFirebase(){
	let day = document.getElementById('dateInput').value;
	let val = parseInt(input.value());
	let length = parseInt(sleepLengthInput.value());
	let quality = parseInt(document.getElementById('sleepQualityInput').value);

	//let quality = parseInt(sleepQualityInput.value());


	//let sleepdata = document.getElementById('sleepInput');//;.value;
	input.value('');
	sleepLengthInput.value('');
	//sleepQualityInput.value('');

  	firebase.database().ref('users/' + loggedInUser.uid + '/entries/' + day).set({
		bevs: val,
		sleepLength: length,
		sleepQuality: quality
		//sleep: sleepdata
        //some more entry data
    });

    plotChart(); // after the user submits data, refresh the chart
}

// function formatCSV(){
// 	let sleepdata = document.getElementById('sleepInput');//.value;





// }
