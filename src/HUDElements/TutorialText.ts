class TutorialText extends BaseGameObject{
    tween:Phaser.Tween;
    constructor(game:Phaser.Game, xTile:number, yTile:number, text:string){
        super(game, (xTile + 0.5) * Global.TILE_SIZE, (yTile + 0.5) * Global.TILE_SIZE);
        
        var style = { font: "20px pixelFont", fill: "#ffffff", align: "center" };
        var tempText:Phaser.Text = this.game.add.text(0, 3, text, style);
        tempText.anchor.set(0.5, 0.5);
        this.add(tempText);
    }
    
    disappear(){
        if(this.tween == null){
            this.tween = this.game.tweens.create(this);
            this.tween.to({alpha: 0}, 250);
            this.tween.onComplete.add(this.killObject, this);
            this.tween.start();
        }
    }
}