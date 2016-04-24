/// <reference path="../BaseUIObject.ts"/>

class FlyingText extends BaseUIObject{
    upcomingText:string;
    text:Phaser.Text;
    speed:number;
    
    constructor(game:Phaser.Game, x:number, y:number, initialString:string, speed:number, fontSize:number = 20){
        super(game);
        
        var style = { font: fontSize + "px pixelFont", fill: "#ffffff", align: "center" };
        this.text = new Phaser.Text(game, x, y, initialString, style);
        this.text.anchor.set(0.5, 0);
        this.add(this.text);
        this.upcomingText = initialString;
        this.speed = speed;
        this.selectText(false);
    }
    
    changeText(newText:string){
        var numberOfSpaces:number = Math.abs(this.text.text.length - newText.length) / 2;
        this.upcomingText = "";
        for(var i:number=0; i<numberOfSpaces; i++){
            this.upcomingText += " ";
        }
        this.upcomingText += newText;
        for(var i:number=0; i<numberOfSpaces; i++){
            this.upcomingText += " ";
        }
    }
    
    selectText(select:boolean){
        if(select){
            this.text.tint = 0xffffff;
        }
        else{
            this.text.tint = 0x777777;
        }
    }
    
    update(){
        for (var i = 0; i < this.upcomingText.length; i++) {
            var newChar:number = this.upcomingText.charCodeAt(i);
            if(this.upcomingText.charAt(i) == " "){
                newChar = "z".charCodeAt(0) + 1;
            }
            var oldChar:number = this.text.text.charCodeAt(i);
            if(this.text.text.charAt(i) == " "){
                oldChar = "z".charCodeAt(0) + 1;
            }
            var change:number = Phaser.Math.sign(newChar - oldChar) * this.speed;
            if(this.speed > Math.abs(newChar - oldChar)){
                change = (newChar - oldChar);
            }
            
            oldChar += change;
            if(oldChar == newChar && oldChar == "z".charCodeAt(0) + 1){
                oldChar = " ".charCodeAt(0);
            }
            this.text.text = this.text.text.substr(0, i) + String.fromCharCode(oldChar) + this.text.text.substr(i + 1);
        }
        
        this.text.anchor.set(0.5, 0);
    }
}