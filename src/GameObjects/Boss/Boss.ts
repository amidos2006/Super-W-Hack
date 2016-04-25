/// <reference path="Astar.ts"/>

/*
- Boss Fights:
	- Movement: pick only one
	- Attack Pattern: pick two of the known patterns for example:
		- random Explosives marked on the ground
		- Laser Attack
		- Leaving Trail
		- Teleport to some place
		- …etc
	- Spawn Enemies: Identify which enemies he will spawn from the list of enemies
 and always spawn around him and I think he need to stop one turn from movement before spawning

I call each step a function called

stepUpdate(playertilePosition:Phaser.Point, map:TileTypeEnum[][])

this function should update and do everything and the class should extends BaseGameObject

this is for now :) If the enemy want access to summon stuff I should send the level:GameplayState too

and tell u the functions that will make it work but I need to know what are the stuff u want to do
 so I can modularize the code and have the correct functions :


types of pattern:
1 move randomly
2 chase player
3 spawn enemies
4 shoot at player
5 teleport to a diffferent location
6 damage floor (for a boss that doesn't move as much)
7 charging player (charge for a while, then sprint towards the player)
8 heal itself
9 stun player
10 jumper > gives a noise, jump, shows where it will fall (aiming on the player).
11 rotate around a point
12 create an enemy with a puddle below him. Puddle does damage and only disapear if you kill the enemy
13 Sweep attack across room
14 rotating death laser
15 safe zone
16 floor damage that is blocked by walls
17 floor damage that is highlighted before taking effect
18 boss that splits itself
*/

enum BossMovementType {
    RANDOM, CHASE, SPAWN, SHOOT, TELEPORT, JUMP, DAMAGE_FLOOR, HEAL, STUN, ROTATE
}

class Boss extends BaseGameObject {

    static BOSS_MOVEMENTS: BossMovementType[] =
    [BossMovementType.RANDOM, BossMovementType.CHASE, BossMovementType.SPAWN, BossMovementType.SHOOT,
        BossMovementType.TELEPORT, BossMovementType.JUMP, BossMovementType.DAMAGE_FLOOR, BossMovementType.HEAL,
        BossMovementType.STUN, BossMovementType.ROTATE];

    movements: BossMovementType[] = null;
    curMovementType: number = -1;
    curDirection: number[] = [1, 0];
    stepsSinceLastMoveChange: number = 0;
    stepsToChangeMove: number = 0;

    health: number = 20;
    damage: number = 0;
    bossWidth: number = 2;
    bossHeight: number = 2;    //

    lastSpecial: number = 0;
    specialCooldown:number = 8;

    attackCooldown: number = 3;
    movementCooldown: number = 0;
    movementSpeed: number = 1;
    dashSpeed: number = 2;



    tilePosition: Phaser.Point;
    probDirection: number[] = [25, 25, 25, 25];
    spawnEnemy: EnemyTypeEnum = EnemyTypeEnum.Chaser;

    constructor(game: Phaser.Game, xTile: number, yTile: number) {
        super(game, xTile * Global.TILE_SIZE, yTile * Global.TILE_SIZE);
        this.tilePosition = new Phaser.Point(3, 3);
        this.x = (this.toTile(this.tilePosition.x));
        this.y = this.toTile(this.tilePosition.y);
        var graphics: Phaser.Graphics = this.game.add.graphics(0, 0, this);
        graphics.beginFill(0xffffff, 1);
        graphics.drawRect(0, 0, this.bossWidth * Global.TILE_SIZE, this.bossHeight * Global.TILE_SIZE);
        graphics.endFill();
        this.add(graphics);
    }

    toTile(x: number): number {
        return x * Global.TILE_SIZE;
    }

    stepUpdate(playerPosition: Phaser.Point, map: TileTypeEnum[][]) {
        // you can get the random object using this.game.rnd
        //this.moveRandom(map);
        
        this.moveChase(playerPosition, map);

        /*if (this.lastSpecial >= this.specialCooldown) {
            this.specialSpawnEnemy(playerPosition, map);
            this.lastSpecial = 0;
        } else {
            this.lastSpecial++;
        }
        console.log(this.tilePosition + " " + this.x + "," + this.y +" special:"+ this.lastSpecial);
        */
    }

    colide(pos: Phaser.Point, map: TileTypeEnum[][]): boolean {
        for (var i: number = pos.x; i < pos.x + this.bossWidth; i++) {
            for (var j: number = pos.y; j < pos.y + this.bossHeight; j++) {
                if (map[i][j] == TileTypeEnum.Wall)
                    return true;
            }
        }
        return false;
    }

    selectNewDirection() {
        var dir: number = this.game.rnd.integerInRange(0, 100);
        if (dir < this.probDirection[0]) {
            this.curDirection = [0, 1];
            this.probDirection[0] -= 3;
            this.probDirection[1] += 1;
            this.probDirection[2] += 1;
            this.probDirection[3] += 1;
        } else if (dir < this.probDirection[0] + this.probDirection[1]) {
            this.curDirection = [1, 0];
            this.probDirection[0] += 1;
            this.probDirection[1] -= 3;
            this.probDirection[2] += 1;
            this.probDirection[3] += 1;
        } else if (dir < this.probDirection[0] + this.probDirection[1] + this.probDirection[2]) {
            this.curDirection = [0, -1];
            this.probDirection[0] += 1;
            this.probDirection[1] += 1;
            this.probDirection[2] -= 3;
            this.probDirection[3] += 1;
        } else {
            this.curDirection = [-1, 0];
            this.probDirection[0] += 1;
            this.probDirection[1] += 1;
            this.probDirection[2] += 1;
            this.probDirection[3] -= 3;
        }
    }

    probCurDirectionNearZero(): boolean {
        if (this.curDirection[0] == 1 && this.probDirection[1] - 6 <= 0) {
            return true;
        } else if (this.curDirection[0] == -1 && this.probDirection[3] - 6 <= 0) {
            return true;
        } else {
            if (this.curDirection[1] == 1 && this.probDirection[0] - 6 <= 0) {
                return true;
            } else if (this.probDirection[2] - 6 <= 0) {
                return true;
            }
        }
        return false;
    }

    moveRandom(map: TileTypeEnum[][]) {
        var previousPos: Phaser.Point = new Phaser.Point(this.tilePosition.x, this.tilePosition.y);

        if (this.game.rnd.frac() < 0.4 || this.probCurDirectionNearZero()) {
            this.selectNewDirection();
        } else {
            this.probDirection[0] += 1;
            this.probDirection[1] += 1;
            this.probDirection[2] += 1;
            this.probDirection[3] += 1;

            if (this.curDirection[0] == 1) {
                this.probDirection[1] -= 6;
            } else if (this.curDirection[0] == -1) {
                this.probDirection[3] -= 6;
            } else {
                if (this.curDirection[1] == 1) {
                    this.probDirection[0] -= 6;
                } else {
                    this.probDirection[2] -= 6;
                }
            }
        }
        console.log("in " + this.tilePosition + " " + this.x + "," + this.y + " curDir" + this.curDirection + " prob" + this.probDirection);

        this.tilePosition.x = this.tilePosition.x + (this.curDirection[1] * this.movementSpeed);
        if (this.tilePosition.x < 0)
            this.tilePosition.x = 0;
        else if (this.tilePosition.x + this.bossWidth >= Global.ROOM_WIDTH)
            this.tilePosition.x = Global.ROOM_WIDTH - this.bossWidth - 1;

        this.tilePosition.y = this.tilePosition.y + (this.curDirection[0] * this.movementSpeed);
        if (this.tilePosition.y < 0)
            this.tilePosition.y = 0;
        else if (this.tilePosition.y + this.bossHeight >= Global.ROOM_HEIGHT)
            this.tilePosition.y = Global.ROOM_HEIGHT - this.bossHeight - 1;

        if (!this.colide(this.tilePosition, map)) {
            this.x = this.toTile(this.tilePosition.x);
            this.y = this.toTile(this.tilePosition.y);
        } else {
            this.tilePosition = previousPos;
            this.selectNewDirection();
        }

    }

    moveChase(playerPosition: Phaser.Point, map: TileTypeEnum[][]) {
        var nextMove: Phaser.Point = new Astar().search(this, playerPosition, map);
        this.tilePosition.x += nextMove.x;
        this.tilePosition.y += nextMove.y;

        this.x = this.toTile(this.tilePosition.x);
        this.y = this.toTile(this.tilePosition.y);
    }

    specialSpawnEnemy(playerPosition: Phaser.Point, map: TileTypeEnum[][]): EnemyObject {
        //add enemies
        var level: GameplayState = <GameplayState>this.game.state.getCurrentState();
        //level.add(enemy);

        var enx: number = 0, eny: number = 0;

        var auxMap: TileTypeEnum[][] = new Array(map.length);
        for (var i: number = 0; i < auxMap.length; i++) {
            auxMap[i] = new Array(map[0].length);
            for (var j: number = 0; j < auxMap.length; j++) {
                if (map[i][j] == TileTypeEnum.Enemy || map[i][j] == TileTypeEnum.Wall || map[i][j] == TileTypeEnum.Hole)
                    auxMap[i][j] = 1;
                else
                    auxMap[i][j] = 0;
            }
        }

        for (var i: number = this.tilePosition.x; i <= this.tilePosition.x + this.bossWidth; i++) {
            for (var j: number = this.tilePosition.y; j <= this.tilePosition.y + this.bossHeight; j++) {
                auxMap[i][j] = 1;
            }
        }

        for (var i: number = playerPosition.x > 0 ? playerPosition.x - 1 : playerPosition.x;
            i <= (playerPosition.x < map.length - 1 ? playerPosition.x - 1 : playerPosition.x); i++) {
            for (var j: number = playerPosition.y > 0 ? playerPosition.y - 1 : playerPosition.y;
                j <= (playerPosition.y < map[0].length - 1 ? playerPosition.y - 1 : playerPosition.y); j++) {
                auxMap[i][j] = 1;
            }
        }

        enx = this.game.rnd.integerInRange(this.tilePosition.x - 2, this.tilePosition.x - 1);
        if (enx < 0)
            enx = 0;
        eny = this.game.rnd.integerInRange(this.tilePosition.y - 2, this.tilePosition.y - 1);

        var enemy:EnemyObject = null;
        switch (this.spawnEnemy) {
            case EnemyTypeEnum.Chaser:
                enemy = new ChaserEnemyObject(this.game, enx, eny, 1, 0, new Phaser.Point(0, 1));
                break;
            case EnemyTypeEnum.Random: default:
                enemy = new RandomEnemyObject(this.game, enx, eny, 1, 0, new Phaser.Point(0, 1));
                break;
        }

        level.addEnemy(enemy);

        return null;
    }
    createRandomEnemy(playerPosition: Phaser.Point, map: TileTypeEnum[][]): EnemyObject {
        var enX: number = 0, enY: number = 0;

        var random: RandomEnemyObject = new RandomEnemyObject(this.game, enX, enY, 1, 0, new Phaser.Point(0, 0));
        return random;
    }
    /**
     * Handle the damage taken by the player shot
     * Return true if the boss is dead and false otherwise
     */
    takeDamage(damage: number): boolean {
        this.health -= damage;
        if (this.health <= 0)
            return true;
        else
            return false;
    }
}