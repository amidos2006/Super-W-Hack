class LaserEffect extends BaseGameObject{
    graphics:Phaser.Graphics;
    direction:Phaser.Point;
    scaleDownSpeed:number;
    
    constructor(game:Phaser.Game, x:number, y:number, destX:number, destY:number){
        super(game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
        this.scaleDownSpeed = 0.05;
        
        this.direction = new Phaser.Point(destX - x, destY - y);
        this.direction = this.direction.normalize();
        this.x += (this.direction.x + 1) * Global.TILE_SIZE / 2;
        this.y += (this.direction.y + 1) * Global.TILE_SIZE / 2;
        
        this.graphics = this.game.add.graphics(0, 0, this);
        this.graphics.beginFill(0xcc6668, 1);
        this.graphics.drawRect(Math.abs(this.direction.y) * -2, Math.abs(this.direction.x) * -2, 
            (destX - x) * Global.TILE_SIZE - this.direction.x * Global.TILE_SIZE / 2 + Math.abs(this.direction.y) * 4, 
            (destY - y) * Global.TILE_SIZE - this.direction.y * Global.TILE_SIZE / 2 + Math.abs(this.direction.x) * 4);
        this.graphics.endFill();
        this.add(this.graphics);
    }
    
    update(){
        super.update();
        
        this.scale.x -= Math.abs(this.direction.y) * this.scaleDownSpeed;
        this.scale.y -= Math.abs(this.direction.x) * this.scaleDownSpeed;
        if(this.scale.x <= 0 || this.scale.y <= 0){
            this.killObject();
        }
    }
}