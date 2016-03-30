class BoxObject extends BaseGameObject{
    sprite:Phaser.Sprite;
    
    constructor(game:Phaser.Game){
        super(game, 0, 0);
        
        this.sprite = this.game.add.sprite(0, 0, "graphics");
        this.sprite.animations.add("normal", [4]);
        this.sprite.animations.play("normal");
        this.sprite.tint = 0xffcc66;
        this.sprite.alpha = 0;
        this.add(this.sprite);
    }
    
    show(playerPos:Phaser.Point, roomMatrix:TileTypeEnum[][]){
        this.sprite.alpha = 1;
    }
}