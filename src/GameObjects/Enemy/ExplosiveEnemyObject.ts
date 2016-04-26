class ExplosiveEnemyObject extends EnemyObject implements Movement
{
    lightRay:CannonObject;
    
    constructor(game:Phaser.Game, x:number, y:number, health:number, numberOfCannons:number,
        cannonDirection1:Phaser.Point)
    {
        super(game, x, y, health, numberOfCannons, cannonDirection1);
        this.lightRay = new CannonObject(new Phaser.Point());
        this.enemyDirection = this.pickDirection();
        this.enemySprite = this.game.add.sprite(0, 0, "graphics");
        this.enemySprite.animations.add("normal", [8]);
        this.enemySprite.animations.play("normal");
        this.enemySprite.tint = 0xcc6668;
        this.add(this.enemySprite);
    }
    
    playerInSameDirection(playerPosition:Phaser.Point, tileMap:TileTypeEnum[][])
    {
        var result:Phaser.Point = null;
        for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
                result = this.lightRay.shoot(playerPosition, this, tileMap);
                if(result != null){
                    return result;
                }
            }
        }
        return new Phaser.Point();
     }
     
     killObject(){
         //TODO Create the explosions
         super.killObject();
     }
     
     enemyMove(enemyDirection:Phaser.Point, tileMatrix:TileTypeEnum[][])
     {
        this.enemyDirection = this.playerInSameDirection(enemyDirection, tileMatrix);
        if(this.updateEnemy(this.enemyDirection, tileMatrix)){
            this.goEnemy(this.enemyDirection, tileMatrix);
        }else{
            this.killObject();
        }
     }
}