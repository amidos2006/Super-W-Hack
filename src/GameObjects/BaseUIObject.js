var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseUIObject = (function (_super) {
    __extends(BaseUIObject, _super);
    function BaseUIObject(game, x, y) {
        _super.call(this, game);
        this.x = x;
        this.y = y;
    }
    return BaseUIObject;
})(Phaser.Group);
