/// <reference path="../Enemy/EnemyObject.ts"/>

class BlobEnemyObject extends EnemyObject implements Movement {
    firstPlayerPosition: Phaser.Point;

    constructor(game: Phaser.Game, x: number, y: number, health: number,
        numberOfCannons: number, cannonDirection1: Phaser.Point, firstPlayerPosition: Phaser.Point) {
        super(game, x, y, health, numberOfCannons, cannonDirection1);
        this.firstPlayerPosition = firstPlayerPosition;
        if (this.firstPlayerPosition.x == 10) {
            this.firstPlayerPosition.x = 1;
        }
        else if (this.firstPlayerPosition.x == 0) {
            this.firstPlayerPosition.x = 9;
        }

        if (this.firstPlayerPosition.y == 10) {
            this.firstPlayerPosition.y = 0;
        }
        else if (this.firstPlayerPosition.y == 0) {
            this.firstPlayerPosition.y = 9;
        }
    }

    dropTrail() {
        var trail: HarmfulFloorObject = new HarmfulFloorObject(this.game, 
            this.getTilePosition().x, this.getTilePosition().y, 1, 3, false);
        this.game.add.existing(trail);
    }

    enemyMove(enemyDirection: Phaser.Point, tileMatrix: TileTypeEnum[][]) {
        if (!this.isAlive) {
            return;
        }
        var direction = new Phaser.Point(
            (enemyDirection.x - this.firstPlayerPosition.x),
            (enemyDirection.y - this.firstPlayerPosition.y));

        if (this.updateEnemy(direction, tileMatrix)) {
            this.goEnemy(direction, tileMatrix);
            this.dropTrail();
        }
        this.firstPlayerPosition = enemyDirection;
    }

}