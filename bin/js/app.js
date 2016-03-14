var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(320, 400, Phaser.AUTO, 'content');
    }
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
