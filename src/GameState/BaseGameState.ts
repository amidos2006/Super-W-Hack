class BaseGameState extends Phaser.State{
    constructor(){
        super();
    }
    
    create(){
        this.game.world.setBounds(-20, -35, this.game.width + 20, this.game.height + 35);
        this.game.camera.x = -10;
        this.game.camera.y = -30;
    }
}