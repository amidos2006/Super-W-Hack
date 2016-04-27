class HorizontalFollowerEnemyObject extends EnemyObject implements Movement {
    triggerCounter: number;
    activateTrigger: boolean;
    distanceChange: number;
    triggerBar: number;
    MIN_DISTANCE: number = 3;
    MAX_DISTANCE: number = 6;
    PROB_CHANGE: number = 0.001;

    constructor(game: Phaser.Game, x: number, y: number, health: number,
        numberOfcannons: number, cannonDirection1: Phaser.Point) {
        super(game, x, y, health, numberOfcannons, cannonDirection1);
        this.distanceChange = game.rnd.integerInRange(this.MIN_DISTANCE, this.MAX_DISTANCE);
        this.triggerCounter = 1;
        this.triggerBar = 4;
        this.activateTrigger = false;
        this.enemyDirection = this.pickDirection();
    }

    playerInSameDirection(playerPosition: Phaser.Point, tileMap: TileTypeEnum[][]) {
        if (this.getTilePosition().y == playerPosition.y
            && this.getTilePosition().x > playerPosition.x) {
            return true;
        }

        if (this.getTilePosition().y == playerPosition.y
            && this.getTilePosition().x < playerPosition.x) {
            return true;
        }
        return false;
    }

    horizontalFollower(playerPosition: Phaser.Point, tileMap: TileTypeEnum[][]) {
        var moved: boolean = false;
        if (this.playerInSameDirection(playerPosition, tileMap) && this.triggerCounter % this.triggerBar != 0) {

            if (playerPosition.x > this.getTilePosition().x) {
                this.goEnemy(new Phaser.Point(1, 0), tileMap);
                moved = true;
            }

            if (playerPosition.x < this.getTilePosition().x) {
                this.goEnemy(new Phaser.Point(-1, 0), tileMap);
                moved = true;
            }
            this.triggerCounter++;
            if (this.triggerCounter == this.triggerBar) {
                this.triggerCounter = 1;
            }
        }
        return moved;
    }

    getRandomFreeDirection(enemyDirection: Phaser.Point, tileMap: TileTypeEnum[][]) {
        var dir: Phaser.Point = new Phaser.Point(0, 0);
        var dirs: Phaser.Point[] = [];
        for (var i: number = 0; i < this.directions.length; i++) {
            if (this.updateEnemy(this.directions[i], tileMap)) {
                if (!enemyDirection.equals(this.directions[i])) dirs.push(this.directions[i]);
            }
        }

        if (dirs.length > 0) {
            dir = dirs[this.game.rnd.integerInRange(0, dirs.length - 1)];
        }
        if (dir.equals(enemyDirection.multiply(-1, -1))) {
            dir = dirs[this.game.rnd.integerInRange(0, dirs.length - 1)]
        }
        return dir;
    }

    takeDamage(damage: number) {
        var result: boolean = super.takeDamage(damage);
        if (!result && damage > 0) {
            this.distanceChange = 0;
        }

        return result;
    }

    randomMove(enemyDirection: Phaser.Point, tileMatrix: TileTypeEnum[][]) {
        this.distanceChange -= 1;
        console.log("rm " + this.enemyDirection);
        if (!this.updateEnemy(this.enemyDirection, tileMatrix) ||
            this.distanceChange <= 0 || Math.random() < this.PROB_CHANGE) {
            this.enemyDirection = this.getRandomFreeDirection(this.enemyDirection, tileMatrix);
            this.goEnemy(this.enemyDirection, tileMatrix);
            this.distanceChange = this.game.rnd.integerInRange(this.MIN_DISTANCE, this.MAX_DISTANCE);
        } else {
            this.goEnemy(this.enemyDirection, tileMatrix);
        }
    }

    enemyMove(enemyDirection: Phaser.Point, tileMatrix: TileTypeEnum[][]) {
        if (!this.horizontalFollower(enemyDirection, tileMatrix)) {
            this.randomMove(enemyDirection, tileMatrix);
        }
    }

}