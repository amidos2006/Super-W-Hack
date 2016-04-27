class CreditLine extends BaseUIObject{
    creditLine:Phaser.Text;
    ySpeed:number;
    noAppear:number;
    portionSize:number;
    
    constructor(game:Phaser.Game, x:number, y:number, text:string, fontSize:number){
        super(game);
        this.ySpeed = 0.4;
        this.noAppear = 20;
        this.portionSize = 60;
        
        var style = { font: fontSize.toString() + "px pixelFont", fill: "#ffffff", align: "center" };
        this.creditLine = this.game.add.text(x, y, text, style, this);
        this.creditLine.anchor.set(0.5, 0);
        this.add(this.creditLine);
    }
    
    update(){
        super.update();
        
        this.creditLine.y -= this.ySpeed;
        if(this.creditLine.y < this.noAppear + 20 || this.creditLine.y > this.game.height - this.noAppear){
            this.alpha = 0;
        }
        else if(this.creditLine.y < this.portionSize + 20){
            this.alpha = (this.creditLine.y - this.noAppear - 20) / (this.portionSize - this.noAppear);
        }
        else if (this.creditLine.y > this.game.height - this.portionSize){
            this.alpha = (this.game.height - this.creditLine.y - this.noAppear) / (this.portionSize - this.noAppear);
        }
        else{
            this.alpha = 1;
        }
        
        if(this.alpha <= 0 && this.creditLine.y < 0){
            this.destroy(true);
        }
    }
}