class AdventureName extends BaseUIObject{
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        var style = { font: "20px pixelFont", fill: "#ffffff", align: "center" };
        
        var text:Phaser.Text = this.game.add.text(game.width/2, game.height/2, name.toString(), style, this);
        text.anchor.set(0.5, 0.5);
        text.wordWrap = true;
        text.wordWrapWidth = game.width - 4 * Global.TILE_SIZE;
        this.add(text);
    }
}