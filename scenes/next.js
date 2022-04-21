/*##############################################################################
# Next Menu
##############################################################################*/

var next = {};

next.update = function(){
    clearCanvas();
    this.drawNextButton();
}

next.drawNextButton = function(){
    drawBox(100, 100, 100, 100);
    drawText("Wave " + game.currentWave, 100, 150);
    drawText("Complete", 100, 180);
    drawText(`Total Kills: ${game.enemiesDestroyed}`, 100, 240);
}

next.isNextButtonSelected = function(){
    var boxTopLeft = { x: 100, y: 100 };
    var boxBottomRight = { x: 200, y: 200};
    var point = getMousePosition();
    if(typeof point === "undefined"){
        return false;
    }
    return isInsideBox(boxTopLeft, boxBottomRight, point);
}

next.mouseDown = function(){
    if(this.isNextButtonSelected()){
        scene.activeScene = scene.GAME_SCENE;
    }
}

next.mouseUp = function(){}