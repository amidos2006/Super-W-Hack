class StaticShooterEnemyObject extends EnemyObject implements Movement
{
    constructor(game:Phaser.Game, x:number, y:number, health:number, 
        numberOfcannons:number, cannonDirection1:Phaser.Point)
    {
        super(game, x, y, health, numberOfcannons, cannonDirection1);
        this.enemySprite = this.game.add.sprite(0, 0, "graphics");
        this.enemySprite.animations.add("normal", [6]);
        this.enemySprite.animations.play("normal");
        this.enemySprite.tint = 0xcc6668;
        this.add(this.enemySprite);
    }
    
    changeCannonDirection()
    {
        var index:number = this.findDirectionIndex(this.cannons[0].cannonDirection);
        this.cannons[0].cannonDirection = this.pickDirection();
    }
    
     enemyMove(enemyDirection:Phaser.Point, tileMatrix:TileTypeEnum[][])
     {
        console.log("C: " + this.cannons[0].cannonDirection); 
        this.changeCannonDirection();
     }
}