/*##############################################################################
# Start Menu
##############################################################################*/
var start = {};

start.mouseUp = function(){}

start.update = function(){
    clearCanvas();
    this.drawStartButton();
}

start.drawStartButton = function(){
    drawBox(100, 100, 100, 100);
    drawText("Start", 100, 150);
    if(this.isStartButtonSelected()){
        drawLine(0, 0, 100, 100);
        drawLine(0, 400, 100, 200);
        drawLine(400, 0, 200, 100);
        drawLine(400, 400, 200, 200);
    }
}


start.isStartButtonSelected = function(){
    var boxTopLeft = { x: 100, y: 100 };
    var boxBottomRight = { x: 200, y: 200};
    var point = getMousePosition();
    if(typeof point === "undefined"){
        return false;
    }
    return isInsideBox(boxTopLeft, boxBottomRight, point);
}

start.mouseDown = function(){
    if(this.isStartButtonSelected()){
        scene.activeScene = scene.GAME_SCENE;
    }
}



