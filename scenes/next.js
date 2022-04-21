/*##############################################################################
# Next Menu
##############################################################################*/

function updateNext(){
    clearCanvas();
    drawNextButton();
}

function drawNextButton(){
    drawBox(100, 100, 100, 100);
    drawText("Wave " + currentWave, 100, 150);
    drawText("Complete", 100, 180);
    drawText(`Total Kills: ${enemiesDestroyed}`, 100, 240);
}


function isNextButtonSelected(){
    var boxTopLeft = { x: 100, y: 100 };
    var boxBottomRight = { x: 200, y: 200};
    var point = getMousePosition();
    if(typeof point === "undefined"){
        console.log("Null");
        return false;
    }
    return isInsideBox(boxTopLeft, boxBottomRight, point);
}

function nextMouseDown(){
    if(isNextButtonSelected()){
        activeScene = GAME_SCENE;
    }
}