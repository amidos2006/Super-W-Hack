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
    static MAX_SHIFT:number = 3;
    static COOLDOWN_SHIFTL:number = 1;
    startPointShif: number = 1;
    
    /**The way the shooting area is presented */
    shape: WeaponShape = WeaponShape.LINE_1;

    /** Type of the shot: normal or leave_behind (e.g. mine) */
    shotType: ShotType = ShotType.NORMAL;
    
    /** What happen when bullet collide with enemy  */
    wOnColision: WeaponOnColision = WeaponOnColision.PENETRATE;	
    
    /** What happen when the left object do on collosion  */
    typeColidedObj: TypeColidedObject = TypeColidedObject.DIE_ON_COLISION;
    
    /** What happen when time is out from LeaveObj */
    endingType: ColidedEndingType = ColidedEndingType.NOTHING;	
    

    constructor() {
         this.shape = WeaponShape.LINE_1;

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
        
        if(this.shape == WeaponShape.LINE_1) {
            switch(faceDirection.x) {
                case 1:
                    for(var j:number = inAttPosX; j < valueMatrix[0].length && inAttPosX-j < 1; j++) {
                        result[inAttPosY][j] = this.damage;
                    }
                break;
                case -1:
                     for(var j:number = inAttPosX; j >= 0 && inAttPosX-j < 1; j--) {
                        result[inAttPosY][j] = this.damage;
                    }
                break;
                default:
                switch(faceDirection.y) {
                    case 1:
                    for(var i:number = inAttPosY; i < valueMatrix.length && inAttPosY-i < 1; i++) {
                            result[i][j] = this.damage;
                        
                    }
                    break;
                    case -1:
                    for(var i:number = inAttPosY; i >= 0 && inAttPosY-i < 1; i--) {
                            result[i][j] = this.damage;
                    }
                    break;
                }
            }
            
            
            
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
        text+="Damage: "+this.damage+", Cooldown: "+this.cooldown;
        return text;
    }
}

