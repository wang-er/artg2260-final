
//var initialInput;
var fileUpload;
var submitButton;
var database;


function setup() {

createCanvas(100,100);
background(0);
  //initialInput = createInput("Name here");
  fileUpload = createFileInput("INPUT");
submitButton = createButton('submit');
submitButton.mousePressed(submitScore);
  //fileUpload = document.getElementById('csv file');

    // Initialize Firebase
  // var config = {
  //   apiKey: "AIzaSyBIK7QUm_hNuesfFHjKc4MZFmY7whA7upo",
  //   authDomain: "my-not-awesome.firebaseapp.com",
  //   databaseURL: "https://my-not-awesome.firebaseio.com",
  //   projectId: "my-not-awesome",
  //   storageBucket: "",
  //   messagingSenderId: "336639957468"
  // };
  // firebase.initializeApp(config);
  // console.log(firebase);

  // database = firebase.database();


function submitScore() {
  var data = {
    name: user.uid,
    sleepdata: fileUpload.value()
  }

    var ref = database.ref('sleepdata');
  ref.push(data);
}


}
