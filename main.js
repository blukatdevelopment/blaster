/*##############################################################################
# Scene management
##############################################################################*/
var scene = {};
scene.START_SCENE = "start",
scene.GAME_SCENE = "game",
scene.END_SCENE = "lose",
scene.NEXT_SCENE = "next";
scene.activeScene = scene.START_SCENE;

scene.update = function(){
  switch(this.activeScene){
    case this.GAME_SCENE:
      game.update();
      break;
    case this.START_SCENE:
      start.update();
      break;
    case this.END_SCENE:
      end.update();
      break;
    case this.NEXT_SCENE:
      next.update();
      break;
  }
}

scene.mouseDown = function(evt){
    switch(this.activeScene){
    case this.GAME_SCENE:
      game.mouseDown(evt);
      break;
    case this.START_SCENE:
      start.mouseDown(evt);
      break;
    case this.END_SCENE:
      end.mouseDown(evt);
      break;
    case this.NEXT_SCENE:
      next.mouseDown(evt);
      break;
  }
}

scene.mouseUp = function(evt){
    switch(this.activeScene){
    case this.GAME_SCENE:
      game.mouseUp(evt);
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
    scene.update();
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