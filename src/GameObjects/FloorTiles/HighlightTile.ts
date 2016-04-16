/// <reference path="BaseTile.ts"/>

class HighlightTile extends BaseTile{
    sprite:Phaser.Sprite;
    damage:Phaser.Text;
    constructor(game:Phaser.Game){
        super(game, 0, 0);
        
        this.sprite = this.game.add.sprite(0, 0, "graphics");
        this.sprite.animations.add("normal", [5]);
        this.sprite.animations.play("normal");
        this.sprite.tint = 0x86b7c0;
        this.add(this.sprite);
        
        var style = { font: "10px pixelFont", fill: "#86b7c0", align: "left" };
        this.damage = this.game.add.text(Global.TILE_SIZE / 2 + 1, Global.TILE_SIZE - 5, 
            "0", style, this);
        this.damage.anchor.set(0.5, 0);
        this.add(this.damage);
        this.damage.alpha = 0;
        
        this.alpha = 0;
    }
    
    hide(){
        this.alpha = 0;
    }
    
    show(value:number){
        this.alpha = 1;
        this.damage.text = value.toString();
        this.damage.anchor.set(0.5, 0);
    }
}