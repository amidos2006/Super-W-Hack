/// <reference path="BaseTile.ts"/>

class DirHighlightTile extends BaseTile{
    sprites:Phaser.Sprite[];
    
    constructor(game:Phaser.Game){
        super(game, 0, 0);
        
        this.sprites = [];
        for(var i:number=0; i<4; i++){
            var tempSprite = this.game.add.sprite((i%2==0?1:0) * (Math.floor(i / 2) * 2 - 1) * Global.TILE_SIZE / 2, 
                (i%2==1?1:0) * (Math.floor(i / 2) * 2 - 1) * Global.TILE_SIZE / 2, "graphics");
            tempSprite.animations.add("normal", [7]);
            tempSprite.animations.play("normal");
            tempSprite.tint = 0x86b7c0;
            tempSprite.alpha = 0;
            tempSprite.angle = ((i + 2) % 4) * 90;
            tempSprite.anchor.set(0.5, 0.5);
            this.sprites.push(tempSprite);
            this.add(tempSprite);
        }
    }
    
    hide(){
        for (var i = 0; i < this.sprites.length; i++) {
            this.sprites[i].alpha = 0;
        }
    }
    
    show(playerPosition:Phaser.Point, direction:Phaser.Point){
        this.hide();
        this.x = (playerPosition.x + 0.5) * Global.TILE_SIZE;
        this.y = (playerPosition.y + 0.5) * Global.TILE_SIZE;
        
        var index:number = Math.abs(direction.x) + Math.abs(direction.y) * 2 + 
            Phaser.Math.sign(direction.x + direction.y);
        this.sprites[index].alpha = 1;
    }
    
    isAppearing(){
        for (var i = 0; i < this.sprites.length; i++) {
            if(this.sprites[i].alpha > 0){
                return true;
            }
        }
        return false;
    }
}