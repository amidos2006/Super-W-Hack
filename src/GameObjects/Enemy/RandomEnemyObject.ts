class RandomEnemyObject extends EnemyObject implements Movement
{
    MIN_DISTANCE:number = 3;
    MAX_DISTANCE:number = 6;
    PROB_CHANGE:number = 0.001;
    distanceChange:number;
    
    constructor(game:Phaser.Game, x:number, y:number, health:number, numberOfCannons:number,
        cannonDirection1:Phaser.Point)
    {
        super(game, x, y, health, numberOfCannons, cannonDirection1);
        this.enemySpriteIndex = 8;
        this.distanceChange = game.rnd.integerInRange(this.MIN_DISTANCE, this.MAX_DISTANCE);
        
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
        for(var i:number = 0; i < this.directions.length; i++){
            if(this.updateEnemy(this.directions[i], tileMap)){
                if(!enemyDirection.equals(this.directions[i])) dirs.push(this.directions[i]);
            }
        }
        
        if (dirs.length > 0){
            dir = dirs[this.game.rnd.integerInRange(0, dirs.length - 1)];
        }
        if(dir.equals(enemyDirection.multiply(-1, -1))){
            dir = dirs[this.game.rnd.integerInRange(0, dirs.length - 1)]
        }
        return dir;
    }
    
    takeDamage(damage:number){
        var result:boolean = super.takeDamage(damage);
        if(!result && damage > 0){
            this.distanceChange = 0;
        }
        
        return result;
    }
     
    enemyMove(enemyDirection: Phaser.Point, tileMatrix: TileTypeEnum[][]) {
        this.distanceChange -= 1;
        if (!this.updateEnemy(this.enemyDirection, tileMatrix) || 
            this.distanceChange <= 0 || Math.random() < this.PROB_CHANGE) {
            this.enemyDirection = this.getRandomFreeDirection(this.enemyDirection, tileMatrix);
            this.goEnemy(this.enemyDirection, tileMatrix);
            this.distanceChange = this.game.rnd.integerInRange(this.MIN_DISTANCE, this.MAX_DISTANCE);
        } else {
            this.goEnemy(this.enemyDirection, tileMatrix);
        }
    }
}