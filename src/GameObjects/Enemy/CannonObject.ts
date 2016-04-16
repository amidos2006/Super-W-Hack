class CannonObject extends BaseGameObject
{
    cannonDirection:Phaser.Point;
    constructor(game:Phaser.Game, x:number, y:number, cannonDirection:Phaser.Point)
    {
         super(game, x, y);
         this.cannonDirection = cannonDirection;
    }
    
    blockShot(playerPosition:Phaser.Point, enemy:EnemyObject, tileMap:TileTypeEnum[][])
    {
         if (enemy.getTilePosition().y == playerPosition.y
                && enemy.getTilePosition().x > playerPosition.x
                && this.cannonDirection.equals(new Phaser.Point(-1, 0)))
                {
                    for(var i = enemy.getTilePosition().x; i > playerPosition.x; i--)
                    {
                        if(tileMap[i][playerPosition.y] == TileTypeEnum.Wall)
                        {
                            return true;
                        }
                    }
                }
                
         if (enemy.getTilePosition().y == playerPosition.y
                && enemy.getTilePosition().x < playerPosition.x
                && this.cannonDirection.equals(new Phaser.Point(1, 0)))
                {
                    for(var i = enemy.getTilePosition().x; i < playerPosition.x; i++)
                    {
                        if(tileMap[i][playerPosition.y] == TileTypeEnum.Wall)
                        {
                            return true;
                        }
                    }
                }
                
         if (enemy.getTilePosition().x == playerPosition.x
                && enemy.getTilePosition().y < playerPosition.y
                && this.cannonDirection.equals(new Phaser.Point(0, 1)))
                {
                    for(var i = enemy.getTilePosition().y; i > playerPosition.y; i--)
                    {
                        if(tileMap[playerPosition.x][i] == TileTypeEnum.Wall)
                        {
                            return true;
                        }
                    }
                }
                
         if (enemy.getTilePosition().y == playerPosition.y
                && enemy.getTilePosition().x > playerPosition.x
                && this.cannonDirection.equals(new Phaser.Point(0, 1)))
                {
                    for(var i = enemy.getTilePosition().y; i < playerPosition.y; i++)
                    {
                        if(tileMap[playerPosition.x][i] == TileTypeEnum.Wall)
                        {
                            return true;
                        }
                    }
                }
                
         return false;       
    }
      
    shoot(playerPosition:Phaser.Point, enemy:EnemyObject, tileMap:TileTypeEnum[][])
    {
        var shot = false;
        
        console.log("player.x: " + playerPosition.x);
        console.log("player.y: " + playerPosition.y);
        console.log("e.x: " + enemy.getTilePosition().x);
        console.log("e.y: " + enemy.getTilePosition().y);
        console.log("c.x: " + this.x);
        console.log("c.y: " + this.y);
        console.log("cannon.x : " + this.cannonDirection.x);
        console.log("cannon.y : " + this.cannonDirection.y);
        
            if (enemy.getTilePosition().y == playerPosition.y
                && enemy.getTilePosition().x > playerPosition.x
                && this.cannonDirection.equals(new Phaser.Point(-1, 0))
                && !this.blockShot(playerPosition, enemy, tileMap)) 
                {
                shot = true;
            }

            if (enemy.getTilePosition().y == playerPosition.y
                && enemy.getTilePosition().x < playerPosition.x
                && this.cannonDirection.equals(new Phaser.Point(1, 0))
                && !this.blockShot(playerPosition, enemy, tileMap)) {
                    console.log("shoot!!!!");
                shot = true;
            }

            if (enemy.getTilePosition().x == playerPosition.x
                && enemy.getTilePosition().y < playerPosition.y
                && this.cannonDirection.equals(new Phaser.Point(0, 1))
                && !this.blockShot(playerPosition, enemy, tileMap)) {
                shot = true;
            }

            if (enemy.getTilePosition().x == playerPosition.x
                && enemy.getTilePosition().y > playerPosition.y
                && this.cannonDirection.equals(new Phaser.Point(0, -1))
                && !this.blockShot(playerPosition, enemy, tileMap)) {
                shot = true;
            }
        
        return shot;
    }
    
    getCannonDirection()
    {
        return this.cannonDirection;
    }
}