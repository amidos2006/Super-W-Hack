class LevelName extends BaseUIObject{
    text:Phaser.Text;
    nameText:Phaser.Text;
    
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        var style = { font: "12px pixelFont", fill: "#ffffff", align: "center" };
        this.text = new Phaser.Text(this.game, x, y, "Level " + (Global.levelNumber + 1).toString(), style);
        this.text.anchor.set(0.5, 0);
        this.add(this.text);
        
        var style = { font: "16px pixelFont", fill: "#ffffff", align: "center" };
        this.nameText = new Phaser.Text(this.game, x, y + 12, Global.levelName, style);
        this.nameText.anchor.set(0.5, 0);
        this.add(this.nameText);
    }
}