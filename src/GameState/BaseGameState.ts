class BaseGameState extends Phaser.State{
    constructor(){
        super();
    }
    
    create(){
        this.game.world.setBounds(-20, -50, this.game.width + 20, this.game.height + 50);
        this.game.camera.x = -10;
        this.game.camera.y = -40;
    }
}