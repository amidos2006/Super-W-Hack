class RandomEnemyObject extends EnemyObject implements Movement
{
    constructor(game:Phaser.Game, x:number, y:number, health:number, numberOfCannons:number,
        cannonDirection1:Phaser.Point)
    {
        super(game, x, y, health, numberOfCannons, cannonDirection1);
        this.enemyDirection = this.pickDirection();
        this.enemySprite = this.game.add.sprite(0, 0, "graphics");
        this.enemySprite.animations.add("normal", [EnemyObject.enemySpriteNumbers[EnemyTypeEnum.Random]]);
        this.enemySprite.animations.play("normal");
        this.enemySprite.tint = 0xcc6668;
        this.add(this.enemySprite);
        
        var style = { font: "10px pixelFont", fill: "#cc6668", align: "left" };
        this.healthText = this.game.add.text(Global.TILE_SIZE - 3, Global.TILE_SIZE - 10, 
            this.enemyHealth.toString(), style, this);
        this.healthText.anchor.set(0, 0);
        this.add(this.healthText);
    }
    
     enemyMove(enemyDirection:Phaser.Point, tileMatrix:TileTypeEnum[][])
     {
        if(this.keepDirection % this.factorDirectionChange == 0)
        {
            this.enemyDirection = this.pickDirection();
        }
        this.keepDirection++;
        
        if(!this.updateEnemy(this.enemyDirection, tileMatrix))
        {
            var newDir = this.getFirstFreeDirection(this.enemyDirection, tileMatrix);//this.pickDirectionWithThisConstraint(this.findDirectionIndex(this.enemyDirection));
            this.updateEnemy(newDir, tileMatrix);
            this.goEnemy(newDir, tileMatrix);
        }else{
            this.goEnemy(this.enemyDirection, tileMatrix);
        }
     }
}