var SimpleGame = (function () {
    function SimpleGame() {
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game = new Phaser.Game(800, 400, Phaser.AUTO, 'content', { create: this.create, update: this.update });
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.image('cowboy', 'assets/cowboy.png');
    };
    SimpleGame.prototype.create = function () {
        var text = "Hello World!";
        var style = { font: "65px Arial", fill: "#0000FF", align: "center" };
        this.game.add.text(0, 0, text, style);
        //this.game.add.sprite(100,50,'cowboy');
        this.player = this.game.add.sprite(100, 50, 'cowboy');
    };
    SimpleGame.prototype.update = function () {
        if (this.cursors.left.isDown) {
            //  Move to the left
            this.player.x += 10;
        }
    };
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
