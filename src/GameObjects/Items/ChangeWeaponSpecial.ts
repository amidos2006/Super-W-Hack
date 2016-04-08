/// <reference path="BaseSpecial.ts"/>

class ChangeWeaponSpecial extends BaseSpecial{
    constructor(){
        super(5);
    }
    
    useSpecial(level:GameplayState){
        super.useSpecial(level);
        
        Global.currentWeapon = WeaponGenerator.GenerateWeapon(null, level.rnd, level.playerObject.getWeapon());
        level.playerObject.setWeapon(Global.currentWeapon);
    }
}