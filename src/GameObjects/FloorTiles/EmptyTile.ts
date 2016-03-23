class EmptyTile extends BaseTile{
    sprite:Phaser.Sprite;
    
    constructor(game, xTile:number, yTile:number){
        super(game, xTile, yTile);
        
        this.sprite = this.game.add.sprite(0, 0, "graphics", [1]);
        this.sprite.tint = 0x404040;
        this.add(this.sprite);
    }
}