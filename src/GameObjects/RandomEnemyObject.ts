class RandomEnemyObject extends BaseGameObject{
    
    enemySprite:Phaser.Sprite;
    
    constructor(game:Phaser.Game, x:number, y:number)
    {
        super(game, x, y);
        this.enemySprite = this.game.add.sprite(144, 144, 'enemy');
    }
    
    randomMove()
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
    
}