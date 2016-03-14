class SimpleGame {
    game: Phaser.Game;
    
    constructor() {
        this.game = new Phaser.Game(320, 400, Phaser.AUTO, 'content');
    }
}

window.onload = () => {
    var game:SimpleGame = new SimpleGame();
};