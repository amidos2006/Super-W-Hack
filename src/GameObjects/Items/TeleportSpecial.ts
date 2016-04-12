/// <reference path="BaseSpecial.ts"/>

class TeleportSpecial extends BaseSpecial{
    constructor(){
        super(2);
    }
    
    useSpecial(level:GameplayState){
        super.useSpecial(level);
        
        var levelValues:TileTypeEnum[][] = Global.getCurrentRoom().getMatrix(level.enemyObjects);
        var playerPos:Phaser.Point = level.playerObject.getTilePosition();
        levelValues[playerPos.x][playerPos.y] = TileTypeEnum.Wall;
        var values:number[] = [];
        for (var x = 0; x < Global.ROOM_WIDTH; x++) {
            for (var y = 0; y < Global.ROOM_HEIGHT; y++) {
                var currentValue:number = 0;
                if(levelValues[x][y] == TileTypeEnum.Passable){
                    for(var dx=-3; dx<= 3; dx++){
                        for(var dy=-3; dy<=3; dy++){
                            if(x + dx >= 0 && y + dy >= 0 && x + dx < Global.ROOM_WIDTH && y+dy < Global.ROOM_HEIGHT){
                                if(levelValues[dx + x][dy + y] == TileTypeEnum.Enemy){
                                    currentValue += Math.abs(dx + dy);
                                }
                                else{
                                    currentValue += 15;
                                }
                            }
                            else{
                                currentValue += 15;
                            }
                        }
                    }  
                }
                values.push(currentValue);
            }
        }
        
        var maxValue:number = values[0];
        var maxIndex:number[] = [];
        for (var i = 1; i < values.length; i++) {
            var currentValue = values[i];
            if(currentValue > maxValue){
                maxIndex = [i];
                maxValue = currentValue;
            }
            else if(currentValue == maxValue){
                maxIndex.push(i);
            }
        }
        
        var index:number = Phaser.ArrayUtils.getRandomItem(maxIndex);
        level.playerObject.x = Math.floor(index / Global.ROOM_WIDTH) * Global.TILE_SIZE;
        level.playerObject.y = Math.floor(index % Global.ROOM_WIDTH) * Global.TILE_SIZE;
        Global.audioManager.playSpecial(AudioManager.SPECIAL_TAT);
    }
}