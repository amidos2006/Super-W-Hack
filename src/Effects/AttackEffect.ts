class AttackEffect extends BaseGameObject{
    sprite:Phaser.Sprite;
    scaleInc:number;
    
    constructor(game:Phaser.Game, xTile:number, yTile:number){
        super(game, (xTile + 0.5) * Global.TILE_SIZE, (yTile + 0.5) * Global.TILE_SIZE);
        this.scaleInc = 0.01;
        
        this.sprite = this.game.add.sprite(0, 0, "graphics");
        this.sprite.animations.add("normal", [18, 19, 20, 21, 22], 30);
        this.sprite.animations.play("normal");
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.tint = 0xb36b47;
        this.add(this.sprite);
        
        this.add(this.sprite);
        
        var alphaTween:Phaser.Tween = this.game.add.tween(this);
        alphaTween.to({alpha: 0}, 200, Phaser.Easing.Linear.None);
        alphaTween.onComplete.add(this.killObject ,this);
        alphaTween.start();
    }
    
    update(){
        this.scale.x += this.scaleInc;
        this.scale.y += this.scaleInc;
    }
}