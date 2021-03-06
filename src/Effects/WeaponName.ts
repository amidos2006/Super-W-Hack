/// <reference path="../BaseGameObject.ts"/>

class WeaponName extends BaseGameObject{
    movingSpeed:number;
    fadingSpeed:number;
    fadeOut:boolean;
    constructor(game:Phaser.Game, x:number, y:number, name:String, color:number = 0xffffff, movingSpeed:number = 0.4, fadingSpeed:number = 0.004){
        super(game, (x + 0.5) * Global.TILE_SIZE, (y + 0.5) * Global.TILE_SIZE);
        
        this.movingSpeed = movingSpeed;
        this.fadingSpeed = fadingSpeed;
        this.fadeOut = false;
        
        var style = { font: "15px pixelFont", fill: "#ffffff", align: "center" };
        
        var text:Phaser.Text = this.game.add.text(0, 0, name.toString(), style, this);
        text.anchor.set(0.5, 0.5);
        text.wordWrap = true;
        text.wordWrapWidth = (Global.ROOM_WIDTH - 4) * Global.TILE_SIZE;
        text.tint = color;
        this.add(text);
        
        if(this.x < text.width / 2 + Global.TILE_SIZE){
            this.x = text.width/2 + Global.TILE_SIZE;
        }
        if(this.x > this.game.width - text.width/2 - Global.TILE_SIZE){
            this.x = this.game.width - text.width/2 - Global.TILE_SIZE;
        }
        
        this.alpha = 0;
    }
    
    update(){
        super.update();
        
        this.y -= this.movingSpeed;
        this.movingSpeed *= 0.995;
        if(this.fadeOut){
            this.alpha -= this.fadingSpeed;
            if(this.alpha <= 0){
                this.destroy();
            }
        }
        else{
            this.alpha += 0.1;
            if(this.alpha > 1){
                this.alpha = 1;
                this.fadeOut=true;
            }
        }
    }
}