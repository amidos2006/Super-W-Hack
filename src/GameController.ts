class GameController{
    private MAX_DELAY:number;
    private game:Phaser.Game;
    private axisDelay:number;
    
    aButton:ButtonStates;
    bButton:ButtonStates;
    startButton:ButtonStates;
    selectButton:ButtonStates;
    direction:Phaser.Point;
    
    constructor(game:Phaser.Game){
        this.game = game;
        
        this.aButton = ButtonStates.Up;
        this.bButton = ButtonStates.Up;
        this.startButton = ButtonStates.Up;
        this.selectButton = ButtonStates.Up;
        this.axisDelay = 0;
        this.MAX_DELAY = 10;
        this.direction = new Phaser.Point();
        
        this.game.onBlur.add(this.stop, this);
        this.game.onFocus.add(this.start, this);
        
        this.game.onPause.add(this.stop, this);
        this.game.onResume.add(this.start, this);
    }
    
    start(){
        this.game.input.gamepad.start();
    }
    
    stop(){
        this.game.input.gamepad.stop();
    }
    
    update(){
        this.axisDelay -= 1;
        if(this.axisDelay <= 0){
            this.axisDelay = 0;
        }
        
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.X) || this.game.input.gamepad.isDown(1)){
            switch (this.aButton) {
                case ButtonStates.Up:
                    this.aButton = ButtonStates.Pressed;
                    break;
                case ButtonStates.Pressed:
                    this.aButton = ButtonStates.Down;
                    break;
                case ButtonStates.Released:
                    this.aButton = ButtonStates.Pressed;
            }
        }
        else{
            switch (this.aButton) {
                case ButtonStates.Down:
                    this.aButton = ButtonStates.Released;
                    break;
                case ButtonStates.Pressed:
                    this.aButton = ButtonStates.Released;
                    break;
                case ButtonStates.Released:
                    this.aButton = ButtonStates.Up;
            }
        }
        
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.Z) || this.game.input.gamepad.isDown(2)){
            switch (this.bButton) {
                case ButtonStates.Up:
                    this.bButton = ButtonStates.Pressed;
                    break;
                case ButtonStates.Pressed:
                    this.bButton = ButtonStates.Down;
                    break;
                case ButtonStates.Released:
                    this.bButton = ButtonStates.Pressed;
            }
        }
        else{
            switch (this.bButton) {
                case ButtonStates.Down:
                    this.bButton = ButtonStates.Released;
                    break;
                case ButtonStates.Pressed:
                    this.bButton = ButtonStates.Released;
                    break;
                case ButtonStates.Released:
                    this.bButton = ButtonStates.Up;
            }
        }
        
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.ESC) || this.game.input.gamepad.isDown(9)){
            switch (this.startButton) {
                case ButtonStates.Up:
                    this.startButton = ButtonStates.Pressed;
                    break;
                case ButtonStates.Pressed:
                    this.startButton = ButtonStates.Down;
                    break;
                case ButtonStates.Released:
                    this.startButton = ButtonStates.Pressed;
            }
        }
        else{
            switch (this.startButton) {
                case ButtonStates.Down:
                    this.startButton = ButtonStates.Released;
                    break;
                case ButtonStates.Pressed:
                    this.startButton = ButtonStates.Released;
                    break;
                case ButtonStates.Released:
                    this.startButton = ButtonStates.Up;
            }
        }
        
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.gamepad.isDown(8)){
            switch (this.selectButton) {
                case ButtonStates.Up:
                    this.selectButton = ButtonStates.Pressed;
                    break;
                case ButtonStates.Pressed:
                    this.selectButton = ButtonStates.Down;
                    break;
                case ButtonStates.Released:
                    this.selectButton = ButtonStates.Pressed;
            }
        }
        else{
            switch (this.selectButton) {
                case ButtonStates.Down:
                    this.selectButton = ButtonStates.Released;
                    break;
                case ButtonStates.Pressed:
                    this.selectButton = ButtonStates.Released;
                    break;
                case ButtonStates.Released:
                    this.selectButton = ButtonStates.Up;
            }
        }
        
        this.direction = new Phaser.Point();
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || 
            (this.game.input.gamepad.pad1.axis(1) == -1 && this.axisDelay <= 0)) {
            this.axisDelay = this.MAX_DELAY;
            this.direction.y -= 1;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || 
            (this.game.input.gamepad.pad1.axis(1) == 1 && this.axisDelay <= 0)) {
            this.axisDelay = this.MAX_DELAY;
            this.direction.y += 1;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || 
            (this.game.input.gamepad.pad1.axis(0) == -1 && this.axisDelay <= 0)) {
            this.axisDelay = this.MAX_DELAY;
            this.direction.x -= 1;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || 
            (this.game.input.gamepad.pad1.axis(0) == 1 && this.axisDelay <= 0)) {
            this.axisDelay = this.MAX_DELAY;
            this.direction.x += 1;
        }

        if (this.direction.x != 0 && this.direction.y != 0) {
            if (Math.random() < 0.5) {
                this.direction.x = 0;
            }
            else {
                this.direction.y = 0;
            }
        }
        
        if(this.direction.x != 0 || this.direction.y != 0){
            this.game.input.keyboard.reset();
        }
    }
}