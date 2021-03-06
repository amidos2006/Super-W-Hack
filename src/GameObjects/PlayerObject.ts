/// <reference path="../BaseGameObject.ts"/>

class PlayerObject extends BaseGameObject{
    playerSprite:Phaser.Sprite;
    specialTimerOutline:Phaser.Graphics;
    specialTimerInner:Phaser.Graphics;
    playerWeapon:Weapon;
    coolDownText:Phaser.Text;
    playerHealth:number;
    isAlive:boolean;
    specialTimer:Phaser.Timer;
    
    constructor(game:Phaser.Game, x:number, y:number, weapon:Weapon){
        super(game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
        
        this.playerSprite = this.game.add.sprite(0, 0, 'graphics');
        this.playerSprite.animations.add("normal", [Global.currentPlayer.graphicsIndex]);
        this.add(this.playerSprite);
        
        this.specialTimerInner = this.game.add.graphics(5, 0, this);
        this.specialTimerInner.beginFill(0xffffff, 1);
        this.specialTimerInner.drawRect(0, Global.TILE_SIZE - 2, Global.TILE_SIZE - 10, 2);
        this.specialTimerInner.endFill();
        this.specialTimerInner.alpha = 0;
        this.add(this.specialTimerInner);
        
        this.specialTimerOutline = this.game.add.graphics(5, 0, this);
        this.specialTimerOutline.lineStyle(1, 0xffffff, 1);
        this.specialTimerOutline.drawRect(0, Global.TILE_SIZE - 2, Global.TILE_SIZE - 10, 2);
        this.specialTimerOutline.alpha = 0;
        this.add(this.specialTimerOutline);
        
        this.playerWeapon = weapon;
        this.playerSprite.animations.play("normal");
        this.playerHealth = 1;
        this.isAlive = true;
        
        var cd:number = 0;
        if(this.getWeapon() != null){
            cd = this.getWeapon().getCurrentCoolDown();
        }
        
        var style = { font: "10px pixelFont", fill: "#86b7c0", align: "left" };
        this.coolDownText = this.game.add.text(Global.TILE_SIZE - 3, Global.TILE_SIZE - 10, 
            cd.toString(), style, this);
        this.coolDownText.anchor.set(0, 0);
        this.add(this.coolDownText);
        
        if(cd > 0){
            this.coolDownText.alpha = 1;
        }
        else{
            this.coolDownText.alpha = 0;
        }
        
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
        
        if(canMove){
            Global.audioManager.playWalk();
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
    
    fireWeapon(){
        Global.audioManager.playAttack(this.getWeapon().getSoundParams());
        
        this.getWeapon().fireWeapon();
    }
    
    takeDamage(){
        this.playerHealth = this.playerHealth - 1;
        if(this.playerHealth <= 0){
            Global.audioManager.playTakeDamage(this.game.rnd);
            this.killObject();
        }    
    }
    
    updateCoolDown(){
        if(this.getWeapon() != null){
            this.getWeapon().updateCoolDown();
        }
    }
    
    isPlayerAlive()
    {
        return this.isAlive;
    }
    
    killObject(){
        this.game.add.existing(new DeathEffect(this.game, this.getTilePosition().x, 
            this.getTilePosition().y, Global.currentPlayer.graphicsIndex, 0xffffff));
        super.killObject();
    }
    
    update(){
        super.update();
        
        this.coolDownText.alpha = 0;
        var cd:number = 0;
        if(this.getWeapon() != null){
            cd = this.getWeapon().getCurrentCoolDown();
        }
        if(cd > 0){
            this.coolDownText.alpha = 1;
            this.coolDownText.text = cd.toString();
            this.coolDownText.anchor.set(0, 0);
        }
        if(this.specialTimer != null){
            this.specialTimerInner.alpha = 1;
            this.specialTimerOutline.alpha = 1;
            this.specialTimerInner.scale.set(this.specialTimer.ms / 1000, 1);
        }
        else{
            this.specialTimerInner.alpha = 0;
            this.specialTimerOutline.alpha = 0;
        }
    }
}