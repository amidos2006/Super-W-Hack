class BaseTile extends BaseGameObject{
    constructor(game:Phaser.Game, xTile:number, yTile:number){
        super(game, xTile * Global.TILE_SIZE, yTile * Global.TILE_SIZE);
    }
}