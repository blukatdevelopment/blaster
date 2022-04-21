/*##############################################################################
# Canvas library
##############################################################################*/

var _canvas;
var _context;

function initContext(){
  _canvas = document.getElementById("mainCanvas");
  _context = _canvas.getContext("2d");
}

function getCanvas(){
  return _canvas;
}

function getContext(){
  return _context;
}

function drawCircle(x, y, radius){
  let context = getContext();
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.fill();
}

function drawLine(x1, y1, x2, y2){
  let context = getContext();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
}

function clearCanvas(){
  let context = getContext();
  let canvas = getCanvas();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
}

// XY is for top left corner.
function drawBox(x, y, width, height){
  // Top
  drawLine(x, y, x+width, y);
  // Left
  drawLine(x, y, x, y+height); 
  // Bottom
  drawLine(x, y+height, x+width, y+height);
  // Right
  drawLine(x+width, y, x+width, y+height);
}

function drawText(text, x, y){
  let context = getContext()
  context.font = "30px Arial";
  context.fillText(text, x, y);
}