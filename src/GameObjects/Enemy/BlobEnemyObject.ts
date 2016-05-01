/// <reference path="../Enemy/EnemyObject.ts"/>

class BlobEnemyObject extends EnemyObject implements Movement {
    firstPlayerPosition: Phaser.Point;

    constructor(game: Phaser.Game, x: number, y: number, health: number,
        numberOfCannons: number, cannonDirection1: Phaser.Point, firstPlayerPosition: Phaser.Point) {
        super(game, x, y, health, numberOfCannons, cannonDirection1);
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

    enemyMove(enemyDirection: Phaser.Point, tileMatrix: TileTypeEnum[][]) {
        if (!this.isAlive) {
            return;
        }
        var direction = new Phaser.Point(
            (enemyDirection.x - this.firstPlayerPosition.x),
            (enemyDirection.y - this.firstPlayerPosition.y));

        if (this.updateEnemy(direction, tileMatrix)) {
            this.dropTrail();
            this.goEnemy(direction, tileMatrix);
        }
        this.firstPlayerPosition = enemyDirection;
    }

}