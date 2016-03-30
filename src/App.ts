class SimpleGame {
    game: Phaser.Game;
    
    constructor() {
        this.game = new Phaser.Game(352, 430, Phaser.AUTO, 'content');
        this.game.state.add("gameplay", GameplayState, false);
        
        this.game.state.start("gameplay", false, false);
        Global.initialize();
        Global.constructLevel(new Phaser.RandomDataGenerator([Date.now()]));
    }
}

window.onload = () => {
    var game:SimpleGame = new SimpleGame();
};