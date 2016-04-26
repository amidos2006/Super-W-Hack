/// <reference path="../Enemy/EnemyObject.ts"/>

class BlobEnemyObject extends EnemyObject implements Movement {
    firstPlayerPosition: Phaser.Point;
    trailList: HarmfulFloorObject[];

    constructor(game: Phaser.Game, x: number, y: number, health: number,
        numberOfCannons: number, cannonDirection1: Phaser.Point, firstPlayerPosition: Phaser.Point) {
        super(game, x, y, health, numberOfCannons, cannonDirection1);
        this.trailList = [];
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
        var trail: HarmfulFloorObject;
        if (!this.thereIsATrailInThisPosition(this.getTilePosition())) {
            trail = new HarmfulFloorObject(
                this.game,
                this.getTilePosition().x,
                this.getTilePosition().y
            );

            this.trailList.push(trail);
        }
    }

    thereIsATrailInThisPosition(position: Phaser.Point) {
        if (this.trailList.length > 0) {
            for (var index = 0; index < this.trailList.length; index++) {
                if (this.trailList[index].position.equals(position)) {
                    return true;
                }
            }
        }
        return false;
    }

    enemyMove(enemyDirection: Phaser.Point, tileMatrix: TileTypeEnum[][]) {
        var direction = new Phaser.Point
            (
            (enemyDirection.x - this.firstPlayerPosition.x),
            (enemyDirection.y - this.firstPlayerPosition.y)
            );

        if (!this.updateEnemy(direction, tileMatrix)) {
            this.goEnemy(new Phaser.Point(0, 0), tileMatrix);
        }
        else {
            this.goEnemy(direction, tileMatrix);
            this.dropTrail();
        }
        this.firstPlayerPosition = enemyDirection;
    }

}