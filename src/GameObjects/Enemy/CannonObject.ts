class CannonObject extends BaseGameObject
{
    cannonDirection:Phaser.Point;
    constructor(game:Phaser.Game, x:number, y:number, cannonDirection:Phaser.Point)
    {
         super(game, x, y);
         this.cannonDirection = cannonDirection;
    }
    
    blockShot(playerPosition:Phaser.Point, enemy:EnemyObject, tileMap:TileTypeEnum[][], checkType:TileTypeEnum)
    {
         if (enemy.getTilePosition().y == playerPosition.y
                && enemy.getTilePosition().x > playerPosition.x
                && this.cannonDirection.equals(new Phaser.Point(-1, 0)))
                {
                    for(var i = enemy.getTilePosition().x - 1; i >= playerPosition.x; i--)
                    {
                        console.log("Checking for type (" + checkType + "): " + i + "," + playerPosition.y + " " + tileMap[i][playerPosition.y])
                        if(tileMap[i][playerPosition.y] == checkType)
                        {
                            return new Phaser.Point(i, playerPosition.y);
                        }
                    }
                }
                
         if (enemy.getTilePosition().y == playerPosition.y
                && enemy.getTilePosition().x < playerPosition.x
                && this.cannonDirection.equals(new Phaser.Point(1, 0)))
                {
                    for(var i = enemy.getTilePosition().x + 1; i <= playerPosition.x; i++)
                    {
                        console.log("Checking for type (" + checkType + "): " + i + "," + playerPosition.y + " " + tileMap[i][playerPosition.y])
                        if(tileMap[i][playerPosition.y] == checkType)
                        {
                            return new Phaser.Point(i, playerPosition.y);
                        }
                    }
                }
                
         if (enemy.getTilePosition().x == playerPosition.x
                && enemy.getTilePosition().y < playerPosition.y
                && this.cannonDirection.equals(new Phaser.Point(0, -1)))
                {
                    for(var i = enemy.getTilePosition().y - 1; i >= playerPosition.y; i--)
                    {
                        console.log("Checking for type (" + checkType + "): " + playerPosition.x + "," + i + " " + tileMap[i][playerPosition.y])
                        if(tileMap[playerPosition.x][i] == checkType)
                        {
                            return new Phaser.Point(playerPosition.x, i);
                        }
                    }
                }
                
         if (enemy.getTilePosition().x == playerPosition.x
                && enemy.getTilePosition().y > playerPosition.y
                && this.cannonDirection.equals(new Phaser.Point(0, 1)))
                {
                    for(var i = enemy.getTilePosition().y + 1; i <= playerPosition.y; i++)
                    {
                        console.log("Checking for type (" + checkType + "): " + playerPosition.x + "," + i + " " + tileMap[i][playerPosition.y])
                        if(tileMap[playerPosition.x][i] == checkType)
                        {
                            return new Phaser.Point(playerPosition.x, i);
                        }
                    }
                }
                
         return null;       
    }
      
    shoot(playerPosition:Phaser.Point, enemy:EnemyObject, tileMap:TileTypeEnum[][])
    {
        var colPoint:Phaser.Point = null;
        
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
                && this.blockShot(playerPosition, enemy, tileMap, TileTypeEnum.Wall) == null) {
                colPoint = this.blockShot(playerPosition, enemy, tileMap, TileTypeEnum.Enemy);
                if(colPoint == null){
                    colPoint = playerPosition;
                }
            }

            if (enemy.getTilePosition().y == playerPosition.y
                && enemy.getTilePosition().x < playerPosition.x
                && this.cannonDirection.equals(new Phaser.Point(1, 0))
                && this.blockShot(playerPosition, enemy, tileMap, TileTypeEnum.Wall) == null) {
                colPoint = this.blockShot(playerPosition, enemy, tileMap, TileTypeEnum.Enemy);
                if(colPoint == null){
                    colPoint = playerPosition;
                }
            }

            if (enemy.getTilePosition().x == playerPosition.x
                && enemy.getTilePosition().y < playerPosition.y
                && this.cannonDirection.equals(new Phaser.Point(0, 1))
                && this.blockShot(playerPosition, enemy, tileMap, TileTypeEnum.Wall) == null) {
                colPoint = this.blockShot(playerPosition, enemy, tileMap, TileTypeEnum.Enemy);
                if(colPoint == null){
                    colPoint = playerPosition;
                }
            }

            if (enemy.getTilePosition().x == playerPosition.x
                && enemy.getTilePosition().y > playerPosition.y
                && this.cannonDirection.equals(new Phaser.Point(0, -1))
                && this.blockShot(playerPosition, enemy, tileMap, TileTypeEnum.Wall) == null) {
                colPoint = this.blockShot(playerPosition, enemy, tileMap, TileTypeEnum.Enemy);
                if(colPoint == null){
                    colPoint = playerPosition;
                }
            }
        
        return colPoint;
    }
    
    getCannonDirection()
    {
        return this.cannonDirection;
    }
}