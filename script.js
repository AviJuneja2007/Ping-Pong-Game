var ball = document.getElementById('ball');
var rod1 = document.getElementById('rod1');
var rod2 = document.getElementById('rod2');

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

let gameOn = false;
let ballSpeedX = 2;
let ballSpeedY = 2;
let score,maxScore,movement,rod;

const storeName = "PPName";
const storeScore = "PPMaxScore";

const rod1Name = "Rod 1";
const rod2Name = "Rod 2";


function resetBoard(rodName){
    rod1.style.left = (window.innerWidth - rod1.offsetWidth)/2 + "px";
    rod2.style.left = (window.innerWidth - rod2.offsetWidth)/2 + "px";
    ball.style.left = (window.innerWidth - ball.offsetWidth)/2 + "px";

    //Loosing player gets the ball for the next match
    if(rodName === rod2Name){
        ball.style.top = (rod1.offsetTop + rod1.offsetHeight) + "px";
        ballSpeedY = 2;
    }
    else if(rodName === rod1Name){
        ball.style.top = (rod2.offsetTop - rod2.offsetHeight) + "px";
        ballSpeedY = -2;
    }

    score = 0;
    gameOn = false;
}

//Before starting the first game
(function(){

    rod = localStorage.getItem(storeName);
    maxScore = localStorage.getItem(storeScore);

    if(rod === "null" || maxScore === "null"){
        alert("This is the first time you are playing this game. LET'S START");
        maxScore = 0;
        rod = "Rod 1";
    }
    else{
        alert(rod + " has maximum score of " + maxScore*100);
    }

    resetBoard(rod);
})();

function storeWin(rod,score){
    if(score > maxScore){
        maxScore = score;
        localStorage.setItem(storeName,rod);
        localStorage.setItem(storeScore,score);
    }

    clearInterval(movement);
    resetBoard(rod);

    alert(rod + " wins with a score of " + (score*100) + ". Max Score is: " + (maxScore*100));
}


window.addEventListener("keypress",function(){
    let rodSpeed = 20;

    let rodrect = rod1.getBoundingClientRect();

    if(event.code === "KeyD" && ((rodrect.x + rodrect.width) < window.innerWidth)){
        rod1.style.left = (rodrect.x) + rodSpeed + "px";
        rod2.style.left = rod1.style.left;
    }
    else if(event.code === "KeyA" && ((rodrect.x) > 0)){
        rod1.style.left = rodrect.x - rodSpeed + "px";
        rod2.style.left = rod1.style.left;
    }

    // If we press Enter
    if(event.code === "Enter"){

        if(!gameOn){
            gameOn = true;
            let ballRect = ball.getBoundingClientRect();
            let ballX = ballRect.x;
            let ballY = ballRect.y;
            let ballDia = ballRect.width;

            let rod1Height = rod1.offsetHeight;
            let rod2Height = rod2.offsetHeight;
            let rod1Width = rod1.offsetWidth;
            let rod2Width = rod2.offsetWidth;

            movement = setInterval(function(){
                // Move ball
                ballX += ballSpeedX;
                ballY += ballSpeedY;

                ball.style.left = ballX + "px";
                ball.style.top = ballY + "px";

                rod1X = rod1.getBoundingClientRect().x;
                rod2X = rod2.getBoundingClientRect().x;

                let ballPos = ballX + ballDia/2; // bcoz the centre of the ball will be counted from the leftmost point of the ball

                if((ballX + ballDia) > windowWidth || ballX<0){
                    ballSpeedX = -ballSpeedX; // This reverses the direction
                }
                
                //Check for Rod1
                if(ballY <= rod1Height){
                    ballSpeedY = -ballSpeedY;
                    score++;

                    // Check if the game ends
                    if(ballPos < rod1X || (ballPos> (rod1X + rod1Width))){
                        storeWin(rod2Name,score);
                    }
                }

                //Check for Rod2
                else if((ballY + ballDia) >= (windowHeight-rod2Height)){
                    ballSpeedY = -ballSpeedY;
                    score++;

                    //Check if the game ends
                    if((ballPos < rod2X) || (ballPos > (rod2X + rod2Width))){
                        storeWin(rod1Name,score);
                    }
                }
            },10);


        }
    }   
});