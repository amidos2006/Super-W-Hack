class PlayerObject extends BaseGameObject{
    playerSprite:Phaser.Sprite;
    playerWeapon:Weapon;
    playerHealth:number;
    isAlive:boolean;
    
    constructor(game:Phaser.Game, x:number, y:number, weapon:Weapon){
        super(game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
        
        this.playerSprite = this.game.add.sprite(0, 0, 'graphics');
        this.playerSprite.animations.add("normal", [3]);
        this.add(this.playerSprite);
        
        this.playerWeapon = weapon;
        this.playerSprite.animations.play("normal");
        this.playerHealth = 1;
        this.isAlive = true;
    } 
    
    move(cursors:Phaser.Point, mapMatrix:TileTypeEnum[][])
    {
        let canMove:boolean = false; 
        if (cursors.x > 0)
        {
            if(mapMatrix[this.getTilePosition().x + 1][this.getTilePosition().y] == TileTypeEnum.Passable
            || mapMatrix[this.getTilePosition().x + 1][this.getTilePosition().y] == TileTypeEnum.Enemy)
            {
                this.x += Global.TILE_SIZE;
                canMove = true;
            }
            else
            {
                canMove = false;
            }        
        }
        
        if(cursors.x < 0)
        {
            if(mapMatrix[this.getTilePosition().x - 1][this.getTilePosition().y] == TileTypeEnum.Passable
            || mapMatrix[this.getTilePosition().x - 1][this.getTilePosition().y] == TileTypeEnum.Enemy)
            {
                this.x -= Global.TILE_SIZE;
                canMove = true;
            }
            else
            {
                canMove = false;
            }   
        }
        
        if(cursors.y > 0)
        {
            if(mapMatrix[this.getTilePosition().x][this.getTilePosition().y + 1] == TileTypeEnum.Passable
            || mapMatrix[this.getTilePosition().x][this.getTilePosition().y + 1] == TileTypeEnum.Enemy)
            {
                this.y += Global.TILE_SIZE;
                canMove = true;
            }
            else
            {
                canMove = false;
            }
        }
        
        if(cursors.y < 0)
        {
            if(mapMatrix[this.getTilePosition().x][this.getTilePosition().y - 1] == TileTypeEnum.Passable
            || mapMatrix[this.getTilePosition().x][this.getTilePosition().y - 1] == TileTypeEnum.Enemy)
            {
                this.y -= Global.TILE_SIZE;
                canMove = true;
            }
            else
            {
                canMove = false;
            }
        }
        return canMove;
    }
    
    setWeapon(newWeapon:Weapon)
    {
        this.playerWeapon = newWeapon;
    }
    
    getWeapon()
    {
        return this.playerWeapon;
    }
    
    takeDamage(damage:number)
    {
        if(this.playerHealth > 0)
        {
            this.playerHealth = this.playerHealth - damage;
        }
        else
        {
            this.isAlive = false;
        }    
    }
    
    isPlayerAlive()
    {
        return this.isAlive;
    }
    
    killPlayer(){
        this.destroy(true);
    }
    
}