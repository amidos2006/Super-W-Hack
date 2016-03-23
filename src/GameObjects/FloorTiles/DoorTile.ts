class DoorTile extends BaseTile{
    floorSprite:EmptyTile;
    sprite:Phaser.Sprite;
    
    constructor(game:Phaser.Game, xTile:number, yTile:number){
        super(game, xTile, yTile);
        
        this.floorSprite = new EmptyTile(game, xTile, yTile);
        this.game.add.existing(this.floorSprite);
        
        this.sprite = this.game.add.sprite(0, 0, "graphics");
        this.sprite.animations.add("normal", [2]);
        this.sprite.animations.play("normal");
        this.sprite.tint = 0xffcc66;
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