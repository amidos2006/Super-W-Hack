class PlayerEntranceEffect extends BaseGameObject{
    constructor(game:Phaser.Game, xTile:number, yTile:number, startScale:number = 5){
        super(game, (xTile + 0.5) * Global.TILE_SIZE, (yTile + 0.5) * Global.TILE_SIZE);
        
        var graphics:Phaser.Sprite = this.game.add.sprite(0, 0, 'graphics');
        graphics.animations.add("normal", [Global.currentPlayer.graphicsIndex]);
        graphics.animations.play("normal");
        graphics.anchor.set(0.5, 0.5);
        this.add(graphics);
        
        this.scale.set(startScale, startScale);
        this.alpha = 0;
        
        var scaleTween:Phaser.Tween = this.game.add.tween(this.scale);
        scaleTween.to({x : 1, y: 1}, 800, Phaser.Easing.Bounce.Out);
        scaleTween.onComplete.add(this.onAnimationComplete, this);
        scaleTween.start();
        
        var alphaTween:Phaser.Tween = this.game.add.tween(this);
        alphaTween.to({alpha: 1}, 800, Phaser.Easing.Linear.None);
        alphaTween.start();
    }
    
    onAnimationComplete(){
        var gameplayState:GameplayState = <GameplayState>this.game.state.getCurrentState();
        gameplayState.playerObject = new PlayerObject(this.game, this.getTilePosition().x, 
                this.getTilePosition().y, Global.currentWeapon);
        gameplayState.lastPosition = gameplayState.playerObject.getTilePosition();
        this.game.add.existing(gameplayState.playerObject);
        this.killObject();
    }
}