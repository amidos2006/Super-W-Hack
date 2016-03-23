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
