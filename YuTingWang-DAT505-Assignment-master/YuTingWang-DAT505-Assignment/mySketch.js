var numberOfBalls = 200;
var size = 40; //  external size of balls
var bounce = 30; // size of non overlapping part 
var xcoord = 300; // where first set of balls arrive
var ycoord = 300; // where first set of balls arrive
var colour = 128; // first colour 
var ballArray = [];//Temporary storage of text blocks
var colorValue = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";//Color value  definition
var colorArray = colorValue.split(",");//Convert color value to an array

//Start executing creating a canvas entrance
function setup() {
	//create a canvas 
	createCanvas(800, 800);
}

//the entrance of the event of mouse release
function mouseReleased() {
	noLoop();//stop painting
}

//prepare for repainting
function mousePressed() {
	loop();//prepare for repainting
}

//p5 js start painting
function draw() {
	//add text blocks when mouse pressed
	if (mouseIsPressed) {
		xcoord = mouseX;//get the X coordinate
		ycoord = mouseY;//get the Y coordinate
		ballArray.push(new ball());//add text blocks into temporary arrays

	}

	//Loop the content of text block,  display it dynamically to the calculated coordinate position
	for (var i = 0; i < ballArray.length; i++) {
		for (var j = 0; j < i; j++) {
			var distance = dist(ballArray[i].x, ballArray[i].y, ballArray[j].x, ballArray[j].y);//calculate the distance between two points based on the coordinate values of each block of text
			
			//Recalculate the coordinate position of the text block when the distance between the two points is less than the defined base size
			if (distance < bounce) {
				var dx = ballArray[i].x - ballArray[j].x;
				var dy = ballArray[i].y - ballArray[j].y;
				dx /= distance;
				dy /= distance;
				ballArray[j].x -= dx / 2;
				ballArray[j].y -= dy / 2;
				ballArray[i].x += dx / 2;
				ballArray[i].y += dy / 2;
			}
		}
	}

	//Loop out the text block content and display
	for (var i = 0; i < ballArray.length; i++) {
		ballArray[i].display();
	}
}


//Create a function of creating block content 
function ball() {

	//Calculate the random coordinate position
	this.x = xcoord + random(1, 2);
	this.y = ycoord + random(1, 2);

	this.display = function () {
		//	var colorShift = 100*mag(this.fsumx, this.fsumy);
		textSize(20);//set the text size
		var color = getColor();//get random color values
		fill(color);//Fill text color
		text('opinion', this.x, this.y);//Create text content onto the drawing
		//ellipse(this.x, this.y, size, size);
	};
}

//Generate random color values
function getColor() {
	//Define the string variable colorValue to store the value that can form a hexadecimal color value
	var colorValue = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
	//Split the colorValue string into a character array ["0","1",...,"f"] with "," as the separator
	var colorArray = colorValue.split(",");
	var color = "#"; //Define a string variable that holds the hexadecimal color value, first store #
	//Use the for loop statement to generate the remaining six hexadecimal values
	for (var i = 0; i < 6; i++) {
		//colorArray[Math.floor(Math.random()*16)]Randomly removed
		// a value of a colorArray consisting of 16 elements, and then adding it to the color,
		//after the string is added, the result is still a string.
		color += colorArray[Math.floor(Math.random() * 16)];
	}
	return color;
}
