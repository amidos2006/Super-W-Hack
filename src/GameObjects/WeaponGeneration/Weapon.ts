class Weapon {
    /**Damage that weapon gives: 1 <= damage <= 3 */
    damage: number = -1;
    
    /** Time of shot cooldown: 1, 3, 5 */
    cooldown :number = -1;
    
    /** Where the weapon attack start: 0, 1, 2, 3 (squares ahead the player) */
    startPointShif: number = -1;
    
    /**The way the shooting area is presented */
    shape: WeaponShape = WeaponShape.LINE_1;

    shotType: ShotType = ShotType.NORMAL;
    
    

    Weapon() {
        
    }

    GetWeaponPositions(playerPos:Phaser.Point, faceDirection:Phaser.Point, ValueMatrix:number[][]): number[][]	 {
        return null;
    }

    GetWeaponName():String	{

        return null;
    }

    GetCurrentCoolDown():number	{

        return null;
    }

    //LeftOnFloor():List of FloorObject{}	

    UpdateCoolDown()	{}

    IsWeaponReady():Boolean {

        return null;
    }
}

