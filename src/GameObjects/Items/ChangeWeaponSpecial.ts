/// <reference path="BaseSpecial.ts"/>

class ChangeWeaponSpecial extends BaseSpecial{
    constructor(){
        super(2);
    }
    
    useSpecial(level:GameplayState){
        super.useSpecial(level);
        
        Global.currentWeapon = WeaponGenerator.GenerateWeapon(null, level.rnd, 
            level.playerObject.getWeapon(), Global.weaponNameGenerator);
        level.game.add.existing(new WeaponName(level.game, level.playerObject.getTilePosition().x, 
            level.playerObject.getTilePosition().y, Global.currentWeapon.getWeaponName()));
        level.playerObject.setWeapon(Global.currentWeapon);
        Global.audioManager.playSpecial(AudioManager.SPECIAL_AAT);
    }
}