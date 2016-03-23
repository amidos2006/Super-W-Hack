class WeaponGenerator {
    
   static GenerateWeapon(paramSet, random: Phaser.RandomDataGenerator): Weapon {
       var weapon: Weapon = new Weapon();
       var previousRandom:Phaser.RandomDataGenerator = random;
               
       random = previousRandom;
       return weapon;
   }	
    
}