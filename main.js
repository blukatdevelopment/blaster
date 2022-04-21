/*##############################################################################
# Scene management
##############################################################################*/
const START_SCENE = "start",
GAME_SCENE = "game",
END_SCENE = "lose",
NEXT_SCENE = "next";
var activeScene = START_SCENE;

function updateScene(){
  switch(activeScene){
    case GAME_SCENE:
      updateGame();
      break;
    case START_SCENE:
      updateStart();
      break;
    case END_SCENE:
      updateEnd();
      break;
    case NEXT_SCENE:
      updateNext();
      break;
  }
}

function sceneMouseDown(evt){
    switch(activeScene){
    case GAME_SCENE:
      gameMouseDown(evt);
      break;
    case START_SCENE:
      startMouseDown(evt);
      break;
    case END_SCENE:
      endMouseDown(evt);
      break;
    case NEXT_SCENE:
      nextMouseDown(evt);
      break;
  }
}

function sceneMouseUp(evt){
    switch(activeScene){
    case GAME_SCENE:
      gameMouseUp(evt);
      break;
  }
}


/*##############################################################################
# Game Loop
##############################################################################*/
const SCREEN_MIN = 0,
SCREEN_MAX = 400;

var fps = 60,
start_time = Date.now(),
frameDuration = 1000 / fps,
lag = 0;

function gameLoop(){
  requestAnimationFrame(gameLoop, getCanvas());

  var current_time = Date.now(),
  elapsed = current_time - start_time;
  start_time = current_time;
  lag += elapsed;

  while(lag >= frameDuration){
    updateScene();
    lag -= frameDuration;
  }
}

/*##############################################################################
# Util
##############################################################################*/

function randRange(min, max){
  return Math.random() * (max - min) + min;
}

function isInsideBox(topLeft, bottomRight, point){
  var inX = point.x < bottomRight.x && point.x > topLeft.x;
  var inY = point.y < bottomRight.y && point.y > topLeft.y;
  return inX && inY;  
}

/*##############################################################################
# SFX
##############################################################################*/
const SFX_PEW = "pew.mp3",
SFX_IMPACT = "impact.mp3",
SFX_EXPLOSION = "explosion.mp3";

function playSound(file){
  var audio = new Audio(file);
  audio.play();
}

/*##############################################################################
# Main
##############################################################################*/
function init(){
  initContext();
  initInput();
}

function main(){
  init();
  gameLoop();
}

main();