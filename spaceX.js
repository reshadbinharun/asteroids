const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

console.log("running JS script");
/*
TEMPLATE MATRICES:
[[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0]]


Improvements to design: use createMatrix to create both asteroids and player with same dimensions as canvas

*/
//GAME PARAMETERS
var gameOn = true;
var score = 0;

const canvas_height = 300;
const canvas_width = 400;
const matrix_frame = 10;
var asteroids = [
	{
		type : "small",
		posX : 0,
		posY : 0,
		matrix : [[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,1,1,0,0,0,0],
				[0,0,1,1,1,1,0,0,0,0],
				[0,0,1,1,1,1,0,0,0,0],
				[0,0,1,1,0,1,1,0,0,0],
				[0,0,0,1,1,1,1,0,0,0],
				[0,0,0,0,1,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0]],
		speed: 1
	},
	{
		type : "medium",
		posX : 0,
		posY : 0,
		matrix : [[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,1,1,1,1,0,0,0],
				[0,0,1,1,1,1,0,1,0,0],
				[0,0,1,1,1,1,0,0,1,0],
				[0,1,1,1,1,1,1,1,0,0],
				[0,1,0,1,0,1,1,1,0,0],
				[0,0,1,1,1,1,1,1,0,0],
				[0,0,0,1,1,1,1,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0]],
		speed: 1
	},
	{
		type : "large",
		posX : 0,
		posY : 0,
		matrix : [[0,0,1,1,0,0,0,0,0,0],
				[0,0,0,1,1,0,0,0,0,0],
				[0,1,1,1,1,1,1,0,0,0],
				[0,1,1,1,1,1,1,1,0,0],
				[1,1,0,1,1,1,1,1,1,0],
				[0,1,0,1,1,0,0,0,1,0],
				[0,1,1,1,1,0,0,1,0,0],
				[0,0,1,1,1,1,1,1,0,0],
				[0,0,0,1,1,0,0,1,0,0],
				[0,0,1,1,1,1,1,0,0,0]],
		speed: 1
	},

];
var player = {
	health : 100,
	matrix : [[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,1,0,0],
			[1,0,0,0,0,1,1,1,1,0],
			[1,1,0,0,1,1,0,0,1,1],
			[1,1,1,1,1,0,0,0,1,1],
			[1,1,1,1,1,0,0,0,1,1],
			[1,1,0,0,1,1,0,0,1,1],
			[1,0,0,0,0,1,1,1,1,0],
			[0,0,0,0,0,0,1,1,0,0]],
	posX : Math.floor(canvas_height/2),
	posY : Math.floor(canvas_width/2)
}
const maxNum = 5;
const object_scale = 1;
var asteroidsInPlay = [];

//GAME FUNCTIONS

context.scale(2,2);

function placeAsteroid(asteroid) {
	let entryY = Math.floor (Math.random()* canvas_height);
	console.log(entryY);
	//place asteroid on canvas
	if (asteroid){
		//adjust placement
		asteroid.posY = entryY%(canvas_height/2);
		asteroid.posX = canvas_width/2;
		asteroidsInPlay.push(asteroid); 
		//console.log("All asteroids in play:", asteroidsInPlay);
	}
	
}

function createAsteroid(speed){
	let pickNum = Math.floor(Math.random()*asteroids.length);
	let asteroid = asteroids[pickNum];
	asteroid.speed = speed;
	//console.log(asteroid);
	console.log("created asteroid");
	placeAsteroid(asteroid);
}

//takes in matrix to draw, and x and y offsets
function drawMatrix(matrix, offset, color){
	console.log("in drawmatrix");
	for (let row = 0; row < matrix.length; row++){
		for (let col = 0; col < matrix[0].length; col++){
			console.log(color);
			context.fillStyle = color;
			if (matrix[row][col] === 1)
				context.fillRect(offset.x + col, offset.y + row, object_scale, object_scale); //flip row and col
				//context.fillRect() expects the first argument for horizontal filling, i.e. column fills
		}
	}
}

function draw(){
	console.log('in draw function');
	console.log("number of asteroids in play:", asteroidsInPlay.length);
	context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.height, canvas.width);
    //draw player
    drawMatrix(player.matrix, {x: player.posY/2, y: player.posX/2}, "red"); //flip x and y for player
    for (let i = 0; i < asteroidsInPlay.length; i++){
    	let asteroid = asteroidsInPlay[i];
    	console.log(asteroid.matrix);
    	drawMatrix(asteroid.matrix, {x: asteroid.posX, y: asteroid.posY}, "white");
    }

    //draw asteroids
}

//Animating
let Counter = 0;
let Interval = 250;

let lastTime = 0;
function update(time = 0) {
	if (!gameOn) return;
    const deltaTime = time - lastTime;
    makeAsteroid = Math.floor(Math.random()*10);
    if (makeAsteroid > 5){
    	speed = Math.floor(Math.random()*2) + 1;
    	createAsteroid(speed);	
    } 
    Counter += deltaTime;
    console.log(Counter);
    if (Counter > Interval) {
        movePlayer(2);
        moveAsteroids();
        score += Math.floor(Counter/1000);
        document.getElementById("score").innerHTML = score;
    }
    if (collide()){
    	document.getElementById("score").innerHTML = "Game Over!";
    	gameOn = false;
    } 

    lastTime = time;
    draw();
    requestAnimationFrame(update); //creates loop
}

document.addEventListener('keydown', event =>{
	if (event.keyCode === 38) {
		movePlayerEvent(-5);
		//draw();
		console.log("keydown! ",event.keyCode);
	}
	else if (event.keyCode === 40) {
		movePlayerEvent(5);
	}
});

function movePlayer(dir){
	//player.posY += dir;
	//player.posY = Math.abs(player.posY + dir) % canvas_height;
	curr_pos = Math.abs(player.posY + dir) % canvas_height;
	if (curr_pos + 5 == canvas_height) curr_pos = matrix_frame/2;
	else if (curr_pos - 5 == 0) curr_pos = canvas_height - matrix_frame/2;
	player.posY = curr_pos; 
}

function moveAsteroids(){
	for (let i = 0; i < asteroidsInPlay.length; i++){
		asteroidsInPlay[i].posX -= asteroidsInPlay[i].speed;
		//asteroidsInPlay[i].posX = (asteroidsInPlay[i].posX + dir) % canvas_width;
		if (asteroidsInPlay[i].posX <= matrix_frame/2) asteroidsInPlay.splice(i,1); //removes the asteroid that has 0 position
	}
}

function movePlayerEvent(dir){
	curr_pos = Math.abs(player.posX + dir) % canvas_width;
	if (curr_pos + 5 == canvas_width) curr_pos = matrix_frame/2;
	else if (curr_pos - 5 == 0) {
		console.log("2nd bound");
		curr_pos = canvas_width - matrix_frame;
	}
	player.posX = curr_pos;
	//player.posX = (player.posX + dir) % canvas_width;
}


function play(){
	//score-keep
	//leave message
	//while(gameOn)
		//delay and update
		//if health empty, gameOn false
}

//matrix manipulation link: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Matrix_math_for_the_web

function collide() {
	//populate set with off-set positions of all 1s
	let mat = createEmptyMatrix(canvas_height, canvas_width); 
	for (let i = 0; i < asteroidsInPlay.length; i++){
		for (let x = 0; x < asteroidsInPlay[i].matrix.length; x++){
			for (let y = 0; y < asteroidsInPlay[i].matrix[0].length; y++){
				if (asteroidsInPlay[i].matrix[x][y] === 1){
					mat[asteroidsInPlay[i].posX + x][asteroidsInPlay[i].posY + y] += 1;
				}
				
			}
		}
	}
	//detecting collision
	for (let x = 0; x < player.matrix.length; x++){
		for (let y = 0; y < player.matrix[0].length; y++){
			if (player.matrix[x][y] === 1){
				if (mat[player.posX + x][player.posY + y] > 0) return true;
			}
		}
	}
	return false;

}


function createEmptyMatrix(row,col){

	let matrix = [];
    while (col) {
        matrix.push(new Array(row).fill(0));
        col--;
    }
    return matrix;
}


//debugging functions
createAsteroid(2);
createAsteroid(5);
draw();
collide();
update();

//Deprecated:

function collideDep(){
	//brute force: check if any asteroid collides with ship
	/*
	for (let i = 0; i < asteroidsInPlay.length; i++){
		for (let row = 0; row < asteroidsInPlay[i].length; row++){
			for (let col = 0; col < asteroidsInPlay[i][0].length; col++){

			}
		}
	}
	*/
	//alternative algorithm: add all asteroids to empty canvas matrix
	//get {row,col} of all pixels that have value greater than 0
	//add player to that matrix, if any pixel increments, there is a collision
	let matrixEmpty = createEmptyMatrix(canvas_height, canvas_width);
	//add all asteroids
	

	for (let i = 0; i < asteroidsInPlay.length; i++){
		for (let row = 0; row < canvas_height; row++){
			for (let col = 0; col < canvas_width; col++){
				if (row > asteroidsInPlay[i].posX && row < (asteroidsInPlay[i].posX + 10) && col > asteroidsInPlay[i].posY && col < (asteroidsInPlay[i].posY + 10)){
					matrixEmpty[row][col] += asteroidsInPlay[i].matrix[row - asteroidsInPlay[i].posX][col - asteroidsInPlay[i].posY];
				}
			}
		}	
	}
	
	drawMatrix(matrixEmpty); //for debugging
}

