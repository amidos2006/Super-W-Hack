class EmptyTile extends BaseTile{
    sprite:Phaser.Sprite;
    
    constructor(game, xTile:number, yTile:number){
        super(game, xTile, yTile);
        
        this.sprite = this.game.add.sprite(0, 0, "graphics");
        this.sprite.animations.add("normal", [1]);
        this.sprite.animations.play("normal");
        this.sprite.tint = 0x333333;
        this.add(this.sprite);
    }
}