class RandomEnemyObject extends BaseGameObject{
    
    enemySprite:Phaser.Sprite;
    enemyHealth:number;
    
    constructor(game:Phaser.Game, x:number, y:number){
        super(game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
        
        this.enemySprite = this.game.add.sprite(0, 0, 'graphics');
        this.enemySprite.animations.add("normal", [6]);
        this.enemySprite.animations.play("normal");
        this.enemySprite.tint = 0xcc6668;
        this.enemyHealth = 3;
        this.add(this.enemySprite);
    }
    
    updateEnemy(enemyDirection:Phaser.Point, tileMap:TileTypeEnum[][])
    {
        let canMove:boolean = false;
        
        if (enemyDirection.x > 0)
        {
            if(tileMap[this.getTilePosition().x + Global.TILE_SIZE][this.getTilePosition().y] == TileTypeEnum.Passable)
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
            if(tileMap[this.getTilePosition().x - Global.TILE_SIZE][this.getTilePosition().y] == TileTypeEnum.Passable)
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
            if(tileMap[this.getTilePosition().x][this.getTilePosition().y + Global.TILE_SIZE] == TileTypeEnum.Passable)
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
            if(tileMap[this.getTilePosition().x][this.getTilePosition().y - Global.TILE_SIZE] == TileTypeEnum.Passable)
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
    
    takeDamage(damage:number)
    {
        this.enemyHealth = this.enemyHealth - damage;    
    }
}