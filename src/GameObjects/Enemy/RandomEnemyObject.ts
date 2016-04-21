class RandomEnemyObject extends EnemyObject implements Movement
{
    constructor(game:Phaser.Game, x:number, y:number, health:number, numberOfCannons:number,
        cannonDirection1:Phaser.Point)
    {
        super(game, x, y, health, numberOfCannons, cannonDirection1);
        this.enemySpriteIndex = 8;
        
        this.enemyDirection = this.pickDirection();
        this.enemySprite = this.game.add.sprite(0, 0, "graphics");
        this.enemySprite.animations.add("normal", [this.enemySpriteIndex]);
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
     
     enemyMove(enemyDirection:Phaser.Point, tileMatrix:TileTypeEnum[][])
     {
        if(!this.updateEnemy(this.enemyDirection, tileMatrix))
        {
            this.enemyDirection = this.getRandomFreeDirection(this.enemyDirection, tileMatrix);//this.pickDirectionWithThisConstraint(this.findDirectionIndex(this.enemyDirection));
            this.goEnemy(this.enemyDirection, tileMatrix);
        }else{
            this.goEnemy(this.enemyDirection, tileMatrix);
        }
     }
}