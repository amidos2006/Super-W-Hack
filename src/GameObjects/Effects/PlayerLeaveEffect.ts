class PlayerLeaveEffect extends BaseGameObject{
    constructor(game:Phaser.Game, xTile:number, yTile:number){
        super(game, xTile * Global.TILE_SIZE, yTile * Global.TILE_SIZE);
        
        var graphics:Phaser.Sprite = this.game.add.sprite(0, 0, 'graphics');
        graphics.animations.add("normal", [Global.currentPlayer.graphicsIndex]);
        graphics.animations.play("normal");
        graphics.anchor.set(0.5, 0.5);
        this.add(graphics);
        
        var scaleTween:Phaser.Tween = this.game.add.tween(this.scale);
        scaleTween.to({x : 0, y: 0}, 800, Phaser.Easing.Linear.None);
        scaleTween.onComplete.add(this.onAnimationComplete, this);
        scaleTween.start();
    }
    
    onAnimationComplete(){
        Global.levelNumber += 1;
        Global.constructLevel(this.game.rnd);
        this.game.state.start("gameplay");
    }
}