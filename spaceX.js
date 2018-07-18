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
				[0,0,0,0,0,0,0,0,0,0]]
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
				[0,0,0,0,0,0,0,0,0,0]]
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
				[0,0,1,1,1,1,1,0,0,0]]
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
		console.log("All asteroids in play:", asteroidsInPlay);
	}
	
}

function createAsteroid(){
	let pickNum = Math.floor(Math.random()*asteroids.length);
	let asteroid = asteroids[pickNum];
	console.log(asteroid);
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
		}
	}
}

function draw(){
	console.log('in draw function');
	context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
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
    const deltaTime = time - lastTime;
    Counter += deltaTime;
    console.log(Counter);
    if (Counter > Interval) {
        movePlayer(2);
        moveAsteroids(2);
        score += Math.floor(Counter/1000);
        document.getElementById("score").innerHTML = score;
    }

    lastTime = time;
    draw();
    requestAnimationFrame(update);
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
	player.posY = (player.posY + dir) % canvas_height;
}

function moveAsteroids(dir){
	for (let i = 0; i < asteroidsInPlay.length; i++){
		asteroidsInPlay[i].posX -= dir;
	}
}

function movePlayerEvent(dir){
	player.posX = (player.posX + dir) % canvas_width;
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
		//var allOnes = new Set();
		for (let x = 0; x < asteroidsInPlay[i].matrix.length; x++){
			for (let y = 0; y < asteroidsInPlay[i].matrix[0].length; y++){
				//console.log("in loop");
				
				if (asteroidsInPlay[i].matrix[x][y] === 1){
					mat[asteroidsInPlay[i].posX + x][asteroidsInPlay[i].posY + y] += 1;
					//allOnes.add([asteroidsInPlay[i].posX + x, asteroidsInPlay[i].posY + y]);
					console.log("detected one at",asteroidsInPlay[i].posX + x, asteroidsInPlay[i].posY + y);
				}
				
			}
		}
		//console.log("contents of set", allOnes);
	//fill up empty matrix
	//console.log("matrix now: ", mat);
	}

		
		for (let i = 0; i < mat.length; i++){
			for (let j = 0; j < mat[0].length; j++){
				if (mat[i][j] == 1) console.log("1");
				else if (mat[i][j] == 2) console.log("2");
				/*
				if (allOnes.has([i,j])){
					mat[i][j] += 1;
					console.log("found 1 and sum at ");
					console.log(i,j);
					console.log("is ", mat[i][j]);
				}
				*/
			}
		}
		
			
	//now mat has all 1 sums from asteroids
	//console.log(mat);
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
createAsteroid();
createAsteroid();
draw();
collide();
//update();

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

