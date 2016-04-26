class HarmfulFloorObject extends BaseGameObject{
    constructor(game:Phaser.Game, xTile:number, yTile:number, damage:number, time:number, explode:boolean){
        super(game, xTile * Global.TILE_SIZE, yTile * Global.TILE_SIZE);
    }
    
    killObject(){
        super.killObject();
    }
}