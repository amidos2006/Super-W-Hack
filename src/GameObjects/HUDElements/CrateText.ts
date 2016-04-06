class CrateText extends BaseUIObject{
    crateText:Phaser.Text;
    
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        var style = { font: "15px pixelFont", fill: "#ffffff", align: "center" };
        var text:Phaser.Text = this.game.add.text(x, y, "crate", style, this);
        text.anchor.set(0.5, 0);
        this.add(text);
        
        style = { font: "60px pixelFont", fill: "#ffffff", align: "center" };
        this.crateText = this.game.add.text(x, y + 8, "0", style, this);
        this.crateText.anchor.set(0.5, 0);
        this.add(this.crateText);
    }
    
    update(){
        super.update();
        
        this.crateText.text = Global.crateNumber.toString();
        this.crateText.anchor.set(0.5, 0);
    }
}