class AttackEffect extends BaseGameObject{
    sprite:Phaser.Sprite;
    constructor(game:Phaser.Game, xTile:number, yTile:number){
        super(game, (xTile + 0.5) * Global.TILE_SIZE, (yTile + 0.5) * Global.TILE_SIZE);
        
        this.sprite;
        this.sprite.tint = 0xf29130;
        
        this.add(this.sprite);
    }
}