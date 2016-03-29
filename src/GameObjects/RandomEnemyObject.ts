class RandomEnemyObject extends BaseGameObject{
    
    enemySprite:Phaser.Sprite;
    
    constructor(game:Phaser.Game, x:number, y:number){
        super(game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
        
        this.enemySprite = this.game.add.sprite(0, 0, 'graphics');
        this.enemySprite.animations.add("normal", [6]);
        this.enemySprite.animations.play("normal");
        this.enemySprite.tint = 0xcc6668;
        this.add(this.enemySprite);
    }
    
    updateEnemy(playerPosition:Phaser.Point, tileMap:TileTypeEnum[][])
    {
        var dir = this.game.rnd.between(0,3);
        if(dir % 4 == 0)
        {
            this.enemySprite.x += Global.TILE_SIZE;
        }
        if(dir % 4 == 1)
        {
            this.enemySprite.x -= Global.TILE_SIZE;
        }
        if(dir % 4 == 2)
        {
            this.enemySprite.y += Global.TILE_SIZE;
        }
        if(dir % 4 == 3)
        {
            this.enemySprite.y -= Global.TILE_SIZE;
        }
    }
    
    killEnemy(){
        
    }
}