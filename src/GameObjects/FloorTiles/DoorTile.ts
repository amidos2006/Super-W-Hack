class DoorTile extends BaseTile{
    floorSprite:EmptyTile;
    sprite:Phaser.Sprite;
    
    constructor(game:Phaser.Game, xTile:number, yTile:number){
        super(game, xTile, yTile);
        this.floorSprite = new EmptyTile(game, xTile, yTile);
        this.add(this.floorSprite);
        
        this.sprite = this.game.add.sprite(0, 0, "graphics", [2]);
        this.sprite.tint = 0xffcd66;
        this.add(this.sprite);
    }
    
    lock(){
        this.floorSprite.alpha = 0;
        this.sprite.alpha = 1;
    }
    
    unlock(){
        this.floorSprite.alpha = 1;
        this.sprite.alpha = 0;
    }
}