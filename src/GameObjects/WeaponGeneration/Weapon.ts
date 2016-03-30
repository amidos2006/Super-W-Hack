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
    

    constructor() {
         this.shape = WeaponShape.LINE_1;

    }

    attackInLine(result: number[][], intAttPosX: number, intAttPosY: number,
        playerPos: Phaser.Point, faceDirection: Phaser.Point, valueMatrix: TileTypeEnum[][], quantSpaces: number): number[][] {

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
                for (var i: number = intAttPosY; i > (intAttPosY - quantSpaces || quantSpaces == -1)
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
        for (var i = 0; i < valueMatrix.length; i++) {
             result[i] = new Array(valueMatrix[0].length);
             for(var j:number = 0; j < valueMatrix[0].length; j++) {
                result[i][j] = 0;
            }
        }
      
        //
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
        return result;
    }

    getWeaponName():String	{

        return null;
    }

    getCurrentCoolDown():number	{

        return null;
    }

    //LeftOnFloor():List of FloorObject{}	

    updateCoolDown()	{}

    isWeaponReady():Boolean {

        return null;
    }
    
    fireWeapon() {
        this.curCooldown = this.cooldown;
    }
    
    toString():string{
        var text: string = "";
        text += "Damage: " + this.damage + ", Cooldown: " + this.cooldown + " , Shift: " + this.startPointShif + ", "
            + this.endingType+",";
        return text;
    }
}

