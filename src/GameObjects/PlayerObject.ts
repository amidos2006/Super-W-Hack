class PlayerObject extends BaseGameObject{
    playerSprite:Phaser.Sprite;
    constructor(game:Phaser.Game, x:number, y:number){
        super(game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
        
        this.playerSprite = this.game.add.sprite(0, 0, 'graphics');
        this.playerSprite.animations.add("normal", [3]);
        this.playerSprite.animations.play("normal");
        this.add(this.playerSprite);
    } 
    
    move(cursors:Phaser.CursorKeys)
    {
        if (cursors.left.justDown)
        {
            this.playerSprite.x -= Global.TILE_SIZE;
            return true;
        }
        
        else if (cursors.right.justDown)
        {
            this.playerSprite.x += Global.TILE_SIZE; 
            return true;
        }
        
        else if (cursors.down.justDown)
        {
            this.playerSprite.y += Global.TILE_SIZE;
            return true;
        }
        else if (cursors.up.justDown)
        {
            this.playerSprite.y -= Global.TILE_SIZE; 
            return true;
        }
        return false;
    }
    
}