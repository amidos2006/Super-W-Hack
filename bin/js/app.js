var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(320, 400, Phaser.AUTO, 'content');
    }
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
var Global = (function () {
    function Global() {
    }
    Global.TILE_SIZE = 32;
    Global.ROOM_WIDTH = 11;
    Global.ROOM_HEIGHT = 11;
    return Global;
})();
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseGameObject = (function (_super) {
    __extends(BaseGameObject, _super);
    function BaseGameObject(game, x, y) {
        _super.call(this, game);
        this.x = x;
        this.y = y;
    }
    BaseGameObject.prototype.isAnimating = function () {
        return false;
    };
    return BaseGameObject;
})(Phaser.Group);
var BaseUIObject = (function (_super) {
    __extends(BaseUIObject, _super);
    function BaseUIObject(game, x, y) {
        _super.call(this, game);
        this.x = x;
        this.y = y;
    }
    return BaseUIObject;
})(Phaser.Group);
var BaseGameState = (function (_super) {
    __extends(BaseGameState, _super);
    function BaseGameState() {
        _super.call(this);
    }
    return BaseGameState;
})(Phaser.State);
