/// <reference path="../../BaseGameObject.ts"/>

class PortalObject extends BaseGameObject{
    sprite:Phaser.Sprite;
    
    constructor(game:Phaser.Game){
        super(game, 0, 0);
        
        this.sprite = this.game.add.sprite(0, 0, "graphics");
        this.sprite.animations.add("normal", [16, 33, 17, 34], 10, true);
        this.sprite.animations.play("normal");
        this.sprite.tint = 0x80bfff;
        this.sprite.alpha = 0;
        this.add(this.sprite);
    }
    
    showPortal(x:number, y:number){
        this.sprite.alpha = 1;
        this.x = x * Global.TILE_SIZE;
        this.y = y * Global.TILE_SIZE;
    }
    
    enterPortal(){
        var level:GameplayState = <GameplayState>this.game.state.getCurrentState();
        level.playerObject.alpha = 0;
        level.playerObject = null;
        this.game.add.existing(new PlayerLeaveEffect(this.game, 
            this.getTilePosition().x, this.getTilePosition().y));
    }
}