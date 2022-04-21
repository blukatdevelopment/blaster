/*##############################################################################
# End Menu
##############################################################################*/

function updateEnd(){
    clearCanvas();
    drawEndButton();
}

function drawEndButton(){
    drawBox(100, 100, 100, 100);
    drawText("Game", 100, 150);
    drawText("Over", 110, 180);
    drawText(`Kills: ${enemiesDestroyed}`, 100, 240);
    if(isEndButtonSelected()){
        drawLine(0, 0, 100, 100);
        drawLine(0, 400, 100, 200);
        drawLine(400, 0, 200, 100);
        drawLine(400, 400, 200, 200);
    }
}


function isEndButtonSelected(){
    var boxTopLeft = { x: 100, y: 100 };
    var boxBottomRight = { x: 200, y: 200};
    var point = getMousePosition();
    if(typeof point === "undefined"){
        console.log("Null");
        return false;
    }
    return isInsideBox(boxTopLeft, boxBottomRight, point);
}

function endMouseDown(){
    if(isEndButtonSelected()){
        resetGame();
        activeScene = START_SCENE;
    }
}