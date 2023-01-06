//STEP 1: setting up the environment
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const color1 = "#5D7B6F"; 
const color2 = "#5F3115"; 
const color3 = "#335944";    
const color4 = "#937A67";
const color5 = "#E6EAE4";


putWallsAround(0, 0, canvas.clientWidth, canvas.clientHeight);
let randomObjects = [];

//Creating 10 body object with random arguments
for(let addBody = 0; addBody < 70; addBody++){
    let x0      = randInt(100, canvas.clientWidth - 100);
    let y0      = randInt(100, canvas.clientHeight - 100);
    let x1      = x0 + randInt(-50, 50);
    let y1      = y0 + randInt(-50, 50);
    let r       = randInt(10, 30);
    let m       = randInt(0, 10);

    if(addBody % 4 === 0){
        let ballObj     = new Ball(x0, y0, r, m);
        ballObj.setPosition(x0, y0);
        ballObj.color   = color1;
        ballObj.layer   = 1;
        randomObjects.push(ballObj);
    }
    if(addBody % 4 === 1){
        let boxObj      = new Box(x0, y0, x1, y1, r, m);
        boxObj.setPosition(x0, y0);
        boxObj.color    = color2;
        boxObj.layer    = 1;
        randomObjects.push(boxObj);
    }
    if(addBody % 4 === 2){
        let capsObj     = new Capsule(x0, y0, x1, y1, r, m);
        capsObj.setPosition(x0, y0);
        capsObj.color   = color3;
        capsObj.layer   = 1;
        randomObjects.push(capsObj);
    }
    if(addBody % 4 === 3){
        let starObj     = new Star(x0, y0, r+20, m);
        starObj.setPosition(x0, y0);
        starObj.color   = color4;
        starObj.layer   = 1;
        randomObjects.push(starObj);
    }
};

//setting the initial velocities
for (let i in randomObjects){
    if(randomObjects[i].m !== 0){
        randomObjects[i].vel.set(Math.random()*4-2, Math.random()*4-2);
    }
}

//creating the player
let playerBall      = new Ball(320, 240, 20, 5);
playerBall.player   = true;
playerBall.maxSpeed = 3;
playerBall.color    = color5;


//STEP 2: defining the game logic
function gameLogic(){
    for (let i in randomObjects){
        if(collide(randomObjects[i], playerBall)){
            //playerBall.remove();
            randomObjects[i].remove();
            randomObjects.splice(i, 1);
        }
    }
}

//STEP 3: handling the user input and the game loop
userInput(playerBall);
requestAnimationFrame(mainLoop);