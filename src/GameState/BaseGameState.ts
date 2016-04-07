class BaseGameState extends Phaser.State{
    constructor(){
        super();
    }
    
    create(){
        this.game.world.setBounds(0, -30, this.game.width, this.game.height);
        this.game.camera.y = -30;
    }
}