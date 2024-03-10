let board;
const boardWidth = 360;
const boardHeight = 640;
let context;

const birdWidth = 34;
const birdHeight = 24;

let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let pipeVelocity = -2.5;
let birdVelocity = 0;
let gravity = 0.4;

let gameOver = false;

let score = 0;
let bestScore = 0;

const gameOverText = "Game Over";

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "./images/bird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }
    topPipeImg = new Image();
    topPipeImg.src = "./images/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./images/bottompipe.png";
    
    
    requestAnimationFrame(Update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
}

function Update(){
    requestAnimationFrame(Update);
    if(gameOver){
        context.fillStyle = "red";
        context.font = "45px system-ui";
        context.fillText(gameOverText, 70, 320);
        context.fillStyle = "white";
        context.font = "20px system-ui";
        context.fillText("Press Space to Restart", 86, 350)
        return;
    }
    
    context.clearRect(0,0,board.width, board.height);
      
    

    birdVelocity += gravity;
    bird.y = Math.max(bird.y+birdVelocity, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
      
    if(bird.y > board.height){
        gameOver = true;
    }
    for (let i = 0; i<pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += pipeVelocity;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score+=0.5;
            if(bestScore<score){
                bestScore = score;
            }
            pipe.passed = true;
        }
        if(collisionDetection(bird, pipe)){
            gameOver = true;

        }
    }
    while(pipeArray.length>0 && pipeArray[0].x < 0-pipeWidth){
        pipeArray.shift();
    }
    
    context.fillStyle = "white";
    context.font = "45px system-ui";
    context.fillText(score, 5, 45);
    context.fillStyle = "white";
    context.font = "30px system-ui";
    context.fillText(`Best Score: ${bestScore}`, 5, 80);
}

function placePipes(){
    if(gameOver){
        return;
    }
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openSpace = board.height/4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width:pipeWidth,
        height:pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openSpace,
        width:pipeWidth,
        height:pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX"){
        birdVelocity = -6;
        if(gameOver){
            bird.y = birdY;
            bird.x = birdX;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function collisionDetection(a, b){
    return a.x < b.x+b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}