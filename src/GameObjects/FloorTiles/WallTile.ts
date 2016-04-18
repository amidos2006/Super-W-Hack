/// <reference path="BaseTile.ts"/>

class WallTile extends BaseTile{
    sprite:Phaser.Sprite;
    
    constructor(game:Phaser.Game, xTile:number, yTile:number){
        super(game, xTile, yTile);
        
        this.sprite = this.game.add.sprite(0, 0, "graphics");
        this.sprite.animations.add("normal", [0]);
        this.sprite.animations.play("normal");
        switch (Global.levelCategory) {
            case 0:
                this.sprite.tint = 0x664729;
                break;
            case 1:
                this.sprite.tint = 0x664729;
                break;
            case 2:
                this.sprite.tint = 0x3d2966;
                break;
            case 3:
                this.sprite.tint = 0xb3b336;
                break;
            case 4:
                this.sprite.tint = 0x294766;
                break;
            case 5:
                this.sprite.tint = 0x3b6629;
                break;
            default:
                this.sprite.tint = 0x664729;
                break;
        }
        
        this.add(this.sprite);
    }
    
}