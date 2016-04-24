/// <reference path="../BaseGameObject.ts"/>

class DeathEffect extends BaseGameObject{
    alphaSpeed:number;
    scaleSpeed:number;
    
    constructor(game:Phaser.Game, xTile:number, yTile:number, gIndex:number, color:number, scaleSpeed:number = 0.2, alphaSpeed:number = 0.08){
        super(game, (xTile + 0.5) * Global.TILE_SIZE, (yTile + 0.5) * Global.TILE_SIZE);
        
        this.alphaSpeed = alphaSpeed;
        this.scaleSpeed = scaleSpeed;
        
        var graphics:Phaser.Sprite = this.game.add.sprite(0, 0, "graphics");
        graphics.anchor.set(0.5, 0.5);
        graphics.animations.add("normal", [gIndex]);
        graphics.animations.play("normal");
        graphics.tint = color;
        this.add(graphics);
    }
    
    update(){
        super.update();
        
        this.scale.x += this.scaleSpeed;
        this.scale.y += this.scaleSpeed;
        this.alpha -= this.alphaSpeed;
        if(this.alpha <= 0){
            this.killObject();
        }
    }
}