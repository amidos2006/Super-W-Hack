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
    
    updateEnemy(enemyDirection:Phaser.Point, tileMap:TileTypeEnum[][])
    {
        let canMove:boolean = false;
        
        if (enemyDirection.x > 0)
        {
            if(tileMap[this.x + Global.TILE_SIZE][this.y] == TileTypeEnum.Passable)
            {
                canMove = true;
            }
            else
            {
                canMove = false;
            }        
        }
        
        if(enemyDirection.x < 0)
        {
            if(tileMap[this.x - Global.TILE_SIZE][this.y] == TileTypeEnum.Passable)
            {
                canMove = true;
            }
            else
            {
                canMove = false;
            }   
        }
        
        if(enemyDirection.y > 0)
        {
            if(tileMap[this.x][this.y + Global.TILE_SIZE] == TileTypeEnum.Passable)
            {
                canMove = true;
            }
            else
            {
                canMove = false;
            }
        }
        
        if(enemyDirection.y < 0)
        {
            if(tileMap[this.x][this.y - Global.TILE_SIZE] == TileTypeEnum.Passable)
            {
                canMove = true;
            }
            else
            {
                canMove = false;
            }
        }
        return canMove;
    }
    
    takeDamage(damage:number){
        
    }
}