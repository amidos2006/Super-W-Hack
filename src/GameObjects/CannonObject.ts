class CannonObject extends BaseGameObject
{
    cannonDirection:Phaser.Point;
    constructor(game:Phaser.Game, x:number, y:number, speed:number, cannonDirection:Phaser.Point)
    {
         super(game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
         this.cannonDirection = cannonDirection;
    }
      
    shoot(player:PlayerObject)
    {
        var shot = false;
        
        if(this.getTilePosition().y == player.getTilePosition().y
            && this.getTilePosition().x > player.getTilePosition().x
            && this.cannonDirection.equals(new Phaser.Point(-1,0)))
        {
            shot = true;
        }
        
        else if(this.getTilePosition().y == player.getTilePosition().y
            && this.getTilePosition().x < player.getTilePosition().x
            && this.cannonDirection.equals(new Phaser.Point(1,0)))
        {
            shot = true;
        }
        
        else if(this.getTilePosition().x == player.getTilePosition().x
            && this.getTilePosition().y < player.getTilePosition().y
            && this.cannonDirection.equals(new Phaser.Point(0,1)))
        {
            shot = true;
        }
        
        else if(this.getTilePosition().x == player.getTilePosition().x
            && this.getTilePosition().y > player.getTilePosition().y
            && this.cannonDirection.equals(new Phaser.Point(0,-1)))
        {
            shot = true;
        }
        return shot;
    }
    
    getCannonDirection()
    {
        return this.cannonDirection;
    }
}