/// <reference path="BaseSpecial.ts"/>

class TeleportSpecial extends BaseSpecial{
    constructor(){
        super(5);
    }
    
    useSpecial(level:GameplayState){
        super.useSpecial(level);
        
        var list:Phaser.Point[] = [];
        for (var x = 0; x < Global.mapWidth; x++) {
            for (var y = 0; y < Global.mapHeight; y++) {
                if(Global.levelRooms[x][y].visited){
                    list.push(new Phaser.Point(x, y));
                }  
            }
        }
        
        var pickedLocation:Phaser.Point = list[level.rnd.integerInRange(0, list.length - 1)];
        Global.currentX = pickedLocation.x;
        Global.currentY = pickedLocation.y;
        Global.previousDirection = new Phaser.Point();
        level.game.state.start("gameplay", true);
    }
}