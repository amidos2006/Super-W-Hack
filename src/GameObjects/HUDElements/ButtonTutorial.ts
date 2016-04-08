class ButtonTutorial extends BaseUIObject{
    xText:Phaser.Text;
    zText:Phaser.Text;
    
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        var style = { font: "15px pixelFont", fill: "#ffffff", align: "right" };
        
        this.xText = this.game.add.text(this.game.width - x, y, "Aim (X)", style, this);
        this.xText.anchor.set(1, 1);
        this.add(this.xText);
        
        style = { font: "15px pixelFont", fill: "#ffffff", align: "left" };
        
        this.zText = this.game.add.text(x, y, "(Z) Item (" + Global.getCurrentCost() + ")", style, this);
        this.zText.anchor.set(0, 1);
        this.add(this.zText);
    }
    
    aimMode(){
        this.xText.text = "Shoot (X)";
        this.xText.anchor.set(1, 1);
        
        this.zText.text = "(Z) Cancel";
        this.zText.anchor.set(0, 1);
    }
    
    normalMode(){
        this.xText.text = "Aim (X)";
        this.xText.anchor.set(1, 1);
        
        this.zText.text = "(Z) Item (" + Global.getCurrentCost() + ")";
        this.zText.anchor.set(0, 1);
    }
}