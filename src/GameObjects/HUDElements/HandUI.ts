enum HandObjects{
    Empty,
    Weapon,
    Person
}

class HandUI extends BaseUIObject{
    outline:Phaser.Graphics;
    text:Phaser.Text;
    emptyText:Phaser.Text;
    patternText:Phaser.Text;
    damageText:Phaser.Text;
    cooldownText:Phaser.Text;
    
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        this.outline = this.game.add.graphics(x - Global.MAP_SIZE / 2, y - Global.MAP_SIZE / 2, this);
        this.outline.lineStyle(2, 0xffffff, 1);
        this.outline.drawRect(0, 0, 6 * Global.MAP_SIZE, 4.5 * Global.MAP_SIZE);
        this.add(this.outline);
        
        var style = { font: "14px pixelFont", fill: "#ffffff", align: "center" };
        this.text = this.game.add.text(x + 
            5 * Global.MAP_SIZE / 2, y - Global.MAP_SIZE / 2 + 2, "hand", style, this);
        this.text.anchor.set(0.5, 1);
        this.add(this.text);
        
        var centerPoint:Phaser.Point = new Phaser.Point(x + 2.5 * Global.MAP_SIZE, y + 2 * Global.MAP_SIZE);
        style = { font: "10px pixelFont", fill: "#ffffff", align: "center" };
        this.emptyText = this.game.add.text(centerPoint.x, centerPoint.y, "-empty-", style, this);
        this.emptyText.anchor.set(0.5, 0.5);
        this.add(this.emptyText);
        
        style = { font: "10px pixelFont", fill: "#ffffff", align: "left" };
        this.damageText = this.game.add.text(centerPoint.x, centerPoint.y, "", style, this);
        this.damageText.anchor.set(0, 0.5);
        this.add(this.damageText);
        
        style = { font: "10px pixelFont", fill: "#ffffff", align: "right" };
        this.cooldownText = this.game.add.text(centerPoint.x, centerPoint.y + 12, "", style, this);
        this.cooldownText.anchor.set(0, 0.5);
        this.add(this.cooldownText);
        
        this.patternText = this.game.add.text(centerPoint.x, centerPoint.y - 12, "", style, this);
        this.patternText.anchor.set(0, 0.5);
        this.add(this.patternText);
        
        this.showHide(HandObjects.Empty);
    }
    
    updateDamage(damage:number, extraValue:number){
        var added:string = "";
        if(extraValue > 0){
            added = "(+1)"
        }
        this.damageText.text = damage.toString() + " " +  added;
        this.damageText.anchor.set(0, 0.5);
    }
    
    updateCooldown(cooldown:number, extraValue:number){
        var added:string = "";
        if(extraValue > 0){
            added = "(-1)"
        }
        this.cooldownText.text = cooldown.toString() + " " + added;
        this.cooldownText.anchor.set(0, 0.5);
    }
    
    updatePatternValue(patternSize:number){
        this.patternText.text = patternSize.toString();
        this.patternText.anchor.set(0, 0.5);
    }
    
    updateTraits(traits:boolean[]){
        
    }
    
    showHide(hand:HandObjects){
        this.damageText.alpha = 0;
        this.cooldownText.alpha = 0;
        this.patternText.alpha = 0;
        this.emptyText.alpha = 0;
        switch(hand){
            case HandObjects.Empty:
                this.emptyText.alpha = 1;
            break;
            case HandObjects.Weapon:
                this.patternText.alpha = 1;
                this.damageText.alpha = 1;
                this.cooldownText.alpha = 1;
            break;
            case HandObjects.Person:
            break;
        }
    }
}