//import WeaponShape = require('WeaponShape'); 
enum WeaponShape {
    AREA,
    LINE_1,
    LINE_2,
    LINE_3,
    LINE_INF/*,
    CONE_2,
    CONE_3,
    CONE_4*/
}

enum WeaponOnColision {
    PENETRATE,
    EXPLODE
}

enum ColidedEndingType {
    //Comment
    NOTHING,
    EXPLODE
}

enum ShotType {
    NORMAL,
    LEAVE_OBJECT
}

enum TypeColidedObject {
    DIE_WITH_TIME,
    DIE_ON_COLISION
}

enum WeaponCrazyEffects {
    NOTHING,
    TELEPORT,
    KNOCKBACK_ENEMY_1,
    KNOCKBACK_ENEMY_2,
    KNOCKBACK_PLAYER_1,
    KNOCKBACK_PLAYER2
}

class Weapon {
    name: String = "";
    
    /**Damage that weapon gives: 1 <= damage <= 3 */
    static MIN_DAMAGE:number = 1;
    static MAX_DAMAGE:number = 3;
    static DAMAGE_INTERVAL:number = 1;
    damage: number = 1;
    
    /** Time of shot cooldown: 1, 3, 5 */
    static MIN_COOLDOWN:number = 1;
    static MAX_COOLDOWN:number = 5;
    static COOLDOWN_INTERVAL:number = 2;
    cooldown :number = 1;
    curCooldown: number = 0;
    
    /** Where the weapon attack start: 0, 1, 2, 3 (squares ahead the player) */
    static MIN_SHIFT:number = 0;
    static MAX_SHIFT:number = 2;
    static SHIFT_INTERVAL:number = 1;
    startPointShif: number = 1;
    
    /**The way the shooting area is presented */
    shape: WeaponShape = WeaponShape.LINE_1;
    static WEAPON_SHAPE: WeaponShape[] = [WeaponShape.LINE_1, WeaponShape.LINE_2, WeaponShape.LINE_3, WeaponShape.LINE_INF,
        WeaponShape.AREA/*, WeaponShape.CONE_2, WeaponShape.CONE_3, WeaponShape.CONE_4*/];

    /** Type of the shot: normal or leave_behind (e.g. mine) */
    static SHOT_TYPE: ShotType[] = [ShotType.NORMAL, ShotType.LEAVE_OBJECT];
    shotType: ShotType = ShotType.NORMAL;
    
    /** What happen when bullet collide with enemy  */
    static WEAPON_ON_COLISION: WeaponOnColision[] = [WeaponOnColision.EXPLODE, WeaponOnColision.PENETRATE];
    wOnColision: WeaponOnColision = WeaponOnColision.PENETRATE;	
    
    /** What happen when the left object do on collosion  */
    static TYPE_COLIDED_OBJECT: TypeColidedObject[] = [TypeColidedObject.DIE_ON_COLISION, TypeColidedObject.DIE_WITH_TIME];
    typeColidedObj: TypeColidedObject = TypeColidedObject.DIE_ON_COLISION;
    
    /** What happen when time is out from LeaveObj */
    static ENDING_TYPES: ColidedEndingType[] = [ColidedEndingType.NOTHING, ColidedEndingType.EXPLODE];
    endingType: ColidedEndingType = ColidedEndingType.NOTHING;	

    static CHANCE_CENTERED: number = 0.4;
    static CHANCE_REPEAT: number = 0.3;

    lingering: boolean = false;
    amountOfLingeringLive: number = 0;
    poison: boolean = false;
    centered: boolean = false;
    repeat: boolean = false;
    direction: Phaser.Point;
    pattern: number[][];
    idSound: number;
    weaponPower: number = 0;
    areaLevel: number = 0;
    objectExplode: boolean = false;
    objectFade: boolean = false;
    static EFFECTS: WeaponCrazyEffects[] = [WeaponCrazyEffects.NOTHING, WeaponCrazyEffects.TELEPORT, WeaponCrazyEffects.KNOCKBACK_ENEMY_1,
        WeaponCrazyEffects.KNOCKBACK_ENEMY_2, WeaponCrazyEffects.KNOCKBACK_PLAYER2, WeaponCrazyEffects.KNOCKBACK_PLAYER_1];
    crazyEffect: WeaponCrazyEffects = WeaponCrazyEffects.NOTHING;

    constructor() {
        this.shape = WeaponShape.LINE_1;
        this.weaponPower = -1;
    }

    attackInLine(result: number[][], intAttPosX: number, intAttPosY: number,
        playerPos: Phaser.Point, faceDirection: Phaser.Point, valueMatrix: TileTypeEnum[][], quantSpaces: number): number[][] {
        if (intAttPosX == playerPos.x && intAttPosY == playerPos.y) {
            intAttPosX += 1 * faceDirection.x;
            intAttPosY += 1 * faceDirection.y;
        }

        if (faceDirection.x > 0) {
            for (var i: number = intAttPosX; (i < intAttPosX + quantSpaces || quantSpaces == -1)
                && i < result[0].length &&
                valueMatrix[intAttPosY][i] != TileTypeEnum.Wall; i++) {
                result[intAttPosY][i] = this.damage;
            }
        } else if (faceDirection.x < 0) {
            for (var i: number = intAttPosX; (i > intAttPosX - quantSpaces || quantSpaces == -1)
                && i >= 0 && valueMatrix[intAttPosY][i] != TileTypeEnum.Wall; i--) {
                result[intAttPosY][i] = this.damage;
            }
        } else {
            if (faceDirection.y > 0) {  
                for (var i: number = intAttPosY; (i < intAttPosY + quantSpaces || quantSpaces == -1) && i < result.length &&
                    valueMatrix[i][intAttPosX] != TileTypeEnum.Wall; i++) {
                    result[i][intAttPosX] = this.damage;
                }
            } else if (faceDirection.y < 0) {
                for (var i: number = intAttPosY; (i > intAttPosY - quantSpaces || quantSpaces == -1)
                    && i >= 0 && valueMatrix[i][intAttPosX] != TileTypeEnum.Wall; i--) {
                    result[i][intAttPosX] = this.damage;
                }
            }
        }

        return result;
    }

    attackInArea(result: number[][], intAttPosX: number, intAttPosY: number,
        playerPos: Phaser.Point, faceDirection: Phaser.Point, valueMatrix: TileTypeEnum[][]): number[][] {

        var topx: number = (intAttPosX - 1 < 0 ? 0 : intAttPosX - 1);
        var topy: number = (intAttPosY - 1 < 0 ? 0 : intAttPosY - 1);
        var bottomx: number = (valueMatrix[0].length < intAttPosX + 2 ? valueMatrix[0].length : intAttPosX + 2);
        var bottomy: number = (valueMatrix.length < intAttPosY + 2 ? valueMatrix.length : intAttPosY + 2);
        var s: String = "";
        for (var j: number = topy; j < bottomy; j++) {
            for (var i: number = topx; i < bottomx; i++) {
                result[j][i] = this.damage;
                s += result[j][i]+"";
            }
            s += "\n";
        }
        console.log(s);

        return result;
    }

    getLingeringObjectPositions(objectPos: Phaser.Point, valueMatrix: TileTypeEnum[][]): number[][] {

        var result = new Array(valueMatrix.length);
        for (var i: number = 0; i < valueMatrix.length; i++) {
            result[i] = new Array(valueMatrix[0].length);
            for (var j: number = 0; j < valueMatrix[0].length; j++) {
                result[i][j] = 0;
            }
        }

        for (var i: number = (objectPos.y - 1 < 0 ? 0 : objectPos.y - 1);
            i < (objectPos.y + 1 > result.length - 1 ? result.length - 1 : objectPos.y + 1); i++) {
            for (var j: number = (objectPos.x - 1 < 0 ? 0 : objectPos.x - 1);
                j < (objectPos.x + 1 > result[0].length - 1 ?result[0].length - 1 : objectPos.x + 1); j++) {
                result[i][j] = this.damage;
            }
        }
        return result;
    }


    getWeaponPositions(playerPos:Phaser.Point, faceDirection:Phaser.Point, valueMatrix:TileTypeEnum[][]): number[][]	 {
        
        var result = new Array(valueMatrix.length);
        for (var i: number = 0; i < valueMatrix.length; i++) {
             result[i] = new Array(valueMatrix[0].length);
             for(var j:number = 0; j < valueMatrix[0].length; j++) {
                result[i][j] = 0;
            }
        }
      
        /*
        var inAttPosX:number = playerPos.x + (this.startPointShif*faceDirection.x);
        var inAttPosY:number = playerPos.y + (this.startPointShif*faceDirection.y);
        
        if (this.shape == WeaponShape.LINE_1) {
            return this.attackInLine(result, inAttPosX, inAttPosY, playerPos, faceDirection, valueMatrix, 1);
        } else if (this.shape == WeaponShape.LINE_2) {
            return this.attackInLine(result, inAttPosX, inAttPosY, playerPos, faceDirection, valueMatrix, 2);
        } else if (this.shape == WeaponShape.LINE_3) {
            return this.attackInLine(result, inAttPosX, inAttPosY, playerPos, faceDirection, valueMatrix, 3);
        } else if (this.shape == WeaponShape.LINE_INF) {
            return this.attackInLine(result, inAttPosX, inAttPosY, playerPos, faceDirection, valueMatrix, -1);
        } else if (this.shape == WeaponShape.AREA) {
            return this.attackInArea(result, inAttPosX, inAttPosY, playerPos, faceDirection, valueMatrix);
        }
        */

        var w: number = (faceDirection.x == 1 || faceDirection.x == -1) ? this.pattern.length : this.pattern[0].length;
        var h: number = (faceDirection.x == 1 || faceDirection.x == -1) ? this.pattern[0].length : this.pattern.length;
        var pathRightDir = new Array(h);
        for (var i: number = 0; i < h; i++) {
            pathRightDir[i] = new Array(w);
            for (var j: number = 0; j < w; j++) {
                pathRightDir[i][j] = 0;
            }
        }

        if (faceDirection.x == -1) {
            pathRightDir = Weapon.invertColumn(Weapon.transpose(pathRightDir, w, h,this.pattern));
        } else if (faceDirection.x == 1) {
            pathRightDir = Weapon.invertRow(Weapon.transpose(pathRightDir, w, h, this.pattern));
        } else if (faceDirection.y == 1) {
            pathRightDir = Weapon.invertRow(Weapon.invertColumn(this.pattern));
        } else {
            pathRightDir = this.pattern;
        }

        var topLeft: Phaser.Point = new Phaser.Point(0, 0);
        if (this.centered) {
            if (faceDirection.x == 1) {
                topLeft.x = playerPos.x - Math.floor(pathRightDir[0].length / 2);
                topLeft.y = playerPos.y - Math.floor(pathRightDir.length / 2);
            } else if (faceDirection.x == -1) {
                topLeft.x = playerPos.x - Math.floor(pathRightDir[0].length / 2);
                topLeft.y = playerPos.y - Math.floor(pathRightDir.length / 2);
            } else if (faceDirection.y == 1) {
                topLeft.x = playerPos.x - Math.floor(pathRightDir[0].length / 2);
                topLeft.y = playerPos.y - Math.floor(pathRightDir.length / 2);
            } else if (faceDirection.y == -1) {
                topLeft.x = playerPos.x - Math.floor(pathRightDir[0].length / 2);
                topLeft.y = playerPos.y - Math.floor(pathRightDir.length / 2);
            }
        } else {
            if (faceDirection.x == 1) {
                topLeft.x = playerPos.x + 1;
                topLeft.y = playerPos.y - Math.floor(pathRightDir.length / 2);
            } else if (faceDirection.x == -1) {
                topLeft.x = playerPos.x - pathRightDir[0].length;
                topLeft.y = playerPos.y - Math.floor(pathRightDir.length/2);
            } else if (faceDirection.y == 1) {
                topLeft.x = playerPos.x - Math.floor(pathRightDir[0].length / 2);
                topLeft.y = playerPos.y + 1;
            } else if (faceDirection.y == -1) {
                topLeft.x = playerPos.x - Math.floor(pathRightDir[0].length / 2);
                topLeft.y = playerPos.y - pathRightDir.length;
            }
        }

        var t: String = "";
        for (var i: number = 0; i < pathRightDir.length; i++) {
            for (var j: number = 0; j < pathRightDir[0].length; j++) {
                t += pathRightDir[i][j];
            }
            t += "\n";
        }
        console.log("dir: " + faceDirection.x + "x" + faceDirection.y + " " + topLeft.x + "x" + topLeft.y + "\n" + t);
        console.log("WHT");
        //USE resto??? %
        if (this.repeat) {
            if (faceDirection.x == 1) {
                for (var i: number = (topLeft.y < 0 ? 0 : topLeft.y); i - topLeft.y < pathRightDir.length; i++) {
                    for (var j: number = topLeft.x; j < result.length; j++) {
                        if (pathRightDir[(i - topLeft.y)][(j - topLeft.x)%pathRightDir[0].length] == 1) {
                                    result[i][j] = this.damage;
                        }
                    }
                }
            } else if (faceDirection.x == -1) {
                for (var i: number = (topLeft.y < 0 ? 0 : topLeft.y); i - topLeft.y < pathRightDir.length; i++) {
                    for (var j: number = playerPos.x - 1; j >= 0; j--) {
                        var x: number = (j - (playerPos.x % pathRightDir[0].length) + pathRightDir[0].length) % pathRightDir[0].length,
                            aux: number = 2;
                        console.log(i + "," + j + " " + playerPos.x + " " + pathRightDir[0].length + " " + x);
                        if (pathRightDir[i - topLeft.y][x] == 1) {
                            result[i][j] = this.damage;
                        }
                    }
                }
            } else if (faceDirection.y == 1) {
                var auxi: number = 0;
                for (var i: number = topLeft.y; i < result.length; i++) {

                    for (var j: number = (topLeft.x < 0 ? 0 : topLeft.x); j - topLeft.x < pathRightDir[0].length && j < result[0].length; j++) {
                        if (pathRightDir[auxi][j - topLeft.x] == 1) {
                            //if (pathRightDir[(i + topLeft.y) % pathRightDir.length][j - topLeft.x] == 1) {
                            result[i][j] = this.damage;
                        }
                    }
                    auxi++;
                    if (auxi >= pathRightDir.length)
                        auxi = 0;
                }
            } else {
                for (var i: number = playerPos.y - 1; i >= 0; i--) {
                    for (var j: number = (topLeft.x < 0 ? 0 : topLeft.x); j - topLeft.x < pathRightDir[0].length && j < result[0].length; j++) {
                        var y: number = (i - (playerPos.y % pathRightDir.length) + pathRightDir.length) % pathRightDir.length, aux: number = 2;
                        if (pathRightDir[y][j - topLeft.x] == 1) {
                            result[i][j] = this.damage;
                        }
                    }
                }
            }
        } else {
            for (var i: number = (topLeft.y < 0 ? 0 : topLeft.y); i - topLeft.y < pathRightDir.length && i < result.length; i++) {
                for (var j: number = (topLeft.x < 0 ? 0 : topLeft.x); j - topLeft.x < pathRightDir[0].length && j < result[0].length; j++) {
                    if (pathRightDir[i - topLeft.y][j - topLeft.x] == 1) {
                        result[i][j] = this.damage;
                    }
                }
            }
        }
        return result;
    }

    static invertRow(matrix: number[][]) {
        var aux = new Array(matrix.length);
        for (var i: number = 0; i < matrix.length; i++) {
            aux[i] = new Array(matrix[0].length);
            for(var j = 0; j < matrix[0].length; j++) {
                aux[i][j] = 0;
            }
        }

        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[0].length; j++) {
                aux[i][j] = matrix[i][matrix[0].length - j - 1];
            }
        }
        return aux;
    }

    static invertColumn(matrix: number[][]) {
        var aux = new Array(matrix.length);
        for (var i: number = 0; i < matrix.length; i++) {
            aux[i] = new Array(matrix[0].length);
        }

        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[0].length; j++) {
                aux[i][j] = matrix[matrix.length - i - 1][j];
            }
        }
        return aux;
    }

    static transpose(pathRightDir: number[][], w: number, h: number, pattern: number[][]): number[][] {
        for (var i: number = 0; i < h; i++) {
            for (var j: number = 0; j < w; j++) {
                pathRightDir[i][j] = pattern[j][i];
            }
        }
        return pathRightDir;
    }

    getWeaponName():String	{

        return this.name;
    }

    getCurrentCoolDown():number	{

        return this.curCooldown;
    }

    getDamage(): number {
        return this.damage;
    }

    getAreaLevel(): number {
        return this.areaLevel;
    }
    //LeftOnFloor():List of FloorObject{}	

    updateCoolDown() {
        if(this.curCooldown > -5) {
            this.curCooldown--;
        }
    }

    isWeaponReady(): boolean {
        return (this.curCooldown <= 0 ? true : false);
    }

    isWeaponPoisoned(): boolean {
        return this.poison;
    }

    /**
     * Returns wheter this weapon stays in the ground (such as a mine)
     */
    isWeaponLingering(): boolean {
        return this.poison;
    }

    getLingeringLife(): number {
        return this.amountOfLingeringLive;
    }
    
    fireWeapon() {
        this.curCooldown = this.cooldown;
    }

    getSpecialEffect(): WeaponCrazyEffects {
        return this.crazyEffect;
    }

    isObjectFadeWithTimeType(): boolean {
        return this.objectFade;
    }

    isObjectExplodeType(): boolean {
        return this.objectExplode;
    }

    
    toString():string{
        var text: string = "";
        text += this.name+": Damage: " + this.damage + ", Cooldown: " + this.cooldown + " , Shift: " + this.startPointShif + ", "
            + this.endingType + ", Size pattern: " + this.pattern.length + "x" + this.pattern[0].length + ", centered: " +
        this.centered+", repeat?"+this. repeat+"\n";
        for (var i: number = 0; i < this.pattern.length; i++) {
            for (var j: number = 0; j < this.pattern[0].length; j++) {
                text += this.pattern[i][j];
            }
            text += "\n";
        }
        text += "---\n";
        return text;
    }

    calculateAreaLevel() {
        this.areaLevel = 0;
        var black: number = 0;
        for (var i: number = 0; i < this.pattern.length; i++) {
            for (var j: number = 0; j < this.pattern[0].length; j++) {
                if (this.pattern[i][j] == 1) {
                    black++;
                }
            }
        }

        if (this.centered) {
            var maxW: number = Math.ceil(Global.ROOM_WIDTH / 2) > 3 ? Math.ceil(Global.ROOM_WIDTH / 2) : 3;
            var maxH: number = Math.ceil(Global.ROOM_HEIGHT / 2) > 3 ? Math.ceil(Global.ROOM_HEIGHT / 2) : 3;
            var MAX_BLACK: number = (maxH * maxW);
            this.areaLevel += black / MAX_BLACK;
        } else {
            if (this.repeat) {
                var MAX_BLACK: number = Math.ceil(Global.ROOM_HEIGHT / 3) * Math.ceil(Global.ROOM_WIDTH / 3);
                var maxRepetitions: number = Global.ROOM_HEIGHT / Math.ceil(Global.ROOM_HEIGHT / 2);

                var repetitions: number = 0;

                if (this.pattern.length > this.pattern[0].length)
                    repetitions = Global.ROOM_HEIGHT / this.pattern.length;
                else
                    repetitions = Global.ROOM_WIDTH / this.pattern[0].length;

                this.areaLevel += (repetitions * black) / (MAX_BLACK * maxRepetitions);
                
            } else {
                var maxW: number = Math.ceil(Global.ROOM_WIDTH / 3);
                var maxH: number = Math.ceil(Global.ROOM_HEIGHT / 3);
                var MAX_BLACK: number = (maxH * maxW);
                this.areaLevel += black / MAX_BLACK;
            }
        }
    }

    howPowerful(): number {
        var amount: number = 0;
        var aux: number = 0;
        var MAX: number = 0;

        var surrouding: number = 0;
        if (this.centered) {
            if (this.pattern[Math.floor(this.pattern.length / 2) - 1][Math.floor(this.pattern[0].length / 2)] == 1)
                aux++;
            if (this.pattern[Math.floor(this.pattern.length / 2) + 1][Math.floor(this.pattern[0].length / 2)] == 1)
                aux++;
            if (this.pattern[Math.floor(this.pattern.length / 2)][Math.floor(this.pattern[0].length / 2) - 1] == 1)
                aux++;
            if (this.pattern[Math.floor(this.pattern.length / 2)][Math.floor(this.pattern[0].length / 2) + 1] == 1)
                aux++;
            surrouding = aux / 4;
        } else {
            if (this.pattern[this.pattern.length - 1][Math.floor(this.pattern[0].length / 2)] == 1)
                surrouding++;
        }
        MAX++;

        
        var cooldown: number = 0;
        if (this.cooldown < Math.ceil(Weapon.MAX_COOLDOWN / 3))
            cooldown = (2/2);
        else if (this.cooldown < (Math.ceil(Weapon.MAX_COOLDOWN / 3)* 2 )){
            cooldown = (1/2);
        }
        MAX++;

        var damage: number = 0;
        if (this.damage == Weapon.MAX_DAMAGE)
            damage = (2 / 2);
        else if (this.damage > Math.floor(Weapon.MAX_DAMAGE / 2)) {
            damage = (1 / 2);
        }
        MAX++;

        var area: number = 0;
        var black: number = 0;
        for (var i: number = 0; i < this.pattern.length; i++) {
            for (var j: number = 0; j < this.pattern[0].length; j++) {
                if (this.pattern[i][j] == 1) {
                    black++;
                }
            }
        }

        if (this.centered) {
            var maxW: number = Math.ceil(Global.ROOM_WIDTH / 2) > 3 ? Math.ceil(Global.ROOM_WIDTH / 2) : 3;
            var maxH: number = Math.ceil(Global.ROOM_HEIGHT / 2) > 3 ? Math.ceil(Global.ROOM_HEIGHT / 2) : 3;
            var MAX_BLACK: number = (maxH * maxW);
            area= black / MAX_BLACK;

        } else {
            if (this.repeat) {
                var MAX_BLACK: number = Math.ceil(Global.ROOM_HEIGHT / 3) * Math.ceil(Global.ROOM_WIDTH / 3);
                var maxRepetitions: number = Global.ROOM_HEIGHT / Math.ceil(Global.ROOM_HEIGHT / 2);

                var repetitions: number = 0;

                if (this.pattern.length > this.pattern[0].length)
                    repetitions = Global.ROOM_HEIGHT / this.pattern.length;
                else
                    repetitions = Global.ROOM_WIDTH / this.pattern[0].length;

                area = (repetitions * black) / (MAX_BLACK * maxRepetitions);
            } else  {
                var maxW: number = Math.ceil(Global.ROOM_WIDTH / 3);
                var maxH: number = Math.ceil(Global.ROOM_HEIGHT / 3);
                var MAX_BLACK: number = (maxH * maxW);
                this.areaLevel += black / MAX_BLACK;
            }
        }
        MAX++;

        var ling: number = this.lingering ? (this.amountOfLingeringLive > 0 ? this.amountOfLingeringLive / 3 : 4) : 0;

        /*if (this.centered) {
            aux = (this.pattern.length * this.pattern[0].length)
                / (Math.ceil(Global.ROOM_HEIGHT / 2) * Math.ceil(Global.ROOM_WIDTH / 2));
            amount += aux;
        }
        MAX++;
        if (this.repeat)
            amount++;
        MAX++;*/

        this.weaponPower = ((surrouding * 2) + (area * 1) + (cooldown * 2) + (damage * 2) + (ling * 1)) / 8;
        return this.weaponPower;
    }
}

