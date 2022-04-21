/*##############################################################################
# Start Menu
##############################################################################*/

function updateStart(){
    clearCanvas();
    drawStartButton();
}

function drawStartButton(){
    drawBox(100, 100, 100, 100);
    drawText("Start", 100, 150);
    if(isStartButtonSelected()){
        drawLine(0, 0, 100, 100);
        drawLine(0, 400, 100, 200);
        drawLine(400, 0, 200, 100);
        drawLine(400, 400, 200, 200);
    }
}


function isStartButtonSelected(){
    var boxTopLeft = { x: 100, y: 100 };
    var boxBottomRight = { x: 200, y: 200};
    var point = getMousePosition();
    if(typeof point === "undefined"){
        return false;
    }
    return isInsideBox(boxTopLeft, boxBottomRight, point);
}

function startMouseDown(){
    if(isStartButtonSelected()){
        activeScene = GAME_SCENE;
    }
}