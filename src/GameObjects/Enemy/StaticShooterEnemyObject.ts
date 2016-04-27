class StaticShooterEnemyObject extends EnemyObject implements Movement {
    rotatingIndex: number;
    constructor(game: Phaser.Game, x: number, y: number, health: number,
        numberOfcannons: number, cannonDirection1: Phaser.Point) {
        super(game, x, y, health, numberOfcannons, cannonDirection1);
        this.enemySpriteIndex = 23;

        this.enemySprite = this.game.add.sprite(0, 0, "graphics");
        this.enemySprite.animations.add("normal", [this.enemySpriteIndex]);
        this.enemySprite.animations.play("normal");
        this.enemySprite.tint = 0xcc6668;
        this.add(this.enemySprite);

        for (var i = 0; i < this.directions.length; i++) {
            var dir: Phaser.Point = this.directions[i];
            if (dir.distance(cannonDirection1) < 0.0001) {
                this.rotatingIndex = i;
                break;
            }
        }
    }

    changeCannonDirection() {
        this.cannons[0].cannonDirection = this.directions[this.rotatingIndex];
        this.cannonSprite.x = (this.cannons[0].cannonDirection.x + 1) * Global.TILE_SIZE / 2 - this.cannons[0].cannonDirection.x * 4;
        this.cannonSprite.y = (this.cannons[0].cannonDirection.y + 1) * Global.TILE_SIZE / 2 - this.cannons[0].cannonDirection.y * 4;
        this.cannonSprite.angle = this.cannons[0].cannonDirection.angle(new Phaser.Point(), true) + 180;
    }

    enemyMove(enemyDirection: Phaser.Point, tileMatrix: TileTypeEnum[][]) {
        if (!this.isAlive) {
            return;
        }
        this.rotatingIndex = (this.rotatingIndex + 1) % this.directions.length;
        this.changeCannonDirection();
    }
}