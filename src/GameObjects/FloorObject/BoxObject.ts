/// <reference path="../../BaseGameObject.ts"/>

class BoxObject extends BaseGameObject{
    sprite:Phaser.Sprite;
    
    constructor(game:Phaser.Game){
        super(game, 0, 0);
        
        this.sprite = this.game.add.sprite(0, 0, "graphics");
        this.sprite.animations.add("normal", [4]);
        this.sprite.animations.play("normal");
        this.sprite.tint = 0xffcc66;
        this.sprite.alpha = 0;
        this.add(this.sprite);
    }
    
    show(tilePosition:Phaser.Point){
        this.sprite.alpha = 1;
        this.x = tilePosition.x * Global.TILE_SIZE;
        this.y = tilePosition.y * Global.TILE_SIZE;
    }
    
    collectCrate(nextPosition:Phaser.Point = null){
        this.game.add.existing(new WeaponName(this.game, this.getTilePosition().x, 
            this.getTilePosition().y, Global.currentWeapon.getWeaponName()));
        Global.audioManager.playPickUpCrate();
        
        if(nextPosition != null){
            this.show(nextPosition);
        }
        else{
            this.killObject();
        }
    }
    
    killObject(){
        this.game.add.existing(new DeathEffect(this.game, this.getTilePosition().x, 
            this.getTilePosition().y, 4, 0xffcc66));
        super.killObject();
    }
}