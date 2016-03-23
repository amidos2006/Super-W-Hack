class BaseGameObject extends Phaser.Group{
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        this.x = x;
        this.y = y;
    }
    
    isAnimating(){
        return false;
    }
    
    checkCollision(xTile:number, yTile:number){
        return Math.floor(this.x / Global.TILE_SIZE) == xTile && Math.floor(this.y / Global.TILE_SIZE) == yTile;
    }
}