/// <reference path="../BaseUIObject.ts"/>

class MiniMap extends BaseUIObject{
    graphics:Phaser.Graphics;
    player:Phaser.Graphics;
    
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        this.graphics = this.game.add.graphics(x, y, this);
        for(var x:number=0; x<Global.mapWidth; x++){
            for(var y:number=0; y<Global.mapHeight; y++){
                var mapX:number = x * Global.MAP_SIZE;
                var mapY:number = y * Global.MAP_SIZE;
                if(Global.levelRooms[x][y] != null){
                    this.graphics.beginFill(0xFFFFFF, 1);
                    this.graphics.drawRect(mapX + 1, mapY + 1, Global.MAP_SIZE - 2, Global.MAP_SIZE - 2);
                    this.graphics.endFill();
                }
                
                for(var dx:number=-1; dx<=1; dx++){
                    for(var dy:number=-1;dy<=1;dy++){
                        if(Global.levelRooms[x][y] != null && 
                            Global.levelRooms[x][y].checkDoor(new Phaser.Point(dx, dy))){
                            mapX = x * Global.MAP_SIZE + (1 + dx) * Global.MAP_SIZE / 2;
                            mapY = y * Global.MAP_SIZE + (1 + dy) * Global.MAP_SIZE / 2;
                            this.graphics.beginFill(0xFFFFFF, 1);
                            this.graphics.drawRect(mapX - Math.abs(dy) - Math.floor((dx + 1) / 2), 
                                mapY - Math.abs(dx)  - Math.floor((dy + 1) / 2), 
                                1 + Math.abs(dy), 1 + Math.abs(dx));
                            this.graphics.endFill();
                        }
                    }
                }
            }
        }
        
        this.player = this.game.add.graphics(0, 0, this);
        this.player.beginFill(0x111111, 1);
        this.player.drawRect(-2, -2, 4, 4);
        this.player.endFill();
        this.add(this.player);
    }
    
    update(){
        super.update();
        
        this.player.x = this.graphics.x + (Global.currentX + 0.5) * Global.MAP_SIZE;
        this.player.y = this.graphics.y + (Global.currentY + 0.5) * Global.MAP_SIZE;
    }
}