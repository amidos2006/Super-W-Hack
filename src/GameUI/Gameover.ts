class Gameover extends BaseUIObject{
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        var graphics:Phaser.Graphics = this.game.add.graphics(x, y, this);
        graphics.beginFill(0x000000, 1);
        graphics.drawRect(-this.game.width/2, -40, this.game.width, 80);
        graphics.endFill();
        this.add(graphics);
        
        var style = { font: "40px pixelFont", fill: "#ffffff", align: "center" };
        var text:Phaser.Text = this.game.add.text(x, y, "gameover", style, this);
        text.anchor.set(0.5, 0.5);
        this.add(text);
        
        style = { font: "20px pixelFont", fill: "#ffffff", align: "center" };
        text = this.game.add.text(x, y + 30, "(r) restart", style, this);
        text.anchor.set(0.5, 0.5);
        this.add(text);
        
        this.alpha = 0;
        var timer:Phaser.Timer = this.game.time.create(true);
        timer.add(200, this.appear, this);
        timer.start();
    }
    
    appear(){
        var tween:Phaser.Tween = this.game.add.tween(this);
        tween.to({alpha:1}, 1300);
        tween.start();
    }
}