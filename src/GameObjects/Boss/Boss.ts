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
1 OK move randomly - movement
2 OK chase player - movemet
3 OK spawn enemies - special
4 shoot at player - atttack
5 OK teleport to a diffferent location - movement
10 OK ? jumper > gives a noise, jump, shows where it will fall (aiming on the player). - attack
7 charging player (charge for a while, then sprint towards the player) - attack
8 OK heal itself - special
9 stun player - special
11 rotate around a point - movement
12 create an enemy with a puddle below him. Puddle does damage and only disapear if you kill the enemy + special (spawn + floor)
13 Sweep attack across room + attack
14 rotating death laser + attack
15 safe zone + attack
6 damage floor (for a boss that doesn't move as much)- attack
16 floor damage that is blocked by walls + attack
17 floor damage that is highlighted before taking effect
18 boss that splits itself + special
*/

enum BossMovementType {
    RANDOM, CHASE, TELEPORT, JUMP, ROTATE
}

enum BossAttackType {
    DAMAGE_FLOOR, CHARGE, SHOOT, DAMAGE_FLOOR_LINE
}

enum BossSpecialType {
    NONE,SPAWN_ENEMY, HEAL, STUN
}

enum BossState {
    IDLE, CHASING, ATTAKING, TELEPORTING, MOVING, USING_SPECIAL, CHARGING
}

class Boss extends BaseGameObject {

    static BOSS_MOVEMENTS: BossMovementType[] =
    [BossMovementType.RANDOM, BossMovementType.CHASE,
        BossMovementType.TELEPORT, BossMovementType.JUMP];//,  
        //BossMovementType.ROTATE];

    static BOSS_SPECIALS: BossSpecialType[] =
    [BossSpecialType.SPAWN_ENEMY, BossSpecialType.HEAL];//, BossSpecialType.STUN];

    static BOSS_ATTACKS: BossAttackType[] =
    [BossAttackType.DAMAGE_FLOOR, BossAttackType.DAMAGE_FLOOR_LINE];//,BossAttackType.CHARGE]; BossAttackType.SHOOT];

    specialType: BossSpecialType = BossSpecialType.NONE;


    renderValues = {"p":37, "r":38, "c":39, "s":40, "m":41, "e":42, "l":43, "f":44, "g":47, "h":48, "o":49};

    state: BossState = BossState.IDLE;
    attackType: BossAttackType[] = null;
    movementType: BossMovementType[] = null;

    curMovementType: number = -1;
    curDirection: number[] = [1, 0];
    stepsSinceLastMoveChange: number = 0;
    stepsToChangeMove: number = 0;
    
    healthText: Phaser.Text;

    static MAX_HEALTH: number = 20;
    health: number = Boss.MAX_HEALTH;
    damage: number = 0;
    bossWidth: number = 2;
    bossHeight: number = 2;    //

    lastSpecial: number = 0;
    specialCooldown:number = 6;

    attackCooldown: number = 2;
    movementCooldown: number = 1;
    lastMovement: number = 0;
    lastAttack: number = 0;
    movementSpeed: number = 1;
    dashSpeed: number = 2;

    auxTelTimer: number = 0;


    tilePosition: Phaser.Point;
    probDirection: number[] = [25, 25, 25, 25];
    spawnEnemy: EnemyTypeEnum = EnemyTypeEnum.Chaser;

    addInnerBoss(symbols:string[]){
        for (var i = 0; i < symbols.length; i++) {
            var value:number = this.renderValues[symbols[i].toLowerCase()];
            var x:number = i % 2;
            var y:number = Math.floor(i / 2);
            var shiftX:number = -2*x + 1;
            var shiftY:number = -2*y + 1;
            var graphics: Phaser.Sprite = this.game.add.sprite(x * Global.TILE_SIZE + shiftX * 3, 
                y * Global.TILE_SIZE + shiftY * 3, "graphics");
            graphics.animations.add("normal", [value]);
            graphics.animations.play("normal");
            graphics.tint = 0xcc6668;
            this.add(graphics);
        }
    }

    constructor(game: Phaser.Game, xTile: number, yTile: number) {
        super(game, xTile * Global.TILE_SIZE, yTile * Global.TILE_SIZE);
        this.tilePosition = new Phaser.Point(3, 3);
        this.updateAbsolutePosition();

        var graphics: Phaser.Sprite = this.game.add.sprite(0, 0, "graphics");
        graphics.animations.add("normal", [35]);
        graphics.animations.play("normal");
        graphics.tint = 0xcc6668;
        this.add(graphics);
        graphics = this.game.add.sprite(Global.TILE_SIZE, 0, "graphics");
        graphics.animations.add("normal", [36]);
        graphics.animations.play("normal");
        graphics.tint = 0xcc6668;
        this.add(graphics);
        graphics = this.game.add.sprite(0, Global.TILE_SIZE, "graphics");
        graphics.animations.add("normal", [45]);
        graphics.animations.play("normal");
        graphics.tint = 0xcc6668;
        this.add(graphics);
        graphics = this.game.add.sprite(Global.TILE_SIZE, Global.TILE_SIZE, "graphics");
        graphics.animations.add("normal", [46]);
        graphics.animations.play("normal");
        graphics.tint = 0xcc6668;
        this.add(graphics);

        //selection of strategies
        var amountOfFree: number = this.game.rnd.integerInRange(2, 3), att: number = 0, mov: number = 0;
        var amountOfStrategies: number = amountOfFree;
        //select a Special Strategy
        if (this.game.rnd.frac() < 0.3) {
            amountOfFree--;
            this.specialType = Boss.BOSS_SPECIALS[this.game.rnd.integerInRange(0, Boss.BOSS_SPECIALS.length - 1)];
        } else {
            this.specialType = BossSpecialType.NONE;
        }

        if (amountOfFree == 3) {
            amountOfFree--; mov++;
        }

        while (amountOfFree > 0) {
            if (this.game.rnd.frac() < 0.5)
                att++;
            else
                mov++;
            amountOfFree--;
        }

        if(att > 0)
            this.attackType = new Array(att);
        if(mov > 0)
            this.movementType = new Array(mov);

        //select a Attack Strategy
        for (var i: number = 0; i < att; i++) {
            var chosen: BossAttackType = Boss.BOSS_ATTACKS[this.game.rnd.integerInRange(0, Boss.BOSS_ATTACKS.length - 1)];
            var has: boolean = false;
            for (var j: number = 0; j < i; j++) {
                if (this.attackType[j] == chosen) {
                    has = true;
                    chosen = Boss.BOSS_ATTACKS[this.game.rnd.integerInRange(0, Boss.BOSS_ATTACKS.length - 1)];
                    j = 0;
                }
            }
            this.attackType[i] = chosen;
        }

        //select a Movement Strategy
        for (var i: number = 0; i < mov; i++) {
            var chosenM: BossMovementType = Boss.BOSS_MOVEMENTS[this.game.rnd.integerInRange(0, Boss.BOSS_MOVEMENTS.length - 1)];
            var has: boolean = false;
            for (var j: number = 0; j < i; j++) {
                if (this.movementType[j] == chosenM) {
                    has = true;
                    chosenM = Boss.BOSS_MOVEMENTS[this.game.rnd.integerInRange(0, Boss.BOSS_MOVEMENTS.length - 1)];
                    j = 0;
                }
            }
            this.movementType[i] = chosenM;
        }

        if (this.game.rnd.frac() < 0.3) {
            this.spawnEnemy = EnemyTypeEnum.Chaser;
        } else {
            this.spawnEnemy = EnemyTypeEnum.Random;
        }

        //print for your own conscience
        var atS: string = "", mS: string = "";
        if (att == 0)
            atS = "none";
        else
            for (var i: number = 0; i < this.attackType.length; i++) {
                atS += this.attackType[i] + ",";
            }
        if (mov == 0)
            mS = "none";
        else
            for (var i: number = 0; i < this.movementType.length; i++) {
                mS += this.movementType[i] + ",";
            }
        console.log("BOSS: " + amountOfStrategies + "[" + att + "," + mov + "] -> " +
            this.specialType +
            ";  att [" + (this.attackType != null ? this.attackType.length:"null") + "] " + atS + ";   mov [" + (this.movementType != null ? this.movementType.length : "null")+"] " + mS);

        //select characters
        var enemyKeys: string[] = new Array(4);
        for (var i: number = 0; i < 4; i++) {
            enemyKeys[i] = "r";
        }
        var ch: string = "";
        if (amountOfStrategies == 2) {
            if (this.specialType != BossSpecialType.NONE) {
                switch (this.specialType) {
                    case BossSpecialType.HEAL: ch = "h"; break;
                    case BossSpecialType.SPAWN_ENEMY: ch = "s"; break;
                }
                enemyKeys[0] = ch;

                if (this.movementType != null) {
                    switch (this.movementType[0]) {
                        case BossMovementType.RANDOM: ch = "r"; break;
                        case BossMovementType.CHASE: ch = "c"; break;
                        case BossMovementType.JUMP: ch = "o"; break;
                        case BossMovementType.TELEPORT: ch = "e"; break;
                    }
                } else if (this.attackType != null) {
                   switch (this.attackType[0]) {
                       case BossAttackType.DAMAGE_FLOOR: ch = "f"; break;
                       case BossAttackType.DAMAGE_FLOOR_LINE: ch = "l"; break;
                    }
                }
                enemyKeys[1] = ch;
            } else {
                var quant: number = 0;
                if (this.movementType != null) {
                    for (quant = 0; quant < this.movementType.length; quant++) {
                        switch (this.movementType[quant]) {
                            case BossMovementType.RANDOM: ch = "r"; break;
                            case BossMovementType.CHASE: ch = "c"; break;
                            case BossMovementType.JUMP: ch = "o"; break;
                            case BossMovementType.TELEPORT: ch = "e"; break;
                        }
                        enemyKeys[quant] = ch;
                    }
                }

                if (this.attackType != null) {
                    for (var i = 0; i < this.attackType.length; i++) {
                        switch (this.attackType[i]) {
                            case BossAttackType.DAMAGE_FLOOR: ch = "f"; break;
                            case BossAttackType.DAMAGE_FLOOR_LINE: ch = "l"; break;
                        }

                        enemyKeys[i + (this.movementType != null ? this.movementType.length : 0)] = ch;
                        
                    }
                }
            }

            console.log("e "+enemyKeys);

            for (var i: number = enemyKeys.length - 1; i > 1; i--) {
                enemyKeys[i] = enemyKeys[enemyKeys.length - 1- i];
            }

            console.log(enemyKeys);
        } else {
            if (this.specialType != BossSpecialType.NONE) {
                switch (this.specialType) {
                    case BossSpecialType.HEAL: ch = "h"; break;
                    case BossSpecialType.SPAWN_ENEMY: ch = "s"; break;
                }
                enemyKeys[0] = ch;

                
            } 

            var quant: number = 0;
            if (this.movementType != null) {
                for (quant = 0; quant < this.movementType.length; quant++) {
                    switch (this.movementType[quant]) {
                        case BossMovementType.RANDOM: ch = "r"; break;
                        case BossMovementType.CHASE: ch = "c"; break;
                        case BossMovementType.JUMP: ch = "o"; break;
                        case BossMovementType.TELEPORT: ch = "e"; break;
                    }
                    enemyKeys[quant +  (this.specialType != BossSpecialType.NONE ? 1 : 0)] = ch;
                }
            }

            if (this.attackType != null) {
                for (var i = 0; i < this.attackType.length; i++) {
                    switch (this.attackType[i]) {
                        case BossAttackType.DAMAGE_FLOOR: ch = "f"; break;
                        case BossAttackType.DAMAGE_FLOOR_LINE: ch = "l"; break;
                    }

                    enemyKeys[i + (this.specialType != BossSpecialType.NONE ? 1 : 0) + (this.movementType != null ? this.movementType.length : 0)] = ch;

                }
            }

            enemyKeys[3] = enemyKeys[0];
            
        }
        this.addInnerBoss(enemyKeys);
        
        var style = { font: "10px pixelFont", fill: "#cc6668", align: "right" };
        this.healthText = this.game.add.text(2 * Global.TILE_SIZE - 3, 2 * Global.TILE_SIZE + 4,
            this.health.toString(), style, this);
        this.healthText.anchor.set(1, 1);
        this.add(this.healthText);
    }

    toTile(x: number): number {
        return x * Global.TILE_SIZE;
    }
    
    checkCollision(xTile:number, yTile:number){
        return this.getTilePosition().equals(new Phaser.Point(xTile, yTile)) ||
            this.getTilePosition().equals(new Phaser.Point(xTile - 1, yTile)) ||
            this.getTilePosition().equals(new Phaser.Point(xTile, yTile - 1)) ||
            this.getTilePosition().equals(new Phaser.Point(xTile - 1, yTile - 1));
    }
    
    update(){
        super.update();
        
        this.healthText.text = this.health.toString();
        this.healthText.anchor.set(1, 1);
        this.healthText.alpha = 1;
        if (this.health < 1) {
            this.healthText.alpha = 0;
        }
    }
    
    stepUpdate(playerPosition: Phaser.Point, map: TileTypeEnum[][]) {
        if (this.state == BossState.TELEPORTING) {
            this.lastSpecial++;
            this.lastAttack++;
            this.moveTeleport(playerPosition, map, false);
        } else if (this.specialType != BossSpecialType.NONE && this.lastSpecial >= this.specialCooldown) {
            //if needs to use special
            this.useSpecial(playerPosition, map);
            this.lastSpecial = 0;
        } else {
            if (this.specialType != BossSpecialType.NONE)
                this.lastSpecial++;

            var previousPos: Phaser.Point = new Phaser.Point(this.tilePosition.x, this.tilePosition.y);
            var nextMove: number = 0;
            if (this.movementType != null && this.attackType != null) {
                nextMove = (this.game.rnd.integerInRange(0, 1));
            } else if (this.movementType == null)
                nextMove = 1;

            //other movement


            if (nextMove == 0) {
                if (this.movementType != null) {
                    if (this.lastMovement <= 0) {
                        var nextMv: number = this.movementType[this.game.rnd.integerInRange(0, this.movementType.length - 1)];
                        switch (nextMv) {
                            case BossMovementType.CHASE: previousPos = this.moveChase(playerPosition, map); break;
                            case BossMovementType.TELEPORT: previousPos = this.moveTeleport(playerPosition, map, false); break;
                            case BossMovementType.JUMP: previousPos = this.moveTeleport(playerPosition, map, true); break;
                            case BossMovementType.RANDOM: default: previousPos = this.moveRandom(playerPosition, map, false); break;
                        }
                        this.lastMovement = this.movementCooldown;
                    } else
                        this.lastMovement--;
                }
            } else if (nextMove == 1) {
                if (this.attackType != null) {
                    if (this.lastAttack <= 0) {
                        var nextMv: number = this.attackType[this.game.rnd.integerInRange(0, this.attackType.length - 1)];
                        switch (nextMv) {
                            //case BossAttackType.CHARGE: previousPos = this.moveRandom(playerPosition, map, false); break;
                            case BossAttackType.DAMAGE_FLOOR_LINE: this.leaveFloorAttack(playerPosition, map, previousPos,
                                BossAttackType.DAMAGE_FLOOR_LINE); break;
                            case BossAttackType.DAMAGE_FLOOR: default:
                                this.leaveFloorAttack(playerPosition, map, previousPos, BossAttackType.DAMAGE_FLOOR); break;
                        }
                        this.lastAttack = this.attackCooldown;
                    } else
                        this.lastAttack--;
                }
            }
        }
        console.log(this.tilePosition + " " + this.x + "," + this.y + " special:" + this.lastSpecial);

        // you can get the random object using this.game.rnd
        //this.moveRandom(playerPosition,map,true);
              

       // this.moveChase(playerPosition, map);

        //Teleport
        /*
        if (this.curMovementType == this.movementCooldown) {
            this.curMovementType = 0;
            this.state = BossState.MOVING;
        } else {
            this.curMovementType++;
        }

        this.moveTeleport(playerPosition, map,true);
        */

        /*
        */
    }

    /*
     HarmfulFloorObject
consider this as a temp class for what the boss place on the floor
I will add the parameters for it

it take 3 parameters
beside the tile position
damage
as enemies can hit it
time
if -1
or less
means its there forever
explode
which means it will explode on destruction
    */
    leaveFloorAttack(playerPosition: Phaser.Point, map: TileTypeEnum[][], pos: Phaser.Point, type: BossAttackType) {
        var gameplay:GameplayState = <GameplayState>this.game.state.getCurrentState();
        if (type == BossAttackType.DAMAGE_FLOOR) { // random position, 1 per turn, 5 time
            var attPos: Phaser.Point = new Phaser.Point(0, 0);
            attPos.x = this.game.rnd.integerInRange(1, map.length - 1);
            attPos.y = this.game.rnd.integerInRange(1, map[0].length - 1);
            if (map[attPos.x][attPos.y] == TileTypeEnum.Wall)
                if (this.game.rnd.frac() < 0.5)
                    attPos.x += (attPos.x + 1 < map.length - 1 ? 1 : -1);
                else
                    attPos.y += (attPos.y + 1 < map[0].length - 1 ? 1 : -1);
            var floor: HarmfulFloorObject = new HarmfulFloorObject(this.game, attPos.x, attPos.y, 1, 9);
            gameplay.addHarm(floor);
        } else { //one direction, 3 turns
            
            var attPos: Phaser.Point = new Phaser.Point(0, 0), dir: number = this.game.rnd.integerInRange(0, 3);
            switch (dir) {
                case 0: attPos = new Phaser.Point(0, 1); break;
                case 1: attPos = new Phaser.Point(0, -1); break;
                case 2: attPos = new Phaser.Point(1,0); break;
                case 3: default: attPos = new Phaser.Point(-1,0); break;
            }

            console.log("Damage in line " + attPos);

            for (var i: number = pos.x + 1; i < map.length && i > 0; i + attPos.x) {
                for (var j: number = pos.y + 1; j < map[0].length && j > 0; j + attPos.y) {
                    if (map[i][j] != TileTypeEnum.Wall) {
                        i = -10; j = -10;
                        break;
                    } else {
                        var floor: HarmfulFloorObject = new HarmfulFloorObject(this.game, i, j, 1, 6);
                        gameplay.addHarm(floor);
                    }
                }
            }
        }
    }

    useSpecial(playerPosition: Phaser.Point, map: TileTypeEnum[][]) {
        switch (this.specialType) {
            case BossSpecialType.SPAWN_ENEMY: this.specialSpawnEnemy(playerPosition, map); break;
            case BossSpecialType.HEAL: this.heal(); break;
            case BossSpecialType.NONE: default: break;
        }
    }

    isInvisible(): boolean {
        if (this.state == BossState.TELEPORTING) {
            return true;
        } else {
            return false;
        }
    }

    heal() {
        if (this.health < Boss.MAX_HEALTH) {
            this.health++;
        }
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

    moveRandom(playerPosition:Phaser.Point, map: TileTypeEnum[][], isLeavingOnFloor: boolean) : Phaser.Point{
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
            this.updateAbsolutePosition();

            if (isLeavingOnFloor) {
                this.leaveFloorAttack(playerPosition, map, previousPos, BossAttackType.DAMAGE_FLOOR);
            }
        } else {
            this.tilePosition = previousPos;
            this.selectNewDirection();
        }

        return previousPos;
    }

    updateAbsolutePosition() {
        this.x = this.toTile(this.tilePosition.x);
        this.y = this.toTile(this.tilePosition.y);
    }

    moveChase(playerPosition: Phaser.Point, map: TileTypeEnum[][]): Phaser.Point{
        var previous: Phaser.Point = new Phaser.Point(this.tilePosition.x, this.tilePosition.y);
        var nextMove: Phaser.Point = new Astar().search(this, playerPosition, map);
        this.tilePosition.x += nextMove.x;
        this.tilePosition.y += nextMove.y;

        this.updateAbsolutePosition();
        return previous;
    }

    moveTeleport(playerPosition: Phaser.Point, map: TileTypeEnum[][], isFocusedOnPlayer: boolean): Phaser.Point {
        var previous: Phaser.Point = new Phaser.Point(this.tilePosition.x, this.tilePosition.y);
        console.log("Damage teleport ");
        if (this.state == BossState.TELEPORTING) {

            if (this.auxTelTimer == 0) {
                this.curMovementType = this.game.rnd.integerInRange(-3, 0);
                this.alpha = 1;
                this.state = BossState.IDLE;
            } else {
                this.curMovementType = 0;
                this.auxTelTimer--;
            }
        } else {
            //select a new position
            
            var enPosition: Phaser.Point = new Phaser.Point(0, 0);


            /*
            if (playerPosition.x > Global.ROOM_WIDTH / 2) {
                rangeStart.x = Math.floor(Global.ROOM_WIDTH / 2);
                rangeEnd.x = Global.ROOM_WIDTH - 1;
            } else {
                rangeStart.x = 0;
                rangeEnd.x = Math.floor(Global.ROOM_WIDTH / 2);
            }
            if (playerPosition.y > Global.ROOM_HEIGHT / 2) {
                rangeStart.y = Math.floor(Global.ROOM_HEIGHT / 2);
                rangeEnd.y = Global.ROOM_HEIGHT - 1;
            } else {
                rangeStart.y = 0;
                rangeEnd.y = Math.floor(Global.ROOM_HEIGHT / 2);
            }
            */
            if (!isFocusedOnPlayer) {
                var rangeStart: Phaser.Point = new Phaser.Point(1, 1),
                    rangeEnd: Phaser.Point = new Phaser.Point(
                        Global.ROOM_WIDTH - 1 - this.bossWidth,
                        Global.ROOM_HEIGHT - 1 - this.bossHeight);
                enPosition.x = this.game.rnd.integerInRange(rangeStart.x, rangeEnd.x);
                enPosition.y = this.game.rnd.integerInRange(rangeStart.y, rangeEnd.y);
            } else {
                enPosition.x = playerPosition.x - Math.floor(this.bossWidth / 2);
                if (enPosition.x < 0)
                    enPosition.x = 0;
                if (enPosition.x + this.bossWidth >= Global.ROOM_WIDTH) {
                    enPosition.x = Global.ROOM_WIDTH - 1 - this.bossWidth;
                }
                enPosition.y = playerPosition.y - Math.floor(this.bossHeight / 2);
                if (enPosition.y < 0)
                    enPosition.y = 0;
                if (enPosition.y + this.bossHeight >= Global.ROOM_HEIGHT) {
                    enPosition.y = Global.ROOM_HEIGHT - 1 - this.bossHeight;
                }
            }
            this.curMovementType = 0;
            this.auxTelTimer = 3;
            this.alpha = 0.5;
            this.state = BossState.TELEPORTING;

            this.tilePosition.x = enPosition.x;
            this.tilePosition.y = enPosition.y;

            this.updateAbsolutePosition();
        }

        return previous;
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

        if (map[enx][eny] == TileTypeEnum.Wall) {
            if (enx == Global.ROOM_WIDTH - 1)
                enx--;
            else if (enx == 0)
                enx++;
            if (eny == Global.ROOM_HEIGHT - 1)
                eny--;
            else if (eny == 0)
                eny++;
        }

        

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