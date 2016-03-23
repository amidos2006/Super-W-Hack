class DoorTile extends BaseTile{
    floorSprite:EmptyTile;
    sprite:Phaser.Sprite;
    direction:Phaser.Point;
    
    constructor(game:Phaser.Game, direction:Phaser.Point){
        super(game, Math.floor((direction.x + 1) * Global.ROOM_WIDTH / 2) - Math.floor((direction.x + 1) / 2), 
            Math.floor((direction.y + 1) * Global.ROOM_HEIGHT / 2) - Math.floor((direction.y + 1) / 2));
        
        this.direction = direction;
        
        this.floorSprite = new EmptyTile(game, Math.floor(this.x / Global.TILE_SIZE), 
            Math.floor(this.y / Global.TILE_SIZE));
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