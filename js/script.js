var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d'); //2 dimensional grid system

//variables represent canvas dimensions
var x = canvas.width/2; //center ball horizontally
var y = canvas.height-30; //move the ball 30px from the base of the stage

//variables represent ball dimensions
var dx = 4;
var dy = -4;
var ballRadius = 10;

//variables represent the paddle dimensions
var paddleHeight = 10;
var paddleWidth = 80;
var paddleX = (canvas.width-paddleWidth)/2 //starting position of the paddle on the x axis

//variables are for the key listeners when left and right buttons are pressed
var rightPressed = false;
var leftPressed = false;

//variables are for the brick dimensions
var brickRowCount = 5; //number of rows in the game
var brickColumnCount = 13; //number of colums in the game
var brickWidth = 80;
var brickHeight = 50;
var brickPadding = 7;
var brickOffsetTop = 120;
var brickOffsetLeft = 30;

//varibale holds the score
var score = 0;

//variable represents lives
var lives = 3;

var bricks = [];
//This loop stores positions of the bricks every iteration
	for(c=0; c<brickColumnCount; c++) {
		bricks[c] = [];

	for(r=0; r<brickRowCount; r++) {
//object stores x and y position of the brick
		bricks[c][r] = {x:0, y:0, status: 1};
	}
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function drawBricks() {
	//loops to create the rows and columns
	for(c=0; c<brickColumnCount; c++){
			for(r=0; r<brickRowCount; r++){
				if (bricks[c][r].status == 1) {
				//x and y coordinates for each brick in each loop iteration
				var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
				var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x= brickX;
				bricks[c][r].y= brickY;
				ctx.beginPath();
				//make rectangles for the bricks;
				ctx.rect(brickX,brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#B22222";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

// keydown handler store the information of the button pressed in the variable e
function keyDownHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = true;
	}
	else if (e.keyCode == 37) {
		leftPressed = true;
	}
}

function keyUpHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = false;
	}
	else if (e.keyCode == 37) {
		leftPressed = false;
	}
}
//this function draws the ball onto the canvas
function drawBall(){
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#FFF";
	ctx.fill();
	ctx.closePath();
}

//this function draws the paddle onto the canvas
function drawPaddle(){
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);//x position, y position, width and height
	ctx.fillStyle = "#FFD700"
	ctx.fill();
	ctx.closePath();
}

//function to detect colision with the bricks and ball
function collisionDetection() {
	for(c=0; c<brickColumnCount; c++){
		for(r=0; r<brickRowCount; r++){
			var b = bricks[c][r];
				if (b.status == 1) {
					if(x> b.x && x<b.x+brickWidth && y>b.y && y<b.y+brickHeight){
					dy = -dy;
					b.status = 0;
					score++; //everytime brick is hit we add one to collision variable
					//If all bricks have been hit alert player
					if (score == brickRowCount*brickColumnCount) {
						alert("You Win!!!!");
						document.location.reload();
					}
				}
			}
		}
	}
}

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#7FFFD4";
	ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#7FFFD4";
	ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function draw(){
	//every 10 milliseconds the canvas is cleared with the clearRect method
	ctx.clearRect(0,0, canvas.width, canvas.height);
	drawBall();//function adds ball to canvas
	drawPaddle();//function adds paddle to cnavas
	drawBricks();
	drawScore();
	drawLives();
	collisionDetection()
	//reverse the ball direction everytime it reaches the canvas boundary on the top boundary
	//we subtract ball Radius to prvent the ball from syncing into the wall.
	if(y + dy < ballRadius) {
		dy = -dy;
	//Game over once the ball hits the bottom of the canvas	
	} else if (y + dy > canvas.height-ballRadius) {
	//if the x position of the ball is between the left and right side of the paddle then it bounces back
		if (x>paddleX && x < paddleX + paddleWidth) {
			dy = -dy 
	//alert "GAME OVER and refresh page"		
		} else {
		lives--;
		if (!lives) {
			alert("GAME OVER!");
			document.location.reload();
			} else {
				x = canvas.width/2;
				y = canvas.height-30;
				dx = 4;
				dy = -4;
				paddleX = (canvas.width-paddleWidth)/2;
			}
			
		}
		
	}
	//reverse the ball direction everytime it reaches the canvas boundary on the bottom and top boundary
	if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
		dx = -dx;
	}

	//in each frame we check if button is pressed then move the paddles 
	//This code also prevents the paddle from syncing onto the wall
	if (rightPressed && paddleX < canvas.width-paddleWidth) {
		paddleX +=7;

	} else if (leftPressed && paddleX > 0) {
		paddleX -= 7;
	}

	x += dx; //add the value of x on every frame
	y += dy; //add the value of y on every frame
	requestAnimationFrame(draw);
}

document.addEventListener("mousemove", mouseMoveHandler);

//function to handle mouse movements in relation to the canvas

function mouseMoveHandler(e){
	var relativeX = e.clientX - canvas.offsetLeft;
	if (relativeX > 0+paddleWidth/2 && relativeX < canvas.width-paddleWidth/2) {
//mouse pointer will be on the center of the paddle
		paddleX = relativeX - paddleWidth/2;
	}
}
//draw function will be called every 10 miliseconds
//we call this at the bottom to make sure all variable are initialized before the function call
draw();