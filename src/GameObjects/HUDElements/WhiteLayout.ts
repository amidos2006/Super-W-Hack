class WhiteLayout extends BaseUIObject{
    graphics:Phaser.Graphics;
    
    constructor(game:Phaser.Game, x:number, y:number, width:number, height:number){
        super(game);
        
        this.graphics = this.game.add.graphics(x, y, this);
        this.graphics.lineStyle(3, 0x444444, 1);
        this.graphics.drawRect(-3, -3, width + 6, 
            height + 6);
        this.add(this.graphics);
    }
}