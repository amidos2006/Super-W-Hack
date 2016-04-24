/// <reference path="../BaseGameObject.ts"/>

class WhiteLayer extends BaseGameObject{
    graphics:Phaser.Graphics;
    fadeOutSpeed:number;
    
    constructor(game:Phaser.Game, x:number, y:number, fadeOutSpeed:number){
        super(game, x, y);
        
        this.fadeOutSpeed = fadeOutSpeed;
        
        this.graphics = this.game.add.graphics(0, 0, this);
        this.graphics.beginFill(0xdddddd, 1);
        this.graphics.drawRect(0, 0, Global.ROOM_WIDTH * Global.TILE_SIZE, Global.ROOM_HEIGHT * Global.TILE_SIZE);
        this.graphics.endFill();
        this.add(this.graphics);
    }
    
    update(){
        super.update();
        
        this.alpha -= this.fadeOutSpeed;
        if(this.alpha <= 0){
            this.killObject();
        }
    }
}