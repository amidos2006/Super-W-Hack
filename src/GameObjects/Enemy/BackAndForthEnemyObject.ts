/// <reference path="../Enemy/EnemyObject.ts"/>

class BackAndForthEnemyObject extends EnemyObject implements Movement {
    constructor(game: Phaser.Game, x: number, y: number, health: number,
        numberOfcannons: number, cannonDirection1: Phaser.Point, movementDirection: Phaser.Point) {
        super(game, x, y, health, numberOfcannons, cannonDirection1);
        this.enemySpriteIndex = 6;

        this.enemyDirection = movementDirection;
        this.enemySprite = this.game.add.sprite(0, 0, "graphics");
        this.enemySprite.animations.add("normal", [this.enemySpriteIndex]);
        this.enemySprite.animations.play("normal");
        this.enemySprite.tint = 0xcc6668;
        this.add(this.enemySprite);
    }

    enemyMove(enemyDirection: Phaser.Point, tileMatrix: TileTypeEnum[][]) {
        if (!this.isAlive) {
            return;
        }
        if (!this.updateEnemy(this.enemyDirection, tileMatrix) &&
            !this.updateEnemy(this.reverseDirection(this.enemyDirection), tileMatrix)) {
            this.goEnemy(new Phaser.Point(0, 0), tileMatrix);
        }
        if (!this.updateEnemy(this.enemyDirection, tileMatrix)) {
            this.goEnemy(this.reverseDirection(this.enemyDirection), tileMatrix);
        } else {
            this.goEnemy(this.enemyDirection, tileMatrix);
        }
        
        super.enemyMove(enemyDirection, tileMatrix);
    }
}