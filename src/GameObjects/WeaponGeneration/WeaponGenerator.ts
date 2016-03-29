class WeaponGenerator {
    
   static GenerateWeapon(paramSet, random: Phaser.RandomDataGenerator): Weapon {
       var weapon: Weapon = new Weapon();
       var previousRandom:Phaser.RandomDataGenerator = random;

       weapon.damage = random.integerInRange(0, Weapon.MAX_DAMAGE - Weapon.MIN_DAMAGE) + Weapon.MIN_DAMAGE;
       var i: number = Math.floor(Weapon.MAX_COOLDOWN - Weapon.MIN_COOLDOWN / Weapon.COOLDOWN_INTERVAL) + 1;
       weapon.cooldown = random.integerInRange(0, i) * Weapon.COOLDOWN_INTERVAL + Weapon.MIN_COOLDOWN;
       weapon.curCooldown = 0;
       i = Math.floor(Weapon.MAX_SHIFT - Weapon.MIN_SHIFT / Weapon.SHIFT_INTERVAL) + 1;
       weapon.startPointShif = random.integerInRange(0, i) * Weapon.SHIFT_INTERVAL + Weapon.MIN_SHIFT;
       
       weapon.endingType = Weapon.ENDING_TYPES[random.integerInRange(0, Weapon.ENDING_TYPES.length)];
       weapon.shape = Weapon.WEAPON_SHAPE[random.integerInRange(0, Weapon.WEAPON_SHAPE.length)];
       weapon.shotType = Weapon.SHOT_TYPE[random.integerInRange(0, Weapon.SHOT_TYPE.length)];
       weapon.typeColidedObj = Weapon.TYPE_COLIDED_OBJECT[random.integerInRange(0, Weapon.TYPE_COLIDED_OBJECT.length)];
       weapon.wOnColision = Weapon.WEAPON_ON_COLISION[random.integerInRange(0, Weapon.WEAPON_ON_COLISION.length)];

       random = previousRandom;
       return weapon;
   }	
    
}