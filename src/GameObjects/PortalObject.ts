/// <reference path="BaseGameObject.ts"/>

class PortalObject extends BaseGameObject{
    sprite:Phaser.Sprite;
    
    constructor(game:Phaser.Game){
        super(game, 0, 0);
        
        this.sprite = this.game.add.sprite(0, 0, "graphics");
        this.sprite.animations.add("normal", [0]);
        this.sprite.animations.play("normal");
        this.sprite.tint = 0x80bfff;
        this.sprite.alpha = 0;
        this.add(this.sprite);
    }
    
    showPortal(x:number, y:number){
        this.sprite.alpha = 1;
        this.x = x * Global.TILE_SIZE;
        this.y = y * Global.TILE_SIZE;
    }
    
    enterPortal(){
        Global.levelNumber += 1;
        Global.constructLevel(this.game.rnd);
        this.game.state.start("gameplay");
    }
}