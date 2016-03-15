class BaseGameObject extends Phaser.Group{
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        this.x = x;
        this.y = y;
    }
    
    isAnimating(){
        return false;
    }
}