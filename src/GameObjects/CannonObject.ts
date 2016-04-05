class CannonObject extends BaseGameObject
{
    cannonDirection:Phaser.Point;
    constructor(game:Phaser.Game, x:number, y:number, cannonDirection:Phaser.Point)
    {
         super(game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
         this.cannonDirection = cannonDirection;
    }
    
    blockShoot(mapMatrix:TileTypeEnum[][])
    {
        var allowedToShoot = true;
        if(this.cannonDirection.equals(new Phaser.Point(1,0)))
        {
            console.log();
            for (var index = this.getTilePosition().x+1; index < 10; index++) {
                console.log("matrix[index][posY] : " + index + " " + this.getTilePosition().x + 1);
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
                   console.log("-------");
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
                   console.log("-------");
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
                   console.log("-------");
               }
            }
        }
        
        else
        {
            allowedToShoot = true;
            console.log("-------");
        }
        return allowedToShoot;
    }
      
    shoot(player:PlayerObject, enemy:EnemyObject)
    {
        var shot = false;
        
        console.log("player.x: " + player.x);
        console.log("player.y: " + player.y);
        console.log("this.x: " + enemy.getTilePosition().x);
        console.log("this.y: " + enemy.getTilePosition().y);
        // if (this.blockShoot(mapMatrix)) 
        // {
            if (enemy.position.y == player.y
                && enemy.position.x > player.x
                && this.cannonDirection.equals(new Phaser.Point(-1, 0))) {
                shot = true;
            }

            if (enemy.position.y == player.y
                && enemy.position.x < player.x
                && this.cannonDirection.equals(new Phaser.Point(1, 0))) {
                shot = true;
            }

            if (enemy.position.x == player.x
                && enemy.position.y < player.y
                && this.cannonDirection.equals(new Phaser.Point(0, 1))) {
                shot = true;
            }

            if (enemy.position.x == player.x
                && enemy.position.y > player.y
                && this.cannonDirection.equals(new Phaser.Point(0, -1))) {
                shot = true;
            }
        //}
        return shot;
    }
    
    getCannonDirection()
    {
        return this.cannonDirection;
    }
}