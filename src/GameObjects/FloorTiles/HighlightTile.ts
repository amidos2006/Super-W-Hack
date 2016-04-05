/// <reference path="BaseTile.ts"/>

class HighlightTile extends BaseTile{
    sprite:Phaser.Sprite;
    constructor(game:Phaser.Game){
        super(game, 0, 0);
        
        this.sprite = this.game.add.sprite(0, 0, "graphics");
        this.sprite.animations.add("normal", [5]);
        this.sprite.animations.play("normal");
        this.sprite.tint = 0x86b7c0;
        this.add(this.sprite);
        
        this.alpha = 0;
    }
    
    hide(){
        this.alpha = 0;
    }
    
    show(){
        this.alpha = 1;
    }
}