class BaseGameObject extends Phaser.Group{
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        this.x = x;
        this.y = y;
    }
    
    isAnimating(){
        return false;
    }
    
    getTilePosition(){
        return new Phaser.Point(Math.floor(this.x / Global.TILE_SIZE), Math.floor(this.y / Global.TILE_SIZE));
    }
    
    checkCollision(xTile:number, yTile:number){
        return this.getTilePosition().equals(new Phaser.Point(xTile, yTile));
    }
    
    killObject(){
        this.destroy(true);
    }
}