/// <reference path="../Enemy/EnemyObject.ts"/>

class ChaserEnemyObject extends EnemyObject implements Movement {
    constructor(game: Phaser.Game, x: number, y: number, health: number,
        numberOfcannons: number, cannonDirection1: Phaser.Point) {
        super(game, x, y, health, numberOfcannons, cannonDirection1);
        this.enemySpriteIndex = 9;

        this.enemyDirection = this.pickDirection();
        this.enemySprite = this.game.add.sprite(0, 0, "graphics");
        this.enemySprite.animations.add("normal", [this.enemySpriteIndex]);
        this.enemySprite.animations.play("normal");
        this.enemySprite.tint = 0xcc6668;
        this.add(this.enemySprite);
    }

    chaser(playerPosition: Phaser.Point) {
        var enemyDirection: Phaser.Point = new Phaser.Point(0, 0);

        if ((this.getTilePosition().x < playerPosition.x)
            && (this.getTilePosition().y < playerPosition.y)) {
            var difX = playerPosition.x - this.getTilePosition().x;
            var difY = playerPosition.y - this.getTilePosition().y;

            console.log("difX: " + difX);
            console.log("difY: " + difX);

            if (difX >= difY) {
                //this.x += Global.TILE_SIZE * this.enemySpeed;
                enemyDirection = new Phaser.Point(1, 0);
            }
            else {
                //this.y += Global.TILE_SIZE * this.enemySpeed;
                enemyDirection = new Phaser.Point(0, 1);
            }
        }

        if ((this.getTilePosition().x < playerPosition.x)
            && (this.getTilePosition().y > playerPosition.y)) {
            var difX = playerPosition.x - this.getTilePosition().x;
            var difY = this.getTilePosition().y - playerPosition.y;

            console.log("difX: " + difX);
            console.log("difY: " + difX);

            if (difX >= difY) {
                //this.x += Global.TILE_SIZE * this.enemySpeed;
                enemyDirection = new Phaser.Point(1, 0);
            }
            else {
                //this.y -= Global.TILE_SIZE * this.enemySpeed;
                enemyDirection = new Phaser.Point(0, -1);
            }
        }

        if ((this.getTilePosition().x > playerPosition.x)
            && (this.getTilePosition().y < playerPosition.y)) {
            var difX = this.getTilePosition().x - playerPosition.x;
            var difY = playerPosition.y - this.getTilePosition().y;

            console.log("difX: " + difX);
            console.log("difY: " + difX);

            if (difX >= difY) {
                //this.x -= Global.TILE_SIZE * this.enemySpeed;
                enemyDirection = new Phaser.Point(-1, 0);
            }
            else {
                //this.y += Global.TILE_SIZE * this.enemySpeed;
                enemyDirection = new Phaser.Point(0, 1);
            }
        }

        if ((this.getTilePosition().x > playerPosition.x)
            && (this.getTilePosition().y > playerPosition.y)) {
            var difX = playerPosition.x - this.getTilePosition().x;
            var difY = playerPosition.y - this.getTilePosition().y;

            console.log("difX: " + difX);
            console.log("difY: " + difX);

            if (difX >= difY) {
                //this.x -= Global.TILE_SIZE * this.enemySpeed;
                enemyDirection = new Phaser.Point(-1, 0);
            }
            else {
                //this.y -= Global.TILE_SIZE * this.enemySpeed;
                enemyDirection = new Phaser.Point(0, -1);
            }
        }

        if (this.getTilePosition().x == playerPosition.x
            && this.getTilePosition().y > playerPosition.y) {
            enemyDirection = new Phaser.Point(0, -1);
        }

        if (this.getTilePosition().x == playerPosition.x
            && this.getTilePosition().y < playerPosition.y) {
            enemyDirection = new Phaser.Point(0, 1);
        }

        if (this.getTilePosition().x > playerPosition.x
            && this.getTilePosition().y == playerPosition.y) {
            enemyDirection = new Phaser.Point(-1, 0);
        }

        if (this.getTilePosition().x < playerPosition.x
            && this.getTilePosition().y == playerPosition.y) {
            enemyDirection = new Phaser.Point(1, 0);
        }

        return enemyDirection;
    }

    enemyMove(enemyDirection: Phaser.Point, tileMatrix: TileTypeEnum[][]) {
        if (!this.isAlive) {
            return;
        }
        var direction = this.chaser(enemyDirection)
        if (!this.updateEnemy(direction, tileMatrix)) {
            var newDir = this.getNearDirectionToPlayer(direction, enemyDirection, tileMatrix);
            this.goEnemy(newDir, tileMatrix);
        } else {
            this.goEnemy(direction, tileMatrix);
        }
    }
}