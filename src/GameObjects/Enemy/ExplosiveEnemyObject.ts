class ExplosiveEnemyObject extends EnemyObject implements Movement {
    lightRay: CannonObject;
    
    constructor(game: Phaser.Game, x: number, y: number, health: number, numberOfCannons: number,
        cannonDirection1: Phaser.Point) {
        super(game, x, y, health, numberOfCannons, cannonDirection1);
        this.lightRay = new CannonObject(new Phaser.Point());
        this.enemyDirection = new Phaser.Point();
        this.enemySpriteIndex = 24;

        this.enemySprite = this.game.add.sprite(0, 0, "graphics");
        this.enemySprite.animations.add("normal", [this.enemySpriteIndex]);
        this.enemySprite.animations.play("normal");
        this.enemySprite.tint = 0xcc6668;
        this.add(this.enemySprite);
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

    explode() {
        var explosionDmg: number[][] = [];
        for (var y = 0; y < Global.ROOM_HEIGHT; y++) {
            explosionDmg.push([]);
            for (var x = 0; x < Global.ROOM_WIDTH; x++) {
                explosionDmg[y].push(0);
            }
        }

        var location: Phaser.Point = this.getTilePosition();
        for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
                if (location.x + x >= 0 && location.y + y >= 0 &&
                    location.x + x < Global.ROOM_WIDTH && location.y + y < Global.ROOM_HEIGHT) {
                    explosionDmg[location.y + y][location.x + x] = 3;
                }
            }
        }
        return explosionDmg;
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
            this.goEnemy(this.enemyDirection, tileMatrix);
        }
    }
}