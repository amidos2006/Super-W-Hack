/// <reference path="BaseSpecial.ts"/>

class ChangeWeaponSpecial extends BaseSpecial{
    constructor(){
        super("new weapon", 2);
    }
    
    useSpecial(level:GameplayState){
        super.useSpecial(level);
        
        Global.currentWeapon = WeaponGenerator.GenerateWeapon(null, level.rnd, 
            level.playerObject.getWeapon(), Global.weaponNameGenerator, 3);
        level.game.add.existing(new WeaponName(level.game, level.playerObject.getTilePosition().x, 
            level.playerObject.getTilePosition().y, Global.currentWeapon.getWeaponName()));
        level.playerObject.setWeapon(Global.currentWeapon);
        level.add.existing(new WhiteLayer(level.game, 0, 0, 0.03));
        level.updateHandUI();
        Global.audioManager.playSpecial(AudioManager.SPECIAL_AAT);
    }
}