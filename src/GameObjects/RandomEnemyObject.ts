class RandomEnemyObject extends BaseGameObject{
    
    enemySprite:Phaser.Sprite;
    enemyHealth:number;
    enemySpeed:number;
    isAlive:boolean;
    
    constructor(game:Phaser.Game, x:number, y:number, speed:number){
        super(game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
        
        this.enemySprite = this.game.add.sprite(0, 0, 'graphics');
        this.enemySprite.animations.add("normal", [6]);
        this.enemySprite.animations.play("normal");
        this.enemySprite.tint = 0xcc6668;
        this.enemyHealth = 3;
        this.enemySpeed = speed;
        this.isAlive = true;
        this.add(this.enemySprite);
    }
    
    updateEnemy(enemyDirection:Phaser.Point, tileMap:TileTypeEnum[][])
    {
        let canMove:boolean = false;
        
        if (enemyDirection.x > 0)
        {
            if(tileMap[this.getTilePosition().x + 1][this.getTilePosition().y] == TileTypeEnum.Passable)
            {
                this.x += Global.TILE_SIZE * this.enemySpeed;
                canMove = true;
            }
            else
            {
                canMove = false;
            }        
        }
        
        if(enemyDirection.x < 0)
        {
            if(tileMap[this.getTilePosition().x - 1][this.getTilePosition().y] == TileTypeEnum.Passable)
            {
                this.x -= Global.TILE_SIZE * this.enemySpeed;
                canMove = true;
            }
            else
            {
                canMove = false;
            }   
        }
        
        if(enemyDirection.y > 0)
        {
            if(tileMap[this.getTilePosition().x][this.getTilePosition().y + 1] == TileTypeEnum.Passable)
            {
                this.y += Global.TILE_SIZE * this.enemySpeed;
                canMove = true;
            }
            else
            {
                canMove = false;
            }
        }
        
        if(enemyDirection.y < 0)
        {
            if(tileMap[this.getTilePosition().x][this.getTilePosition().y - 1] == TileTypeEnum.Passable)
            {
                this.y -= Global.TILE_SIZE * this.enemySpeed;
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
        if(this.enemyHealth > 0)
        {
            this.enemyHealth = this.enemyHealth - damage;
        }
        else
        {
            this.isAlive = false;
        }    
    }
    
    isEnemyAlive()
    {
        return this.isAlive;
    }
}