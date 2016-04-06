class WeaponGenerator {
    
   static GenerateWeapon(paramSet, random: Phaser.RandomDataGenerator): Weapon {
       var weapon: Weapon = new Weapon();
       var previousRandom:Phaser.RandomDataGenerator = random;

       var width: number = 1;//paramSet.get("width");
       var height: number = 1;//= paramSet.get("height");

       var aux: number = random.integerInRange(1, 4);
       switch (aux) {
           case 1: weapon.direction = new Phaser.Point(1, 0); break;
           case 2: weapon.direction = new Phaser.Point(0, 1); break;
           case 3: weapon.direction = new Phaser.Point(-1, 0); break;
           case 4: weapon.direction = new Phaser.Point(0, -1); break;
       }

      
       
       if (random.realInRange(0, 1) < Weapon.CHANCE_CENTERED) {
           weapon.centered = true;
           width = random.integerInRange(3, Math.ceil(Global.ROOM_WIDTH / 3) > 3 ? Math.ceil(Global.ROOM_WIDTH / 3):3 );
           height = random.integerInRange(3, Math.ceil(Global.ROOM_HEIGHT / 3) > 3 ? Math.ceil(Global.ROOM_HEIGHT / 3) : 3);
           weapon.repeat = false;
       } else {
           weapon.centered = false;

           if (random.realInRange(0, 1) < Weapon.CHANCE_REPEAT)
               weapon.repeat = true;
           else
               weapon.repeat = false;
           
           width = random.integerInRange(1, Math.ceil(Global.ROOM_WIDTH / 3));
           height = random.integerInRange(1, Math.ceil(Global.ROOM_HEIGHT / 3));
       }

       if (width % 2 == 0) {
           if (width > 2)
               width--;
           else
               width++;
       }
       if (height % 2 == 0) {
           if (height > 2)
               height--;
           else
               height++;
       }

       
       //initialize variable
       var hasAnyFilled: boolean = false;
       var pattern = new Array(height);
       for (var i: number = 0; i < height; i++) {
           pattern[i] = new Array(width);
           for (var j: number = 0; j < width; j++) {
               pattern[i][j] = 0;
           }
       }

       console.log("checking " + height+ "x" + width +" "+pattern.length+"x"+pattern[0].length);


       if (width == 1) {
           hasAnyFilled = false;
           for (var i: number = 0; i < height; i++) {
               //randomize half
               if (random.frac() < 0.5) {
                   pattern[i][0] = 1;
                   hasAnyFilled = true;
               }
           }

           if (!hasAnyFilled) {
               if (height > 1)
                   pattern[0][random.integerInRange(0, height - 1)] = 1;
               else
                   pattern[0][0] = 1;
           }
       } else if (height == 1) {
           hasAnyFilled = false;
          
            //randomize half
            for (var j: number = 0; j < Math.floor(width / 2); j++) {
                if (random.frac() < 0.5)
                    pattern[0][j] = 0;
                else {
                    pattern[0][j] = 1;
                    hasAnyFilled = true;
                }
            }

           if (!hasAnyFilled) {
               if (width > 2)
                   pattern[random.integerInRange(0, Math.floor(width / 2) - 1)][0] = 1;
               else
                   pattern[0][0] = 1;
           }

           for (var i: number = 0; i < height; i++) {
               //if odd number, add one row with random
               if (random.frac() < 0.5)
                   pattern[i][Math.floor(width / 2)] = 0;
               else
                   pattern[i][Math.floor(width / 2)] = 1;
           }


           for (var i: number = 0; i < height; i++) {
               //copy other half
               var half: number = 2;
               for (var j: number = width - 1; j > Math.floor(width / 2); j--) {
                   pattern[i][j] = pattern[i][width - j - 1];
               }
           }
       } else {
           hasAnyFilled = false;
           for (var i: number = 0; i < height; i++) {
               //randomize half
               for (var j: number = 0; j < Math.floor(width / 2); j++) {
                   if (random.frac() < 0.5)
                       pattern[i][j] = 0;
                   else {
                       pattern[i][j] = 1;
                       hasAnyFilled = true;
                   }
               }
           }

           if (!hasAnyFilled) {
               if (width > 2 && height > 1)
                   pattern[random.integerInRange(0, Math.floor(width / 2) - 1)]
                   [random.integerInRange(0, height - 1)] = 1;
               else
                   pattern[0][0] = 1;
           }

           for (var i: number = 0; i < height; i++) {
               //if odd number, add one row with random
               if (random.frac() < 0.5)
                   pattern[i][Math.floor(width / 2)] = 0;
               else
                   pattern[i][Math.floor(width / 2)] = 1;
           }
       

           for (var i: number = 0; i < height; i++) {
               //copy other half
               var half: number = 2;
               for (var j: number = width - 1; j > Math.floor(width / 2); j--) {
                   pattern[i][j] = pattern[i][width - j - 1];
               }
           }
       }

       var t: String = "";
       for (var i: number = 0; i < height; i++) {
           //copy other half
           for (var j: number = 0; j < width; j++) {
               t+=pattern[i][j]
           }
           t += "\n";
       }
       console.log("before " + t);

       weapon.pattern = pattern;

       weapon.damage = random.integerInRange(0, Weapon.MAX_DAMAGE - Weapon.MIN_DAMAGE) + Weapon.MIN_DAMAGE;
       var i: number = Math.floor(Weapon.MAX_COOLDOWN - Weapon.MIN_COOLDOWN / Weapon.COOLDOWN_INTERVAL) + 1;
       weapon.cooldown = Math.floor(Weapon.MAX_COOLDOWN - Weapon.MIN_COOLDOWN / Weapon.COOLDOWN_INTERVAL) + Weapon.MIN_COOLDOWN;
       weapon.curCooldown = 0;
       weapon.poison = random.frac() < 0.2 ? true : false;
       console.log("LOGGING " + weapon.toString());
       
       /*
       
       i = Math.floor(Weapon.MAX_SHIFT - Weapon.MIN_SHIFT / Weapon.SHIFT_INTERVAL) + 1;
       weapon.startPointShif = random.integerInRange(0, i) * Weapon.SHIFT_INTERVAL + Weapon.MIN_SHIFT;
       
       weapon.endingType = Weapon.ENDING_TYPES[random.integerInRange(0, Weapon.ENDING_TYPES.length)];
       weapon.shape = Weapon.WEAPON_SHAPE[random.integerInRange(0, Weapon.WEAPON_SHAPE.length-1)];
       weapon.shotType = Weapon.SHOT_TYPE[random.integerInRange(0, Weapon.SHOT_TYPE.length-1)];
       weapon.typeColidedObj = Weapon.TYPE_COLIDED_OBJECT[random.integerInRange(0, Weapon.TYPE_COLIDED_OBJECT.length - 1)];
       weapon.wOnColision = Weapon.WEAPON_ON_COLISION[random.integerInRange(0, Weapon.WEAPON_ON_COLISION.length - 1)];
       */
       random = previousRandom;
       return weapon;
   }	
    
}