class PauseMenu extends BaseUIObject{
    isPause:boolean;
    tween:Phaser.Tween;
    
    constructor(game:Phaser.Game, x:number, y:number, name:string, isPause:boolean){
        super(game);
        
        this.isPause = isPause;
        
        var graphics:Phaser.Graphics = this.game.add.graphics(x, y, this);
        graphics.beginFill(0x000000, 1);
        graphics.drawRect(-this.game.width/2, -50, this.game.width, 100);
        graphics.endFill();
        this.add(graphics);
        
        var shift:number = 5;
        if(this.isPause){
            shift = -10;
        }
        
        var style = { font: "40px pixelFont", fill: "#ffffff", align: "center" };
        var text:Phaser.Text = this.game.add.text(x, y + shift, name, style, this);
        text.anchor.set(0.5, 1);
        this.add(text);
        
        var value:string = "";
        if(isPause){
            if(!this.game.input.gamepad.pad1.connected){
                value += "(esc) resume\n"
            }
            else{
                value += "(start) resume\n";
            }
        }
        
        var select:string = "(select)";
        if(!this.game.input.gamepad.pad1.connected){
            select = "(r)"
        }
        
        style = { font: "20px pixelFont", fill: "#ffffff", align: "center" };
        text = this.game.add.text(x, y + shift, value + select + " restart", style, this);
        text.anchor.set(0.5, 0);
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
    
    destroy(){
        super.destroy();
        this.alive = false;
    }
    
    update(){
        super.update();
        
        if(Global.gameController.selectButton == ButtonStates.Pressed){
            this.game.state.start("mainmenu", true);
            Global.audioManager.stopMusic();
            this.game.input.keyboard.reset();
        }
        
        if(this.isPause && this.alpha > 0 && Global.gameController.startButton == ButtonStates.Pressed){
            this.destroy();
        }
    }
}