class PlayerObject extends BaseGameObject{
    playerSprite:Phaser.Sprite;
    playerWeapon:Weapon;
    coolDownText:Phaser.Text;
    playerHealth:number;
    isAlive:boolean;
    
    constructor(game:Phaser.Game, x:number, y:number, weapon:Weapon){
        super(game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
        
        this.playerSprite = this.game.add.sprite(0, 0, 'graphics');
        this.playerSprite.animations.add("normal", [Global.currentPlayer.graphicsIndex]);
        this.add(this.playerSprite);
        
        this.playerWeapon = weapon;
        this.playerSprite.animations.play("normal");
        this.playerHealth = 1;
        this.isAlive = true;
        
        var style = { font: "10px pixelFont", fill: "#86b7c0", align: "left" };
        this.coolDownText = this.game.add.text(Global.TILE_SIZE - 3, Global.TILE_SIZE - 10, 
            this.getWeapon().getCurrentCoolDown().toString(), style, this);
        this.coolDownText.anchor.set(0, 0);
        this.add(this.coolDownText);
        
        if(this.getWeapon().getCurrentCoolDown() > 0){
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
    
    updateCoolDown(){
        this.getWeapon().updateCoolDown();
    }
    
    isPlayerAlive()
    {
        return this.isAlive;
    }
    
    update(){
        super.update();
        
        this.coolDownText.alpha = 0;
        if(this.getWeapon().getCurrentCoolDown() > 0){
            this.coolDownText.alpha = 1;
            this.coolDownText.text = this.getWeapon().getCurrentCoolDown().toString();
            this.coolDownText.anchor.set(0, 0);
        }
    }
}