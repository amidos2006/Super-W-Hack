class AdventureName extends BaseUIObject{
    alphaSpeed:number;
    constructor(game:Phaser.Game, x:number, y:number, name:string, alphaSpeed:number = 0.05){
        super(game);
        this.alphaSpeed = alphaSpeed;
        
        var style = { font: "20px pixelFont", fill: "#ffffff", align: "center" };
        
        var text:Phaser.Text = this.game.add.text(x, y, name, style, this);
        text.anchor.set(0.5, 0.5);
        text.wordWrap = true;
        text.wordWrapWidth = game.width - 4 * Global.TILE_SIZE;
        this.add(text);
        
        var mainPoint:Phaser.Point = new Phaser.Point(x - text.width / 2 - Global.TILE_SIZE - 5, y - text.height / 2 - Global.TILE_SIZE / 2);
        var sprite:Phaser.Sprite = this.game.add.sprite(mainPoint.x, mainPoint.y, "graphics");
        sprite.animations.add("normal", [0]);
        sprite.animations.play("normal");
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(0.5, 0.5);
        sprite.tint = 0x664729;
        this.add(sprite);
        
        sprite = this.game.add.sprite(mainPoint.x + Global.TILE_SIZE / 2, mainPoint.y, "graphics");
        sprite.animations.add("normal", [0]);
        sprite.animations.play("normal");
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(0.5, 0.5);
        sprite.tint = 0x664729;
        this.add(sprite);
        
        sprite = this.game.add.sprite(mainPoint.x, mainPoint.y + Global.TILE_SIZE / 2, "graphics");
        sprite.animations.add("normal", [0]);
        sprite.animations.play("normal");
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(0.5, 0.5);
        sprite.tint = 0x664729;
        this.add(sprite);
        
        mainPoint = new Phaser.Point(x + text.width / 2 + Global.TILE_SIZE, y + text.height / 2 + Global.TILE_SIZE / 2 - 5);
        var sprite:Phaser.Sprite = this.game.add.sprite(mainPoint.x, mainPoint.y, "graphics");
        sprite.animations.add("normal", [0]);
        sprite.animations.play("normal");
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(0.5, 0.5);
        sprite.tint = 0x664729;
        this.add(sprite);
        
        sprite = this.game.add.sprite(mainPoint.x - Global.TILE_SIZE / 2, mainPoint.y, "graphics");
        sprite.animations.add("normal", [0]);
        sprite.animations.play("normal");
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(0.5, 0.5);
        sprite.tint = 0x664729;
        this.add(sprite);
        
        sprite = this.game.add.sprite(mainPoint.x, mainPoint.y - Global.TILE_SIZE / 2, "graphics");
        sprite.animations.add("normal", [0]);
        sprite.animations.play("normal");
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(0.5, 0.5);
        sprite.tint = 0x664729;
        this.add(sprite);
        
        this.alpha = 0;
    }
    
    fadeOut(speed:number){
        this.alphaSpeed = speed;
    }
    
    update(){
        super.update();
        
        this.alpha += this.alphaSpeed;
        if(this.alpha <= 0){
            this.game.state.start("gameplay", true);
            this.alpha = 0;
        }
        if(this.alpha >= 1){
            this.alpha = 1;
        }
    }
}