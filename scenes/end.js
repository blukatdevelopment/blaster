/*##############################################################################
# End Menu
##############################################################################*/

var end = {};

end.update = function(){
    clearCanvas();
    this.drawEndButton();
}

end.drawEndButton = function(){
    drawBox(100, 100, 100, 100);
        drawText("Game", 100, 150);
        drawText("Over", 110, 180);
    drawText(`Kills: 10`, 100, 240);
    if(this.isEndButtonSelected()){
        drawLine(0, 0, 100, 100);
        drawLine(0, 400, 100, 200);
        drawLine(400, 0, 200, 100);
        drawLine(400, 400, 200, 200);
    }
}

end.isEndButtonSelected = function (){
    var boxTopLeft = { x: 100, y: 100 };
    var boxBottomRight = { x: 200, y: 200};
    var point = getMousePosition();
    if(typeof point === "undefined"){
        return false;
    }
    return isInsideBox(boxTopLeft, boxBottomRight, point);
}

end.mouseDown = function(){
    if(this.isEndButtonSelected()){
    }
}