class ItemPeople extends BaseGameObject{
    sprite:Phaser.Sprite;
    personInfo:BasePeople;
    
    constructor(game:Phaser.Game){
        super(game, 0, 0);
        
        this.personInfo = new BasePeople("isaksen", 8 + 8 * Global.levelNumber, 23);
        
        this.sprite = this.game.add.sprite(0, 0, "graphics");
        this.sprite.animations.add("normal", [23]);
        this.sprite.animations.play("normal");
        this.sprite.tint = 0x6b996b;
        this.sprite.alpha = 0;
        this.add(this.sprite);
    }
    
    showItem(xTile:number, yTile:number){
        this.sprite.alpha = 1;
        this.x = xTile * Global.TILE_SIZE;
        this.y = yTile * Global.TILE_SIZE;
    }
    
    collectGuy(){
        this.game.add.existing(new WeaponName(this.game, this.getTilePosition().x, 
            this.getTilePosition().y, this.personInfo.name));
        Global.audioManager.playPickUpCrate();
        this.killObject();
    }
}