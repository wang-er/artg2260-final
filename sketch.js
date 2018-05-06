let btnContainer, container, canv, input, dateInput, button; 
let sleepQualityInput, sleepLengthInput, sleepLengthContainer, bevinput;
var newTopic; 
var newInput;

var allDayButton, sevenDayButton;

var data; //this variable is for the visitors. It stores the csv file data the user drags onto the website. 
//However, this data is raw (like the data and categories are mushed into a single line basically) and needs to be separted properly! 

var sleepdata = []; //this variable is data's post-formatting state. It stores what the data would look like after un-mushing it
//you could imagine this var's contents like a table. There's a category and data listed under it.

//in the table that the Sleep Cycle app gives us, it 5 has categories: Start, End, Sleep Quality, Time in Bed, Wake Up, and Sleep Notes

var sleepQuality = []; //this variable is just storing the Sleep Quality category and it's data
var sleepLength = []; //this variable is just storing the Time in Bed category and it's data
var sleepDate = [];

let loggedInUser;
let plotAll = true; 

function setup(){

	container = document.getElementById('container');
  btnContainer = document.getElementById('buttons');

	allDayButton = createButton("All Data").parent(btnContainer);
	allDayButton.mousePressed(plotFull);
  allDayButton.addClass("btn-primary");
		
	sevenDayButton = createButton("Last Seven Days").parent(btnContainer);
	sevenDayButton.mousePressed(plotSeven);
  sevenDayButton.addClass("btn-info");


	// bevinput = createInput('Sleep Quality').parent(container);
	// sleepQualityInput = document.createElement("INPUT");
 //  	sleepQualityInput.setAttribute("type", "number");
 //  	sleepQualityInput.setAttribute("min", 0);
 //  	sleepQualityInput.setAttribute("max", 100);
 //  	sleepQualityInput.setAttribute("id", 'sleepQualityInput');
 //  	document.getElementById('container').appendChild(sleepQualityInput);

	//sleepLengthInput = createInput('Sleep Length').parent(container);
  //createP('').parent(container);
  newTopic = document.getElementById('newTopic');
  newInput = document.getElementById('newInput');

	dateInput = document.createElement("INPUT");
    dateInput.setAttribute("type", "date");
    dateInput.setAttribute("value", new Date());
    dateInput.setAttribute("id", 'dateInput');
    document.getElementById('dateInput').appendChild(dateInput);


  createP('Or Upload Your SleepCycle Data:').parent(container);
	input = createFileInput(handleFile).parent(container);
  createP('').parent(container);
	button = createButton('Submit').parent(needLogin2);
	button.mousePressed(submitToFirebase);

  // don't show by default, wait until user signs in 
	// container.style.display = "none";
	plotChart();
}

function plotChart(){
	console.log(loggedInUser);
  //background(200);
  let entries;
  var dates = [];
  var sleepLengthdata = [];
  var sleepQualitydata = []; 
  var bevs = []; 
  let loginName;

  let start = 0;


  if (!loggedInUser){
    console.log('loggedInUser not found');
    loginName = 'sample';
  } else {
    loginName = loggedInUser.uid;
  }

  return firebase.database().ref('/users/' + loginName).once('value').then(
  	function(snapshot) {
    entries = snapshot.val().entries;
    let keys = Object.keys(entries);
    if(!plotAll) start = keys.length-7; 
    for (let i = start; i < keys.length; i++) {
      let key = keys[i];
      let entry = entries[key];

      dates.push(key);
      sleepLengthdata.push(entry.sleepLength);
      sleepQualitydata.push(entry.sleepQuality);
      bevs.push(entry.bevs);
    }

  	var config = {
  		  type: 'line',
        // The data for our dataset
        data: {
            labels: dates,
            datasets: [ 
            {
                label: "Sleep Length",
                //backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(66, 134, 244)',
                data: sleepLengthdata,
            }, 
            {
                label: "Sleep Quality",
               // backgroundColor: 'rgb(200, 99, 252)',
                borderColor: 'rgb(188, 126, 247)',
                data: sleepQualitydata,
            },
            {
                label: "Beverages",
                //backgroundColor: 'rgb(99, 99, 99)',
                borderColor: 'rgb(252, 251, 186)',
                data: bevs,
            }]
        },
    		options: {
    			responsive: true,
    			tooltips: {
    				mode: 'index',
    				intersect: false,
    				callbacks: {
                      title: function() {
                              return '';
                      },
                      label: function(item, data) {
                      var datasetLabel=data.datasets[item.datasetIndex].label||'';
                      var dataPoint = item.yLabel;
                      if(datasetLabel === "Sleep Quality"){
                      	return datasetLabel + ': '+ dataPoint*10 + '%';
                      }
                      if(datasetLabel === "Sleep Length"){
                      	return datasetLabel + ': '+ timeFormat(dataPoint);
                      }
                      
                      }
                  }
    			},
    			hover: {
    				mode: 'nearest',
    				intersect: true
    			},
    			scales: {
    				xAxes: [{
    					type: 'time',
    				time: {
                      	displayFormats: {
                          day: 'YYYY-MM-DD'
                      }
                  },
    					display: true,
    					scaleLabel: {
    						display: true,
    						labelString: 'Month'
    					}
    				}],
    				yAxes: [{
    					display: true,
    					scaleLabel: {
    						display: true,
    						labelString: 'Value'
    					}
    				}]
    			}
    		}
    	};

    document.getElementById('myChart').remove(); // this is my <canvas> element
    document.getElementById('chartCanvas').innerHTML = '<canvas id="myChart"></canvas>';
    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, config);
    //console.log(config);
  }); 
}

function loginUser(){
	loggedInUser = firebase.auth().currentUser;
	// container.style.display = "block";
  document.getElementById('needLogin').innerHTML = "Don't Lose Your Snooze!";
  document.getElementById('needLogin2').innerHTML = "" ;
  button = createButton('Submit').parent(needLogin2);
	console.log("plot chart")
	plotChart();
}

function logoutUser(){
	//container.style.display = "none";
  document.getElementById('needLogin').innerHTML = "Don't Lose Your Snooze! Sample Data -- Sign in to store and view your own!";
  document.getElementById('needLogin2').innerHTML = "Submit: Please Sign in!";
  plotChart();
}

function submitToFirebase(){
	let day = document.getElementById('dateInput').value;
	let val = parseInt(bevinput.value());
	let length = sleepLengthInput.value().split(":");
  length = parseFloat(length[0]) + parseFloat(length[1])/60;
	let quality = parseInt(document.getElementById('sleepQualityInput').value);

  let newTopicName = newTopic.value();
  let newTopicData = newInput.value();

	var JSON = {};

	if (!isNaN(val)) {
		JSON.bevs = val;
	}

	if (!isNaN(length)) {
		JSON.sleepLength = length;
	}

	if (!isNaN(quality)) {
		JSON.sleepQuality = quality/10;
	}

  JSON[newTopicName] = newTopicData;

	console.log(JSON);

	//let quality = parseInt(sleepQualityInput.value());


	//let sleepdata = document.getElementById('sleepInput');//;.value;
	bevinput.value('');
	sleepLengthInput.value('');
	//sleepQualityInput.value('');

if(day != ""){
  	firebase.database().ref('users/' + loggedInUser.uid + '/entries/' + day).update(JSON);
  } else {
  	alert("Need to set a date!");
  }

console.log(JSON);
    plotChart(); // after the user submits data, refresh the chart
}

// function formatCSV(){
// 	let sleepdata = document.getElementById('sleepInput');//.value;

function handleFile(file) 
{ print(file); 
	if (file.type === 'text') {
		var csvdata = file.data.split("\n");
		 csvToFireBase(csvdata);
	}
}


function csvToFireBase(data) {

//making the background!
//background(0);

//here we have a for loop that starts at 1 (because we want to exclude the title of the category)
//the cycle goes over and over again until the length of the data minus one is finished (because we excluded the category).
for (var i = 1; i < data.length - 1; i++) {

//currently the data is still somwwhat bunched up, while we were able to split up the entire data into data points
//now we need to split the data points information into separate bits!

//think of it as our current data is like " 3, 4, 'red' " but we want to get 3, 4 and "red" as separate parts.  

//to make the data more helpful for us, this csv file is actually split up in semicolons. 
//So for each data point, we're gonna break apart the data for every semicolon.
//then we're going to update this new data to "sleepdata"

//the reason why theres currently an [i] after both sleepdata and data is because we're altering each element of the list specifically
  sleepdata[i-1] = data[i].split(";");

  sleepDate[i-1] = sleepdata[i-1][0];

//now since the full data is fully split, we can finally get the specific category of data! we're storing our Sleep Quality data here
  sleepQuality[i-1] = sleepdata[i-1][2]; 

//same idea goes with the time in bed also
  sleepLength[i-1] = sleepdata[i-1][3];

}

//however, our Sleep Quality data isn't actually formatted correctly either! 
//The system currently views the data as strings (aka. a name or a sentence) since each data is written like 98% or 15%.

//so for here, we're making another for loop to change each percentage-string-thing to a number!
for(var i = 0; i < sleepQuality.length; i++) {
  //parseFloat() is a given javascript function that bascially ignores anything that isn't a number.
  sleepQuality[i] = parseFloat(sleepQuality[i])/10;
}

//so for here, we're making another for loop to change each percentage-string-thing to a number!
for(var i = 0; i < sleepQuality.length; i++) {
  //parseFloat() is a given javascript function that bascially ignores anything that isn't a number.
  sleepDate[i] = sleepDate[i].substring(0,10);
  let year = sleepDate[i].substring(0,3); 
  let one = parseInt(sleepDate[i].substring(3,4)) + 4; 
  sleepDate[i] = year + one + sleepDate[i].substring(4,10);
}


//the Time in Bed (or just sleepLength) data is also formatted incorrectly too!
//this time, the system views the data as a string like "3:05" or "4:59"

//so what we would want to do is to somehow get the hours separate from the minutes, and then convert
//the whole time into minutes only.
for(var i = 0; i < sleepLength.length; i++) {

  //we can't use parseFloat here first though, because if we did, the number would be 305 or 459, which isn't correctly converted!
  //so instead, we're going to split each part again with a colon to separate hours and minutes (yeah, there's a lot of splitting going on) 
  sleepLength[i] = sleepLength[i].split(":");
  //now each hours & minutes time is like [3, 05] [4, 59]

  //What would we do with this data in this format?
  // our current data looks something like this: [3, 05] [4, 59]

  //in order to get the hours data, we could call the 0th element of each array ( the [0] part in sleepLength[i][0])
  //to get our minutes data, we could call the 1st element of each array! (the [1] part in sleepLength[i][1])

  //hey look! now we got both pieces of data! Is it time to add and multiply by 60 yet?
  // Unfortunately not. :(
  //Remember, the program still thinks our data is in strings (remember, sentences!)
  //so we would first need to make our strings to numbers by parseFloat again

  // then we can finally multiply it can convert hours to minutes
  sleepLength[i] = parseFloat(sleepLength[i][0]) + parseFloat(sleepLength[i][1])/60;

}

for(var i = 0; i < sleepDate.length; i++) {
  console.log(sleepDate[i]);
  console.log(sleepLength[i]);
	firebase.database().ref('users/' + loggedInUser.uid + '/entries/' + sleepDate[i]).set({
		sleepLength: sleepLength[i],
		sleepQuality: sleepQuality[i]
	}
	);
}
plotChart();



}

function plotFull(){
  plotAll = true;
  plotChart();
}

function plotSeven(){
  plotAll = false;
  plotChart();
}

function timeFormat(dataPoint){
	var value;
	if((Math.round((dataPoint - Math.floor(dataPoint))*60)) < 10) {
		value = "0" + (Math.round((dataPoint - Math.floor(dataPoint))*60));
	} else {
		value = (Math.round((dataPoint - Math.floor(dataPoint))*60));
	}
	return Math.floor(dataPoint) + ":" + value;
	
}

