class ButtonTutorial extends BaseUIObject{
    xText:Phaser.Text;
    zText:Phaser.Text;
    
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        var style = { font: "15px pixelFont", fill: "#ffffff", align: "left" };
        
        this.xText = this.game.add.text(x, y, "(X) Aim", style, this);
        this.xText.anchor.set(0, 1);
        this.add(this.xText);
        
        style = { font: "15px pixelFont", fill: "#ffffff", align: "right" };
        
        this.zText = this.game.add.text(this.game.width - x, y, "", style, this);
        this.zText.anchor.set(1, 1);
        this.add(this.zText);
    }
    
    aimMode(){
        this.xText.text = "(X) Shoot";
        this.xText.anchor.set(0, 1);
        
        this.zText.text = "Cancel (Z)";
        this.zText.anchor.set(1, 1);
    }
    
    normalMode(){
        this.xText.text = "(X) Aim";
        this.xText.anchor.set(0, 1);
        
        this.zText.text = "";
        this.zText.anchor.set(1, 1);
    }
}