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
    patternSprite:Phaser.Sprite;
    patternText:Phaser.Text;
    damageSprite:Phaser.Sprite;
    damageText:Phaser.Text;
    cooldownSprite:Phaser.Sprite;
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
        
        style = { font: "10px pixelFont", fill: "#ffffff", align: "right" };
        this.damageText = this.game.add.text(centerPoint.x + 12, centerPoint.y, "", style, this);
        this.damageText.anchor.set(1, 0.5);
        this.add(this.damageText);
        
        this.damageSprite = this.game.add.sprite(centerPoint.x + 1, centerPoint.y - 2, "graphics");
        this.damageSprite.animations.add("normal", [14]);
        this.damageSprite.animations.play("normal");
        this.damageSprite.anchor.set(1, 0.5);
        this.add(this.damageSprite);
        
        this.cooldownText = this.game.add.text(centerPoint.x + 12, centerPoint.y + 12, "", style, this);
        this.cooldownText.anchor.set(1, 0.5);
        this.add(this.cooldownText);
        
        this.cooldownSprite = this.game.add.sprite(centerPoint.x + 1, centerPoint.y + 10, "graphics");
        this.cooldownSprite.animations.add("normal", [15]);
        this.cooldownSprite.animations.play("normal");
        this.cooldownSprite.anchor.set(1, 0.5);
        this.add(this.cooldownSprite);
        
        this.patternText = this.game.add.text(centerPoint.x + 12, centerPoint.y - 12, "", style, this);
        this.patternText.anchor.set(1, 0.5);
        this.add(this.patternText);
        
        this.patternSprite = this.game.add.sprite(centerPoint.x + 1, centerPoint.y - 14, "graphics");
        this.patternSprite.animations.add("normal", [13]);
        this.patternSprite.animations.play("normal");
        this.patternSprite.anchor.set(1, 0.5);
        this.add(this.patternSprite);
        
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
        this.damageSprite.alpha = 0;
        this.cooldownSprite.alpha = 0;
        this.patternSprite.alpha = 0;
        switch(hand){
            case HandObjects.Empty:
                this.emptyText.alpha = 1;
            break;
            case HandObjects.Weapon:
                this.patternText.alpha = 1;
                this.damageText.alpha = 1;
                this.cooldownText.alpha = 1;
                this.damageSprite.alpha = 1;
                this.cooldownSprite.alpha = 1;
                this.patternSprite.alpha = 1;
            break;
            case HandObjects.Person:
            break;
        }
    }
}