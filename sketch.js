
////Hey guys, here's some of the code, I'll try my best to talk about each part. 
//Please ask me questions if you need help though understanding each part.

//also in assets, there's an example sleep data file in there. All you have to do is drag the file onto the website!


//credit to p5.js's file drop example

//-----------------------------------------------//

//--- variables that I used to declare ---//

var data; //this variable is for the visitors. It stores the csv file data the user drags onto the website. 
//However, this data is raw (like the data and categories are mushed into a single line basically) and needs to be separted properly! 

var sleepdata = []; //this variable is data's post-formatting state. It stores what the data would look like after un-mushing it
//you could imagine this var's contents like a table. There's a category and data listed under it.

//in the table that the Sleep Cycle app gives us, it 5 has categories: Start, End, Sleep Quality, Time in Bed, Wake Up, and Sleep Notes

var sleepQuality = []; //this variable is just storing the Sleep Quality category and it's data
var sleepLength = []; //this variable is just storing the Time in Bed category and it's data

var widthy = 800;
var heighty = 650;

var initalInput;

//set up function
function setup() {

  // create a canvas!
  var c =  createCanvas(widthy, heighty);

  //making the background dark!
  background(100);
  initialInput = createInput();

   var config = {
    apiKey: "AIzaSyD77zkj9acc-6iBwhN6ghzIZA5lB8-caGw",
    authDomain: "artg2260.firebaseapp.com",
    databaseURL: "https://artg2260.firebaseio.com",
    projectId: "artg2260",
    storageBucket: "",
    messagingSenderId: "635060430209"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var sleep = database.ref('sleep');

  function toggleSignIn() {
      if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
      } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
          alert('Please enter an email address.');
          return;
        }
        if (password.length < 4) {
          alert('Please enter a password.');
          return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
          document.getElementById('quickstart-sign-in').disabled = false;
          // [END_EXCLUDE]
        });
        // [END authwithemail]
      }
      document.getElementById('quickstart-sign-in').disabled = true;
    }
    /**
     * Handles the sign up button press.
     */
    function handleSignUp() {
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      // [START createwithemail]
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
      });
      // [END createwithemail]
    }
    /**
     * Sends an email verification to the user.
     */
    function sendEmailVerification() {
      // [START sendemailverification]
      firebase.auth().currentUser.sendEmailVerification().then(function() {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        // [END_EXCLUDE]
      });
      // [END sendemailverification]
    }
    function sendPasswordReset() {
      var email = document.getElementById('email').value;
      // [START sendpasswordemail]
      firebase.auth().sendPasswordResetEmail(email).then(function() {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert('Password Reset Email Sent!');
        // [END_EXCLUDE]
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
          alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
      });
      // [END sendpasswordemail];
    }
    /**
     * initApp handles setting up UI event listeners and registering Firebase auth listeners:
     *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
     *    out, and that is where we update the UI.
     */
    function initApp() {
      // Listening for auth state changes.
      // [START authstatelistener]
      firebase.auth().onAuthStateChanged(function(user) {
        // [START_EXCLUDE silent]
        document.getElementById('quickstart-verify-email').disabled = true;
        // [END_EXCLUDE]
        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          // [START_EXCLUDE]
          document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
          document.getElementById('quickstart-sign-in').textContent = 'Sign out';
          document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
          if (!emailVerified) {
            document.getElementById('quickstart-verify-email').disabled = false;
          }
          // [END_EXCLUDE]
        } else {
          // User is signed out.
          // [START_EXCLUDE]
          document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
          document.getElementById('quickstart-sign-in').textContent = 'Sign in';
          document.getElementById('quickstart-account-details').textContent = 'null';
          // [END_EXCLUDE]
        }
        // [START_EXCLUDE silent]
        document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
      });
      // [END authstatelistener]
      document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
      document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
      document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
      document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
    }
    window.onload = function() {
      initApp();
    };

  // Add an event for when a file is dropped onto the canvas
  // this is a command provided by the p5.dom.js library. It's just a function to drop files into the program.
  // when something is dropped into the program, call the gotFile function.
  c.drop(gotFile);
}

//function draw!
function draw() {
  //just how to set up the first screen, like visual wise.
  fill(255);
  noStroke();
  textSize(24);
  textAlign(CENTER);
  text('Drag a Sleep Cycle csv file onto the canvas.', widthy/2, heighty/2);
  noLoop();
}


//Function gotFile
//gotFile has a field (called "file"). What's going to be the file? Well, it's the file that the user put in!
function gotFile(file) {

  // If it's a text file (I still need to figure out a way to make it only csv files, but this works for now)
  if (file.type === 'text') {

    //When a csv file is imported, javascript makes it very finnicky. 
    //For some reason, they decide to put the entire file into one big "group" of text.
    //so we first need to split the data up for each instance/data point! 

    //luckily, everything is still separated by the enter-key
    //so I broke everything up by enters (which is called \n )
    var data = file.data.split("\n");

    //I then called another function drawGraph, and it takes in the now (somewhat) formatted data!
    drawGraph(data);

    //in the scenario where someone decides to place an incorrect file type
  } else {
    println('Not a csv file!');
  }
}


//the drawGraph function
//some things are definitely going to be interesting to explain...
function drawGraph(data) {

//making the background!
background(0);


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
  sleepQuality[i] = parseFloat(sleepQuality[i]);
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
  sleepLength[i] = parseFloat(sleepLength[i][0]) * 60 + parseFloat(sleepLength[i][1]);
}

 
 // a little bonus thing I wanted to implement. I wanted to find the minumum and maximums of both data lists.
 //So I declared variables and used math.max to find the numbers.
  var sleepQualityMax = Math.max(...sleepQuality);
  var sleepQualityMin = Math.min(...sleepQuality);

  var sleepLengthMax = Math.max(...sleepLength);
  var sleepLengthMin = Math.min(...sleepLength);


  // next off for the bar width, we would want to have all the data be displayed on one screen right?
  // All you would do is divide the width with the number of data points you have
  var barWidth =  (widthy / sleepQuality.length);
  


//sleep length display
//we can finally display our sleep length data in a bar graph!
  for(var i = 0; i< sleepLength.length; i++) {
    push();
    fill(0, 0, 255, 255); //making the color blue and slightly transparent 
    noStroke();
    translate(i * (barWidth) , heighty-map(sleepLength[i], sleepLengthMin, sleepLengthMax, 10, 600)); // jump to the top right corner of the bar
    rect(0, 0, barWidth, map(sleepLength[i], sleepLengthMin, sleepLengthMax, 10, 600)); // draw rect
    //I used a map function above to also determine a good range to display the bars on the screen. 
    //Rather than having numbers go from 500 to say 1000, numbers will only go from 10 to 600.

    //fill('#FFF');
    //text(sleepQuality[i], 5, barWidth/2 + 5); // write data
    pop();

    //console.log(map(sleepLength[i], sleepLengthMin, sleepLengthMax, 10, 600));
  }


  
  //same idea goes for sleep quality.
  for(var i = 0; i< sleepQuality.length; i++) {
    push();
    fill(0, 255, 0, 127); //making the color green and transparent
    noStroke();
    translate(i * (barWidth) , heighty-map(sleepQuality[i], sleepQualityMin, sleepQualityMax, 10, 600)); // jump to the top right corner of the bar
    rect(0, 0, barWidth, map(sleepQuality[i], sleepQualityMin, sleepQualityMax, 10, 600)); // draw rect

    //fill('#FFF');
    //text(sleepQuality[i], 5, barWidth/2 + 5); // write data

    pop();
  }


//This was to make the average lines of sleep length and sleep quality. Gold is for sleep quality, while white is for sleep length
strokeWeight(4);
stroke(255, 204, 0);
  var sQtotal = 0;
  for(var i = 0; i < sleepQuality.length; i++) {
    sQtotal += sleepQuality[i];
  }
  var sQavg = sQtotal / sleepQuality.length;
  console.log(sQavg);
  line(0, heighty-map(sQavg, sleepQualityMin, sleepQualityMax, 10, 600), widthy, heighty-map(sQavg, sleepQualityMin, sleepQualityMax, 10, 600));

  
console.log(map(sQavg, sleepQualityMin, sleepQualityMax, 10, 600));


stroke(255);
  var sLtotal = 0;
  for(var i = 0; i < sleepLength.length; i++) {
    sLtotal += sleepLength[i];
  }
  var sLavg = sLtotal / sleepLength.length;
  line(0, heighty-map(sLavg, sleepLengthMin, sleepLengthMax, 10, 600), widthy, heighty-map(sLavg, sleepLengthMin, sleepLengthMax, 10, 600));



}


