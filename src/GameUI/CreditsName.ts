/// <reference path="../BaseUIObject.ts"/>

class CreditsName extends BaseUIObject{
    textHeight:number;
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        var credits:string[] = this.game.cache.getText("credits").split("\n");
        this.textHeight = 0;

        this.add(new CreditLine(this.game, x, y+this.textHeight, "game by", 10));
        this.textHeight += 10;
        
        var names:string[] = credits[0].split(",");
        for (var i = 0; i < names.length; i++) {
            this.add(new CreditLine(this.game, x, y+this.textHeight, names[i].toString(), 20));
            this.textHeight += 18;
        }
        this.textHeight += 18;
        
        this.add(new CreditLine(this.game, x, y+this.textHeight, "made for", 10));
        this.textHeight += 10;
        
        this.add(new CreditLine(this.game, x, y+this.textHeight, credits[1].trim(), 20));
        this.textHeight += 2 * 18;
        
        this.add(new CreditLine(this.game, x, y+this.textHeight, "inspired by", 10));
        this.textHeight += 10;
        
        var names:string[] = credits[2].split(",");
        for (var i = 0; i < names.length; i++) {
            this.add(new CreditLine(this.game, x, y+this.textHeight, names[i].toString(), 20));
            this.textHeight += 18;
        }
        this.textHeight += 18;
        
        this.add(new CreditLine(this.game, x, y+this.textHeight, "thanks to", 10));
        this.textHeight += 10;
        
        var names:string[] = credits[3].split(",");
        for (var i = 0; i < names.length; i++) {
            this.add(new CreditLine(this.game, x, y+this.textHeight, names[i].toString(), 20));
            this.textHeight += 18;
        }
    }
}