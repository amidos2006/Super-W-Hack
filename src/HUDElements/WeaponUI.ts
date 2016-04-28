class WeaponUI extends BaseUIObject{
    text:Phaser.Text;
    weaponName:Phaser.Text[];
    damageText:Phaser.Text;
    cooldownText:Phaser.Text;
    damageSprite:Phaser.Sprite;
    cooldownSprite:Phaser.Sprite;
    
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        var style = { font: "14px pixelFont", fill: "#ffffff", align: "center" };
        this.text = this.game.add.text(x , y, "weapon", style, this);
        this.text.anchor.set(0.5, 1);
        this.add(this.text);
        
        style = { font: "16px pixelFont", fill: "#aaaaaa", align: "center" };
        this.weaponName = [];
        for (var i = 0; i < 5; i++) {
            var tempWeapon = this.game.add.text(x , y - 3 + i * 14, "", style, this);
            tempWeapon.anchor.set(0.5, 0);
            this.add(tempWeapon);
            this.weaponName.push(tempWeapon);
        }
        
        this.damageSprite = this.game.add.sprite(x - 60, y, "graphics");
        this.damageSprite.animations.add("normal", [14]);
        this.damageSprite.animations.play("normal");
        this.damageSprite.anchor.set(0, 0.5);
        this.add(this.damageSprite);
        
        style = { font: "14px pixelFont", fill: "#ffffff", align: "right" };
        this.damageText = this.game.add.text(x - 45, y, "", style, this);
        this.damageText.anchor.set(0, 0.5);
        this.add(this.damageText);
        
        this.cooldownSprite = this.game.add.sprite(x + 45, y, "graphics");
        this.cooldownSprite.animations.add("normal", [15]);
        this.cooldownSprite.animations.play("normal");
        this.cooldownSprite.anchor.set(1, 0.5);
        this.add(this.cooldownSprite);
        
        style = { font: "14px pixelFont", fill: "#ffffff", align: "right" };
        this.cooldownText = this.game.add.text(x + 45, y, "", style, this);
        this.cooldownText.anchor.set(1, 0.5);
        this.add(this.cooldownText);
        
        this.alpha = 0;
    }
    
    updateName(weaponName:string){
        for (var i = 0; i < this.weaponName.length; i++) {
            this.weaponName[i].text = "";
        }
        
        var names:string[] = weaponName.split(" ");
        var tempName:string = "";
        var newText:string[] = [];
        for (var i = 0; i < names.length; i++) {
            if(tempName.length + names[i].length <= 21){
                tempName += " " + names[i];
            }
            else{
                newText.push(tempName.trim());
                tempName = names[i];
            }
        }
        newText.push(tempName.trim());
        
        for (var i = 0; i < newText.length; i++) {
            this.weaponName[i].text = newText[i];
        }
        this.updateYValues(this.weaponName[0].y + (newText.length + 1) * 14);
        this.alpha = 1;
    }
    
    updateYValues(newY:number){
        this.damageSprite.y = newY - 2;
        this.damageText.y = newY;
        this.cooldownSprite.y = newY - 2;
        this.cooldownText.y = newY;
    }
    
    updateDamage(damage:number, extraValue:number){
        var added:string = "";
        this.damageSprite.x = this.text.x - 60;
        if(extraValue > 0){
            added = "(+1)";
        }
        this.damageText.x = this.damageSprite.x + 30;
        this.damageText.text = damage.toString() + " " +  added;
        this.alpha = 1;
    }
    
    updateCooldown(cooldown:number, extraValue:number){
        var added:string = "";
        this.cooldownText.x = this.text.x + 55;
        if(extraValue > 0){
            added = "(-1)";
        }
        this.cooldownSprite.x = this.cooldownText.x - added.length * 5 - 12;
        this.cooldownText.text = cooldown.toString() + " " + added;
        this.alpha = 1;
    }
}