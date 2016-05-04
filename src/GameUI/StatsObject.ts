class StatsObject extends BaseUIObject{
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        var yLoc:number = y;
        
        var style = { font: "30px pixelFont", fill: "#ffffff", align: "center" };
        var mainText:Phaser.Text = this.game.add.text(x, yLoc, "adventure mode", style);
        mainText.anchor.set(0.5, 0.5);
        this.add(mainText);
        yLoc += 20;
        
        style = { font: "20px pixelFont", fill: "#aaaaaa", align: "center" };
        var dataText:Phaser.Text = this.game.add.text(x, yLoc, "wins: " + Global.gameStatus.normalWin, style);
        dataText.anchor.set(0.5, 0.5);
        this.add(dataText);
        yLoc+= 20;
        
        dataText = this.game.add.text(x, yLoc, "death: " + Global.gameStatus.normalDeath, style);
        dataText.anchor.set(0.5, 0.5);
        this.add(dataText);
        yLoc+= 20;
        
        dataText = this.game.add.text(x, yLoc, "max score: " + Global.gameStatus.normalScore, style);
        dataText.anchor.set(0.5, 0.5);
        this.add(dataText);
        yLoc+= 50;
        
        style = { font: "30px pixelFont", fill: "#ffffff", align: "center" };
        mainText = this.game.add.text(x, yLoc, "arcade mode", style);
        mainText.anchor.set(0.5, 0.5);
        this.add(mainText);
        yLoc += 20;
        
        style = { font: "20px pixelFont", fill: "#aaaaaa", align: "center" };
        var dataText:Phaser.Text = this.game.add.text(x, yLoc, "max crates: " + Global.gameStatus.arcadeMaxCrates, style);
        dataText.anchor.set(0.5, 0.5);
        this.add(dataText);
        yLoc+= 20;
        
        var dataText:Phaser.Text = this.game.add.text(x, yLoc, "total crates: " + Global.gameStatus.arcadeTotalCrates, style);
        dataText.anchor.set(0.5, 0.5);
        this.add(dataText);
        yLoc+= 20;
        
        var dataText:Phaser.Text = this.game.add.text(x, yLoc, "total plays: " + Global.gameStatus.arcadePlays, style);
        dataText.anchor.set(0.5, 0.5);
        this.add(dataText);
        yLoc+= 20;
    }
}