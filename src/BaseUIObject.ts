class BaseUIObject extends Phaser.Group{
    constructor(game:Phaser.Game){
        super(game);
        
        this.fixedToCamera = true;
    }
}