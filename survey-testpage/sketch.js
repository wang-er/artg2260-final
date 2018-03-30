

let s = function(sketch) {

	let x = 100;
	let y = 100;
	let response;

	sketch.setup = function () {
		sketch.createCanvas(1000, 100);
		sketch.background(255);
		sketch.createInput();
	};

	//sketch.draw = function() {
	//	sketch.background(0);
	//	sketch.fill(255);
	//	sketch.rect(x,y, 50,50);
	//};
};

let w = function(sketch) {

	let x = 100;
	let y = 100;
	let response;

	sketch.setup = function () {
		sketch.createCanvas(1000, 100);
		sketch.background(255);
		sketch.createButton('submit')
		button.mousePressed(submit)
	};

	sketch.submit = function() {
		morningGroginess = myp5.input.value()
		preSleepEnergy = myp5_2.input.value()
		text(morningGroginess, 0, 0);
		text(preSleepEnergy, 20, 20);
	};
};

let myp5 = new p5(s);

let myp5_2 = new p5(s);

let myp5_3 = new p5(w);

//function submit() {
	//morningGroginess = myp5.input.value()
	//preSleepEnergy = myp5_2.input.value()
	//caffeinConsumption
	//dailyExercise
	//electronicsUse
	//deviceCooldown
	//day
	//month
	//year
	//text(morningGroginess, 0, 0);
	//text(preSleepEnergy, 20, 20);
//}

let morningGroginess
let preSleepEnergy
let caffeinConsumption
let dailyExercise
let electronicsUse
let deviceCooldown
let day
let month
let year