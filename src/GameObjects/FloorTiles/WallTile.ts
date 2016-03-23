class WallTile extends BaseTile{
    sprite:Phaser.Sprite;
    
    constructor(game:Phaser.Game, xTile:number, yTile:number){
        super(game, xTile, yTile);
        
        this.sprite = this.game.add.sprite(0, 0, "graphics", [0]);
        this.sprite.tint = 0x664729;
        this.add(this.sprite);
    }
}