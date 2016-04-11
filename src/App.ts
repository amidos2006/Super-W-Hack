class SimpleGame {
    game: Phaser.Game;
    
    constructor() {
        this.game = new Phaser.Game(372, 480, Phaser.AUTO, 'content', null, false, false);
        this.game.state.add("loading", LoadingState, false)
        this.game.state.add("gameplay", GameplayState, false);
        this.game.state.add("playerselect", PlayerSelectState, false);
        this.game.state.add("mainmenu", MainMenuState, false);
        
        this.game.state.start("loading", false, false);
    }
}

window.onload = () => {
    var game:SimpleGame = new SimpleGame();
};