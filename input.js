/*##############################################################################
# Input
##############################################################################*/
var _mousePos;
function getMousePosition(){
  return _mousePos;
}

var K_W = 87,
K_A = 65,
K_S = 83,
K_D = 68,
K_SPACE = 32;
var KEYS_USED = [];// Add these if needed [K_W, K_A, K_S, K_D, K_SPACE];
var input = {
  keys: {}
};


function onMouseDown(evt){
  scene.mouseDown(evt);
}
function onMouseUp(evt){
  scene.mouseUp(evt);
}
function onMouseMove(evt)
{
  var rect = getCanvas().getBoundingClientRect();
  _mousePos = {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
function onMouseOut(evt){}
function onKeyDown(evt){
  if(evt.which in input.keys){
    input.keys[evt.which] = true;
  }
}
function onKeyUp(evt){
  if(evt.which in input.keys){
    input.keys[evt.which] = false;
  }
}

function initInput(){
  for(let i in KEYS_USED){
    let key = KEYS_USED[i];
    input.keys[key] = false;
  }
  var canvas = document.getElementById("mainCanvas");
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseout", onMouseOut);
  window.addEventListener('keydown', this.onKeyDown, false);
  window.addEventListener('keyup', this.onKeyUp, false);
}