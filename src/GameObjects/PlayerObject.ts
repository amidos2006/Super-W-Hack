class PlayerObject extends BaseGameObject{
    playerSprite:Phaser.Sprite;
    constructor(game:Phaser.Game, x:number, y:number){
        super(game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
        
        this.playerSprite = this.game.add.sprite(0, 0, 'graphics');
        this.playerSprite.animations.add("normal", [3]);
        this.playerSprite.animations.play("normal");
        this.add(this.playerSprite);
    } 
    
    move(cursors:Phaser.Point, mapMatrix:TileTypeEnum[][])
    {
        let canMove:boolean = false; 
        if (cursors.x > 0)
        {
            if(mapMatrix[this.getTilePosition().x + Global.TILE_SIZE][this.getTilePosition().y] == TileTypeEnum.Passable)
            {
                canMove = true;
            }
            else
            {
                canMove = false;
            }        
        }
        
        if(cursors.x < 0)
        {
            if(mapMatrix[this.getTilePosition().x - Global.TILE_SIZE][this.getTilePosition().y] == TileTypeEnum.Passable)
            {
                canMove = true;
            }
            else
            {
                canMove = false;
            }   
        }
        
        if(cursors.y > 0)
        {
            if(mapMatrix[this.getTilePosition().x][this.getTilePosition().y + Global.TILE_SIZE] == TileTypeEnum.Passable)
            {
                canMove = true;
            }
            else
            {
                canMove = false;
            }
        }
        
        if(cursors.y < 0)
        {
            if(mapMatrix[this.getTilePosition().x][this.getTilePosition().y - Global.TILE_SIZE] == TileTypeEnum.Passable)
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
    
    setWeapon(newWeapon:Weapon)
    {
        
    }
    
    getWeapon(){
        
    }
}