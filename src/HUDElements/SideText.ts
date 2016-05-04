/// <reference path="../BaseUIObject.ts"/>

class SideText extends BaseUIObject {
    sideText: Phaser.Text;

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game);

        var style = { font: "14px pixelFont", fill: "#ffffff", align: "center" };

        var temp: Phaser.Text = this.game.add.text(x, y, "crate", style, this);
        temp.anchor.set(0.5, 1);
        this.add(temp);

        style = { font: "60px pixelFont", fill: "#ffffff", align: "center" };
        this.sideText = this.game.add.text(x + 2, y - 10, "0", style, this);
        this.sideText.anchor.set(0.5, 0);
        this.add(this.sideText);
    }

    update() {
        super.update();

        this.sideText.text = Global.crateNumber.toString();
    }
}