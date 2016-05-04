/// <reference path="../Enemy/EnemyObject.ts"/>

class BlobEnemyObject extends EnemyObject implements Movement {
    firstPlayerPosition: Phaser.Point;
    lightRay: CannonObject;

    constructor(game: Phaser.Game, x: number, y: number, health: number,
        numberOfCannons: number, cannonDirection1: Phaser.Point, firstPlayerPosition: Phaser.Point) {
        super(game, x, y, health, numberOfCannons, cannonDirection1);
        this.lightRay = new CannonObject(new Phaser.Point());
        this.enemyDirection = new Phaser.Point();
        this.firstPlayerPosition = firstPlayerPosition;
        this.enemySpriteIndex = 31;

        this.enemySprite = this.game.add.sprite(0, 0, "graphics");
        this.enemySprite.animations.add("normal", [this.enemySpriteIndex]);
        this.enemySprite.animations.play("normal");
        this.enemySprite.tint = 0xcc6668;
        this.add(this.enemySprite);
    }

    dropTrail() {
        var trail: HarmfulFloorObject = new HarmfulFloorObject(this.game, 
            this.getTilePosition().x, this.getTilePosition().y, 1, 3);
        var gameplay:GameplayState = <GameplayState>this.game.state.getCurrentState();
        gameplay.addHarm(trail);
    }
    
    playerInSameDirection(playerPosition: Phaser.Point, tileMap: TileTypeEnum[][]) {
        for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
                if (Math.abs(x) != Math.abs(y)) {
                    this.lightRay.cannonDirection.x = x;
                    this.lightRay.cannonDirection.y = y;
                    var result = this.lightRay.shoot(playerPosition, this, tileMap);
                    if (result != null) {
                        return new Phaser.Point(x, y);
                    }
                }
            }
        }
        return new Phaser.Point();
    }
    
    enemyMove(enemyDirection: Phaser.Point, tileMatrix: TileTypeEnum[][]) {
        if (!this.isAlive) {
            return;
        }
        
        var tempDirection: Phaser.Point = this.playerInSameDirection(enemyDirection, tileMatrix);
        if (tempDirection.getMagnitude() != 0) {
            this.enemyDirection = tempDirection;
        }

        if (this.updateEnemy(this.enemyDirection, tileMatrix)) {
            this.dropTrail();
            this.goEnemy(this.enemyDirection, tileMatrix);
        }
        else{
            this.enemyDirection = new Phaser.Point();
        }
        
        // var direction = new Phaser.Point(
        //     (enemyDirection.x - this.firstPlayerPosition.x),
        //     (enemyDirection.y - this.firstPlayerPosition.y));

        // if (this.updateEnemy(direction, tileMatrix)) {
        //     this.dropTrail();
        //     this.goEnemy(direction, tileMatrix);
        // }
        // this.firstPlayerPosition = enemyDirection;
    }

}