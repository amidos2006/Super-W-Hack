var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(Global.TILE_SIZE * 21, Global.TILE_SIZE * 11, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update });
        this.enemyDir = 0;
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.image('cowboy', 'assets/cowboy.png');
        this.game.load.image('enemy', 'assets/enemy.jpg');
    };
    SimpleGame.prototype.create = function () {
        var text = "Could you see something?";
        var style = { font: "65px Arial", fill: "#0000FF", align: "center" };
        this.game.add.text(0, 0, text, style);
        this.player = new PlayerElement(this.game, 0, 0);
        this.enemy = new RandomEnemy(this.game, 144, 144);
        this.cursors = this.game.input.keyboard.createCursorKeys();
    };
    SimpleGame.prototype.update = function () {
        if (this.player.move(this.cursors)) {
            this.enemy.randomMove();
        }
    };
    return SimpleGame;
}());
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
}());
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
}(Phaser.Group));
var BaseUIObject = (function (_super) {
    __extends(BaseUIObject, _super);
    function BaseUIObject(game, x, y) {
        _super.call(this, game);
        this.x = x;
        this.y = y;
    }
    return BaseUIObject;
}(Phaser.Group));
var RandomEnemy = (function (_super) {
    __extends(RandomEnemy, _super);
    function RandomEnemy(game, x, y) {
        _super.call(this, game, x, y);
        this.enemySprite = this.game.add.sprite(0, 0, 'enemy');
    }
    RandomEnemy.prototype.randomMove = function () {
        var dir = this.game.rnd.between(0, 3);
        if (dir % 4 == 0) {
            this.enemySprite.x += Global.TILE_SIZE;
        }
        if (dir % 4 == 1) {
            this.enemySprite.x -= Global.TILE_SIZE;
        }
        if (dir % 4 == 2) {
            this.enemySprite.y += Global.TILE_SIZE;
        }
        if (dir % 4 == 3) {
            this.enemySprite.y -= Global.TILE_SIZE;
        }
    };
    return RandomEnemy;
}(BaseGameObject));
var PlayerElement = (function (_super) {
    __extends(PlayerElement, _super);
    function PlayerElement(game, x, y) {
        _super.call(this, game, x, y);
        this.playerSprite = this.game.add.sprite(0, 0, 'cowboy');
    }
    PlayerElement.prototype.move = function (cursors) {
        if (cursors.left.justDown) {
            this.playerSprite.x -= Global.TILE_SIZE;
            return true;
        }
        else if (cursors.right.justDown) {
            this.playerSprite.x += Global.TILE_SIZE;
            return true;
        }
        else if (cursors.down.justDown) {
            this.playerSprite.y += Global.TILE_SIZE;
            return true;
        }
        else if (cursors.up.justDown) {
            this.playerSprite.y -= Global.TILE_SIZE;
            return true;
        }
        return false;
    };
    return PlayerElement;
}(BaseGameObject));
var BaseGameState = (function (_super) {
    __extends(BaseGameState, _super);
    function BaseGameState() {
        _super.call(this);
    }
    return BaseGameState;
}(Phaser.State));
