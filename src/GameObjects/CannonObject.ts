class CannonObject extends BaseGameObject
{
    cannonDirection:Phaser.Point;
    constructor(game:Phaser.Game, x:number, y:number, speed:number, cannonDirection:Phaser.Point)
    {
         super(game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
         this.cannonDirection = cannonDirection;
    }
    
    blockShoot(mapMatrix:TileTypeEnum[][])
    {
        var allowedToShoot = true;
        if(this.cannonDirection.equals(new Phaser.Point(1,0)))
        {
            for (var index = this.getTilePosition().x+1; index < 10; index++) {
               if(mapMatrix[index][this.getTilePosition().y] == TileTypeEnum.Hole
                || mapMatrix[index][this.getTilePosition().y] == TileTypeEnum.Wall)
               {
                   allowedToShoot = false;
               }
            }
        }
        
        else if(this.cannonDirection.equals(new Phaser.Point(-1,0)))
        {
            for (var index = this.getTilePosition().x-1; index > 0; index--) {
               if(mapMatrix[index][this.getTilePosition().y] == TileTypeEnum.Hole
                || mapMatrix[index][this.getTilePosition().y] == TileTypeEnum.Wall)
               {
                   allowedToShoot = false;
               }
            }
        }
        
        else if(this.cannonDirection.equals(new Phaser.Point(0,1)))
        {
            for (var index = this.getTilePosition().y+1; index < 10; index++) {
               if(mapMatrix[this.getTilePosition().x][index] == TileTypeEnum.Hole
                || mapMatrix[this.getTilePosition().x][index] == TileTypeEnum.Wall)
               {
                   allowedToShoot = false;
               }
            }
        }
        
        else if(this.cannonDirection.equals(new Phaser.Point(0,-1)))
        {
            for (var index = this.getTilePosition().y-1; index > 0; index--) {
               if(mapMatrix[this.getTilePosition().x][index] == TileTypeEnum.Hole
                || mapMatrix[this.getTilePosition().x][index] == TileTypeEnum.Wall)
               {
                   allowedToShoot = false;
               }
            }
        }
        
        else
        {
            allowedToShoot = true;
        }
    }
      
    shoot(player:PlayerObject, mapMatrix:TileTypeEnum[][])
    {
        var shot = false;
        
        if (this.blockShoot(mapMatrix)) 
        {
            if (this.getTilePosition().y == player.getTilePosition().y
                && this.getTilePosition().x > player.getTilePosition().x
                && this.cannonDirection.equals(new Phaser.Point(-1, 0))) {
                shot = true;
            }

            else if (this.getTilePosition().y == player.getTilePosition().y
                && this.getTilePosition().x < player.getTilePosition().x
                && this.cannonDirection.equals(new Phaser.Point(1, 0))) {
                shot = true;
            }

            else if (this.getTilePosition().x == player.getTilePosition().x
                && this.getTilePosition().y < player.getTilePosition().y
                && this.cannonDirection.equals(new Phaser.Point(0, 1))) {
                shot = true;
            }

            else if (this.getTilePosition().x == player.getTilePosition().x
                && this.getTilePosition().y > player.getTilePosition().y
                && this.cannonDirection.equals(new Phaser.Point(0, -1))) {
                shot = true;
            }
        }
        return shot;
    }
    
    getCannonDirection()
    {
        return this.cannonDirection;
    }
}