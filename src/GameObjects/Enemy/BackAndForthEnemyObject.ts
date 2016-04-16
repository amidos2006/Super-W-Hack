/// <reference path="../Enemy/EnemyObject.ts"/>

class BackAndForthEnemyObject extends EnemyObject implements Movement
{
    constructor(game:Phaser.Game, x:number, y:number, health:number, 
        numberOfcannons:number, cannonDirection1:Phaser.Point, movementDirection:Phaser.Point)
    {
        super(game, x, y, health, numberOfcannons, cannonDirection1);
        this.enemyDirection = movementDirection;
        this.enemySprite = this.game.add.sprite(0, 0, "graphics");
        this.enemySprite.animations.add("normal", [EnemyObject.enemySpriteNumbers[EnemyTypeEnum.BackAndForth]]);
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
         if(!this.updateEnemy(this.enemyDirection, tileMatrix) && 
            !this.updateEnemy(this.reverseDirection(this.enemyDirection), tileMatrix))
        {
                this.enemyDirection = this.revertAxis(this.enemyDirection);
        }
        
        if(!this.updateEnemy(this.enemyDirection, tileMatrix))
        {
            this.goEnemy(this.reverseDirection(this.enemyDirection), tileMatrix);
        }else{
            this.goEnemy(this.enemyDirection, tileMatrix);
        }
     }
}