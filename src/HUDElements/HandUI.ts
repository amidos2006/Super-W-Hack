/// <reference path="../BaseUIObject.ts"/>

enum HandObjects{
    Empty,
    Weapon,
    Person
}

class HandUI extends BaseUIObject{
    outline:Phaser.Graphics;
    text:Phaser.Text;
    emptyText:Phaser.Text;
    patternGraphics:Phaser.Graphics;
    patternText:Phaser.Text;
    
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        this.outline = this.game.add.graphics(x - Global.MAP_SIZE / 2, y - Global.MAP_SIZE / 2, this);
        this.outline.lineStyle(2, 0xffffff, 1);
        this.outline.drawRect(0, 0, 6 * Global.MAP_SIZE, 4.5 * Global.MAP_SIZE);
        this.add(this.outline);
        
        var style = { font: "14px pixelFont", fill: "#ffffff", align: "center" };
        this.text = this.game.add.text(x + 
            5 * Global.MAP_SIZE / 2, y - Global.MAP_SIZE / 2 + 2, "item", style, this);
        this.text.anchor.set(0.5, 1);
        this.add(this.text);
        
        var centerPoint:Phaser.Point = new Phaser.Point(x + 2.5 * Global.MAP_SIZE, y + 2 * Global.MAP_SIZE);
        style = { font: "10px pixelFont", fill: "#ffffff", align: "center" };
        this.emptyText = this.game.add.text(centerPoint.x, centerPoint.y, "-empty-", style, this);
        this.emptyText.anchor.set(0.5, 0.5);
        this.add(this.emptyText);
        
        this.patternGraphics = this.game.add.graphics(x, y, this);
        this.add(this.patternGraphics);
        
        style = { font: "10px pixelFont", fill: "#ffffff", align: "center" };
        this.patternText = this.game.add.text(centerPoint.x, centerPoint.y, "-weapon-", style, this);
        this.patternText.anchor.set(0.5, 0.5);
        this.add(this.patternText);
        
        this.showHide(HandObjects.Empty);
    }
    
    updateWeaponPattern(pattern:number[][]){
        // this.patternGraphics.clear();
        // this.patternGraphics.beginFill(0xffffff, 1);
        // for (var y = 0; y < pattern.length; y++) {
        //     for (var x = 0; x < pattern[y].length; x++) {
        //         if(pattern[y][x] > 0){
        //             this.patternGraphics.drawRect(x * Global.WEAPON_PATTERN_SIZE, y * Global.WEAPON_PATTERN_SIZE, 
        //                 Global.WEAPON_PATTERN_SIZE - 2, Global.WEAPON_PATTERN_SIZE - 2);
        //         }
        //     }
        // }
        // this.patternGraphics.endFill();
    }
    
    showHide(hand:HandObjects){
        this.emptyText.alpha = 0;
        this.patternText.alpha = 0;
        switch(hand){
            case HandObjects.Empty:
                this.emptyText.alpha = 1;
            break;
            case HandObjects.Weapon:
                this.emptyText.alpha = 1;
                //this.patternText.alpha = 1;
            break;
            case HandObjects.Person:
            break;
        }
    }
}