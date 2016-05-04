class ArcadeTimer{
    game:Phaser.Game;
    gameplayState:GameplayState;
    startCond:number;
    minPeriod:number;
    randomPeriod:number;
    currentTime:number;
    enemyType:number;
    
    constructor(game:Phaser.Game, startCond:number, minPeriod:number, randomPeriod:number, enemyType:number){
        this.game = game;
        this.gameplayState = <GameplayState>this.game.state.getCurrentState();
        this.startCond = startCond;
        this.minPeriod = minPeriod;
        this.randomPeriod = randomPeriod;
        this.enemyType = enemyType;
        this.currentTime = 0;
    }
    
    updateStep(){
        if(Global.crateNumber >= this.startCond){
            this.currentTime -= 1;
            if(this.currentTime <= 0){
                var map:TileTypeEnum[][] = Global.getCurrentRoom().getMatrix(this.gameplayState.enemyObjects);
                map[this.gameplayState.boxObject.getTilePosition().x][this.gameplayState.boxObject.getTilePosition().y] = TileTypeEnum.Wall;
                var damage:number[][] = Global.currentWeapon.getWeaponPositions(new Phaser.Point(Math.floor(Global.ROOM_WIDTH / 2),
                    Math.floor(Global.ROOM_HEIGHT / 2)), new Phaser.Point(0, -1), map);
                
                var enemy:EnemyObject = Global.enemyTypes.getArcadeEnemy(this.game, map, damage, this.enemyType);
                this.gameplayState.addEnemy(enemy);
                this.currentTime = this.game.rnd.integerInRange(this.minPeriod, this.minPeriod + this.randomPeriod);
            }
        }
    }
}