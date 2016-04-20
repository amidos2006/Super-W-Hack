class ExplosiveEnemyObject extends EnemyObject implements Movement
{
    exploded:boolean;
    
    constructor(game:Phaser.Game, x:number, y:number, health:number, numberOfCannons:number,
        cannonDirection1:Phaser.Point)
    {
        super(game, x, y, health, numberOfCannons, cannonDirection1);
        this.exploded = false;
        this.enemyDirection = this.pickDirection();
        this.enemySprite = this.game.add.sprite(0, 0, "graphics");
        this.enemySprite.animations.add("normal", [8]);
        this.enemySprite.animations.play("normal");
        this.enemySprite.tint = 0xcc6668;
        this.add(this.enemySprite);
    }
    
    getRandomFreeDirection(enemyDirection:Phaser.Point, tileMap:TileTypeEnum[][])
    {
        var dir:Phaser.Point = new Phaser.Point(0,0);
        var dirs:Phaser.Point[] = [];
        for(var i:number = 1; i < this.directions.length; i++)
        {
            if(this.updateEnemy(this.directions[i], tileMap) == true)
            {
                dirs.push(this.directions[i]);
            }
        }
        
        if (dirs.length > 0)
        {
            dir = dirs[(Math.floor(Math.random() * dirs.length) + 1) - 1];
        }
        return dir;
    }
    
    playerInSameDirection(playerPosition:Phaser.Point, tileMap:TileTypeEnum[][])
    {
         if (this.getTilePosition().y == playerPosition.y
                && this.getTilePosition().x > playerPosition.x)
                {
                    for(var i = this.getTilePosition().x - 1; i >= playerPosition.x; i--)
                    {
                        if(tileMap[i][playerPosition.y] == TileTypeEnum.Wall
                            || tileMap[i][playerPosition.y] == TileTypeEnum.Enemy)
                        {
                            return new Phaser.Point(-1, 0);
                        }
                    }
                }
                
         if (this.getTilePosition().y == playerPosition.y
                && this.getTilePosition().x < playerPosition.x)
                {
                    for(var i = this.getTilePosition().x + 1; i <= playerPosition.x; i++)
                    {
                         if(tileMap[i][playerPosition.y] == TileTypeEnum.Wall
                            || tileMap[i][playerPosition.y] == TileTypeEnum.Enemy)
                        {
                            return new Phaser.Point(1, 0);
                        }
                    }
                }
     }
     
     enemyMove(enemyDirection:Phaser.Point, tileMatrix:TileTypeEnum[][])
     {
        this.enemyDirection = this.playerInSameDirection(enemyDirection, tileMatrix);
        if(this.updateEnemy(this.enemyDirection, tileMatrix))
        {
            this.goEnemy(this.enemyDirection, tileMatrix);
        }else{
            this.exploded = true;
        }
     }
     
     getExploded()
     {
         return this.exploded;
     }
}