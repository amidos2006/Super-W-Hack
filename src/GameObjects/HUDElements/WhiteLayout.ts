class WhiteLayout extends BaseUIObject{
    graphics:Phaser.Graphics;
    
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        this.graphics = this.game.add.graphics(x, y, this);
        this.graphics.lineStyle(3, 0x444444, 1);
        this.graphics.drawRect(-5, -5, Global.ROOM_WIDTH * Global.TILE_SIZE + 10, 
            Global.ROOM_HEIGHT * Global.TILE_SIZE + 10);
        this.add(this.graphics);
    }
}