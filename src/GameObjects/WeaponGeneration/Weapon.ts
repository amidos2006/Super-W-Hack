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

    poison: boolean = false;
    centered: boolean = false;
    repeat: boolean = false;
    direction: Phaser.Point;
    pattern: number[][];

    constructor() {
        this.shape = WeaponShape.LINE_1;

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
            pathRightDir = this.invertColumn(this.transpose(pathRightDir, w, h));
        } else if (faceDirection.x == 1) {
            pathRightDir = this.invertRow(this.transpose(pathRightDir, w, h));
        } else if (faceDirection.y == 1) {
            pathRightDir = this.invertRow(this.invertColumn(this.pattern));
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

        /*if(this.repeat) {
            for (var i: number = (topLeft.y < 0 ? 0 : topLeft.y),
                iR: number = ((topLeft.y < 0 ? 0 : topLeft.y)); iR < result.length; i++ , iR++) {
                if (i == pathRightDir.length)
                    i = 0;
                for (var j: number = (topLeft.x < 0 ? 0 : topLeft.x),
                    jR: number = (topLeft.x < 0 ? 0 : topLeft.x); jR < result[0].length; j++ , jR++) {
                    if (j == pathRightDir[0].length)
                        j = 0;
                    if (pathRightDir[i][j] == 1) {
                        result[iR][jR] = this.damage;
                    }
                }
            }
        } else {*/
            for (var i: number = (topLeft.y < 0 ? 0 : topLeft.y); i - topLeft.y < pathRightDir.length && i < result.length; i++) {
                for (var j: number = (topLeft.x < 0 ? 0 : topLeft.x); j - topLeft.x < pathRightDir[0].length && j < result[0].length; j++) {
                    if (pathRightDir[i - topLeft.y][j - topLeft.x] == 1) {
                        result[i][j] = this.damage;
                    }
                }
            }
        //}
        return result;
    }

    invertRow(matrix: number[][]) {
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

    invertColumn(matrix: number[][]) {
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

    transpose(pathRightDir: number[][], w: number, h: number): number[][] {
        for (var i: number = 0; i < h; i++) {
            for (var j: number = 0; j < w; j++) {
                pathRightDir[i][j] = this.pattern[j][i];
            }
        }
        return pathRightDir;
    }

    getWeaponName():String	{

        return null;
    }

    getCurrentCoolDown():number	{

        return this.curCooldown;
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
    
    fireWeapon() {
        this.curCooldown = this.cooldown;
    }
    
    toString():string{
        var text: string = "";
        text += "Damage: " + this.damage + ", Cooldown: " + this.cooldown + " , Shift: " + this.startPointShif + ", "
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
}

