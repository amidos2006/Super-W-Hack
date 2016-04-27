/// <reference path="Weapon.ts"/>

class WeaponGenerator {
    
    static DAMAGE: number = 0;
    static SIZE: number = 1;
    static COOLDOWN: number = 2;
    static SPECIAL: number = 3;

    static PROB_POWEFUL_WEAPON = 0.3;
    static MAX_POWERFUL_WEAPON = 2 * 3;

    static AMOUNT_OF_WEAPONS: number = 100;
    static weapons: Weapon[] = null;


    static GenerateWeapon(paramSet: number[], random: Phaser.RandomDataGenerator,
        oldWeapon: Weapon, nameGenerator: WeaponNameGenerator, minDamage: number): Weapon {
        var sound: SfxrParams = sfxrLaserShoot();
        sfxrPlayParam(sound);

        if (minDamage > 0) {
            return WeaponGenerator.GenerateAWeapon(paramSet, random, oldWeapon, nameGenerator, minDamage);
        }

        if (WeaponGenerator.weapons == null) {
            WeaponGenerator.weapons = new Array(WeaponGenerator.AMOUNT_OF_WEAPONS);
            for (var i: number = 0; i < WeaponGenerator.AMOUNT_OF_WEAPONS; i++) {
                WeaponGenerator.weapons[i] = WeaponGenerator.GenerateAWeapon(paramSet, random, oldWeapon, nameGenerator, minDamage);
            }
            WeaponGenerator.weapons.sort(function (a: Weapon, b: Weapon) { return a.weaponPower - b.weaponPower; });
        }

        var prob: number = random.frac();
        var s: string = "";
        console.log("Preparing" + prob);
        for (var i: number = 0; i < WeaponGenerator.AMOUNT_OF_WEAPONS; i++) {
            s += WeaponGenerator.weapons[i].weaponPower + "\t";   
        }

        console.log("Printing ");
        console.log(s);

        var selectedWeapon: number = WeaponGenerator.AMOUNT_OF_WEAPONS-1;
        var w: Weapon = null;
        for (var i: number = 0; i < WeaponGenerator.AMOUNT_OF_WEAPONS; i++)
            if (prob < WeaponGenerator.weapons[i].weaponPower) {
                console.log("chose one :" + WeaponGenerator.weapons[i].weaponPower + " " + prob);
                selectedWeapon = i;
                break;
            }

        w = WeaponGenerator.weapons[selectedWeapon];
        WeaponGenerator.weapons[selectedWeapon] =
            WeaponGenerator.GenerateAWeapon(paramSet, random, oldWeapon, nameGenerator, minDamage);
        WeaponGenerator.weapons.sort(function (a: Weapon, b: Weapon) { return a.weaponPower - b.weaponPower; });
        return w;
    }

    
    
    static GenerateAWeapon(paramSet: number[], random: Phaser.RandomDataGenerator,
        oldWeapon: Weapon, nameGenerator: WeaponNameGenerator, minDamage: number): Weapon {
        

        if (paramSet == null) {
            paramSet = new Array(4);
            for (var i: number = 0; i < paramSet.length; i++) {
                paramSet[i] = 0;
            }
        }
       var weapon: Weapon = new Weapon();
       var previousRandom: Phaser.RandomDataGenerator = random;
       var a: number = -1 % 5;
       do {
           var width: number = 1;//paramSet.get("width");
           var height: number = 1;//= paramSet.get("height");

           var aux: number = 3;//random.integerInRange(1, 4);
           switch (aux) {
               case 1: weapon.direction = new Phaser.Point(1, 0); break;
               case 2: weapon.direction = new Phaser.Point(0, 1); break;
               case 3: weapon.direction = new Phaser.Point(-1, 0); break;
               case 4: weapon.direction = new Phaser.Point(0, -1); break;
           }


           if (random.realInRange(0, 1) < Weapon.CHANCE_CENTERED) {
               weapon.centered = true;
               width = random.integerInRange(3, Weapon.MAX_AREA_SIZE_CENTER_W);
               height = random.integerInRange(3, Weapon.MAX_AREA_SIZE_CENTER_H);
               weapon.repeat = false;
               weapon.lingering = false;
           } else {
               weapon.centered = false;

               if (random.realInRange(0, 1) < Weapon.CHANCE_REPEAT)
                   weapon.repeat = true;
               else
                   weapon.repeat = false;

               if (random.frac() < 0.3) {
                   weapon.lingering = true;
                   if (random.frac() < 0.5) {
                       width = 1;
                       height = random.integerInRange(1, Weapon.MAX_AREA_SIZE_FRONT_H);
                   }
                   if (random.frac() < 0.15)
                       weapon.amountOfLingeringLive = -1;
                   else
                       weapon.amountOfLingeringLive = random.integerInRange(1, Weapon.MAX_AREA_SIZE_FRONT_W);
                   if (random.frac() < 0.35) {
                       weapon.objectExplode = true;
                   } else {
                       weapon.objectExplode = false;
                   }
                   if (random.frac() < 0.40) {
                       weapon.objectFade = true;
                   } else {
                       weapon.objectFade = false;
                   }
               } else {
                   width = random.integerInRange(1, Weapon.MAX_AREA_SIZE_FRONT_W);
                   height = random.integerInRange(1, Weapon.MAX_AREA_SIZE_FRONT_H);
                   weapon.lingering = false;
                   
               }
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

           var s: string = "";

           for (var i: number = 0; i < height; i++) {
               for (var j: number = 0; j < width; j++) {
                   s += pattern[i][j];
               }
               s += "\n";
           }
           console.log("checking " + height + "x" + width + " " + pattern.length + "x" + pattern[0].length+"\n"+s);


           if (width == 1) {
               pattern = WeaponGenerator.createPatternWithOneWidth(pattern, height, random, weapon.centered,
                   (minDamage > -1 ? true : false));
           } else if (height == 1) {
               pattern = WeaponGenerator.createPatternWithOneHeight(pattern, width, random, weapon.centered,
                   (minDamage > -1 ? true : false));
           } else {
               pattern = WeaponGenerator.createPattern(pattern, width, height, random, weapon.centered,
                   (minDamage > -1 ? true : false));
           }

           //clear player position
           if (weapon.centered) {
               var center: Phaser.Point = new Phaser.Point(Math.floor(width / 2), Math.floor(height / 2));
               pattern[center.y][center.x] = 0;
           }

           
           //printWeapon
            var t: String = "";
           for (var i: number = 0; i < height; i++) {
               //copy other half
               for (var j: number = 0; j < width; j++) {
                   t += pattern[i][j]
               }
               t += "\n";
           }
           //console.log("before " + t);

           weapon.pattern = pattern;

           if (minDamage > -1)
               weapon.damage = minDamage;
           else
               weapon.damage = random.integerInRange(Weapon.MIN_DAMAGE, Weapon.MAX_DAMAGE);
           weapon.cooldown = random.integerInRange(Weapon.MIN_COOLDOWN, Weapon.MAX_COOLDOWN);
           weapon.curCooldown = 0;
           console.log("LOGGING " + weapon.toString());
           
       } while (oldWeapon != null && WeaponGenerator.isSame(weapon, oldWeapon)); 

       weapon.idSound = random.between(0, AudioManager.AMOUNT_OF_ATTACKS - 1);

       //Generate name.
       weapon.name = WeaponGenerator.generateName(weapon, pattern, random, nameGenerator);
       weapon.calculateAreaLevel();
       weapon.howPowerful();
       random = previousRandom;
       return weapon;
    }	

    static isSame(a: Weapon, b: Weapon): boolean {
        if (a.pattern.length != b.pattern.length || a.pattern[0].length != b.pattern[0].length) {
            return false;
        }
        if (a.cooldown != b.cooldown || a.centered != b.centered ||
            a.poison != b.poison || a.lingering != b.lingering)
            return false;

        for (var i: number = 0; i < a.pattern.length; i++) {
            for (var j: number = 0; j < a.pattern[0].length; j++) {
                if (a.pattern[i][j] != b.pattern[i][j]) {
                    return false;
                }
            }
        }

        return true;
    }

    static createPatternWithOneWidth(pattern: number[][], height: number, random: Phaser.RandomDataGenerator,
        centered: boolean, needToHaveAdj: boolean): number[][] {
        var hasAnyFilled:boolean = false;
        for (var i: number = 0; i < height; i++) {
            //randomize half
            if (random.frac() < 0.5) {
                pattern[i][0] = 1;
                hasAnyFilled = true;
            }
        }

        if (!hasAnyFilled) {
            if (height > 1)
                pattern[random.integerInRange(0, height - 1)][0] = 1;
            else
                pattern[0][0] = 1;
        }

        if (needToHaveAdj) {
            if (centered) {
                pattern[Math.floor(pattern.length / 2) - 1][0] = 1;
                pattern[Math.floor(pattern.length / 2) + 1][0] = 1;
            } else {
                pattern[pattern.length - 1][0] = 1;
            }
        }

        return pattern;
    }

    static createPatternWithOneHeight(pattern: number[][], width: number, random: Phaser.RandomDataGenerator,
        centered: boolean,needToHaveAdj: boolean): number[][] {
        var hasAnyFilled: boolean = false;

        //randomize half
        for (var j: number = 0; j < Math.floor(width / 2); j++) {
            if (random.frac() < 0.5)
                pattern[0][j] = 0;
            else {
                pattern[0][j] = 1;
                hasAnyFilled = true;
            }
        }

        //if odd number, add one row with random
        if (needToHaveAdj) {
            pattern[0][Math.floor(width / 2)] = 1;
        } else {
            if (random.frac() < 0.5)
                pattern[0][Math.floor(width / 2)] = 0;
            else
                pattern[0][Math.floor(width / 2)] = 1;
        }

        if (!hasAnyFilled) {
            if (width > 2) {
                var rand: number = random.integerInRange(0, (Math.floor(width / 2) - 1 < 1 ? 1 : Math.floor(width / 2) - 1));
                pattern[0][rand] = 1;
            } else
                pattern[0][0] = 1;
        }

        //copy other half
        for (var j: number = width - 1; j > Math.floor(width / 2); j--) {
            pattern[0][j] = pattern[0][width - j - 1];
        }

        return pattern;
    }

    static createPattern(pattern: number[][], width: number, height: number, random: Phaser.RandomDataGenerator,
        centered: boolean, needToHaveAdj: boolean): number[][] {
        var hasAnyFilled:boolean = false;
        
        var orientation: number = (centered ? random.frac() : random.between(0, 0.65));
        //console.log("Orientation: " + orientation);

        if (orientation < 2) {
            //copy horizontally and diagonally

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
                    pattern[random.integerInRange(0, height - 1)]
                    [random.integerInRange(0, Math.floor(width / 2) - 1)] = 1;
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

            if (needToHaveAdj) {
                if (centered) {
                    if (pattern[Math.floor(pattern.length / 2) - 1][Math.floor(pattern[0].length / 2)] == 0 &&
                        pattern[Math.floor(pattern.length / 2)][Math.floor(pattern[0].length / 2) - 1] == 0) {
                        if (random.frac() < 0.5) {
                            pattern[Math.floor(pattern.length / 2) - 1][Math.floor(pattern[0].length / 2)] = 1;
                        } else {
                            pattern[Math.floor(pattern.length / 2)][Math.floor(pattern[0].length / 2) - 1] = 1;
                        }
                    }
                } else {
                    if (pattern[pattern.length - 1][Math.floor(pattern[0].length / 2)] == 0)
                        pattern[pattern.length - 1][Math.floor(pattern[0].length / 2)] = 1;
                }
            }
            
            if (orientation < 0.55) {
                //copy horizontally
                for (var i: number = 0; i < height; i++) {
                    //copy other half
                    var half: number = 2;
                    for (var j: number = width - 1; j > Math.floor(width / 2); j--) {
                        pattern[i][j] = pattern[i][width - j - 1];
                    }
                }
            } else {
                //copy diagonally
                var auxPattern: number[][] = new Array(height);
                for (var i: number = 0; i < height; i++) {
                    auxPattern[i] = new Array(width);
                    for (var j: number = 0; j < width; j++) {
                        auxPattern[i][j] = pattern[i][j];
                    }
                }

                auxPattern = Weapon.invertColumn(Weapon.invertRow(auxPattern));


                for (var i: number = 0; i < height; i++) {
                    //copy other half
                    var half: number = 2;
                    for (var j: number = width - 1; j > Math.floor(width / 2); j--) {
                        pattern[i][j] = auxPattern[i][j];
                    }
                }

                if (width % 2 != 0) {
                    for (var i: number = 0; i < Math.floor(height / 2); i++) {
                        pattern[i][Math.floor(width / 2)] = pattern[height - i - 1][Math.floor(width / 2)];
                    }
                }
                //here

                if (needToHaveAdj) {
                    if (centered) {
                        if (pattern[Math.floor(pattern.length / 2) - 1][Math.floor(pattern[0].length / 2)] == 0 &&
                            pattern[Math.floor(pattern.length / 2)][Math.floor(pattern[0].length / 2) - 1] == 0 &&
                            pattern[Math.floor(pattern.length / 2) + 1][Math.floor(pattern[0].length / 2)] == 0 &&
                            pattern[Math.floor(pattern.length / 2)][Math.floor(pattern[0].length / 2) + 1] == 0) {
                            if (random.frac() < 0.5) {
                                pattern[Math.floor(pattern.length / 2) - 1][Math.floor(pattern[0].length / 2)] = 1;
                                pattern[Math.floor(pattern.length / 2) + 1][Math.floor(pattern[0].length / 2)] = 1;
                            } else {
                                pattern[Math.floor(pattern.length / 2)][Math.floor(pattern[0].length / 2) - 1] = 1;
                                pattern[Math.floor(pattern.length / 2)][Math.floor(pattern[0].length / 2) + 1] = 1;
                            }
                        }
                    } else {
                        if (pattern[pattern.length - 1][Math.floor(pattern[0].length / 2)] == 0)
                            pattern[pattern.length - 1][Math.floor(pattern[0].length / 2)] = 1;
                    }
                }
            }
        } else {
            //copy vertically
            for (var i: number = 0; i < width; i++) {
                //randomize half
                for (var j: number = 0; j < Math.floor(height / 2); j++) {
                    if (random.frac() < 0.5)
                        pattern[j][i] = 0;
                    else {
                        pattern[j][i] = 1;
                        hasAnyFilled = true;
                    }
                }
            }

            if (!hasAnyFilled) {
                if (height > 2 && width > 1)
                    pattern[random.integerInRange(0, Math.floor(height / 2) - 1)]
                    [random.integerInRange(0, width - 1)] = 1;
                else
                    pattern[0][0] = 1;
            }

            var t: string = "-\n";
            for (var i: number = 0; i < pattern.length; i++) {
                for (var j: number = 0; j < pattern[0].length; j++) {
                    t+=(pattern[i][j]);
                }
                t+=("\n");
            }
            t += ""+(pattern[Math.floor(pattern.length / 2) - 1][Math.floor(pattern[0].length / 2)] == 0) + " " +
                (pattern[Math.floor(pattern.length / 2)][Math.floor(pattern[0].length / 2) - 1] == 0) + " " + centered;
            //console.log(t);

            for (var i: number = 0; i < width; i++) {
                //if odd number, add one line with random
                if (random.frac() < 0.5)
                    pattern[Math.floor(height / 2)][i] = 0;
                else
                    pattern[Math.floor(height / 2)][i] = 1;
            }

            

            for (var i: number = 0; i < width; i++) {
                //copy other half
                var half: number = 2;
                for (var j: number = height - 1; j > Math.floor(height / 2); j--) {
                    pattern[j][i] = pattern[height - j - 1][i];
                }
            }

            if (needToHaveAdj) {
                if (centered) {
                    if (pattern[Math.floor(pattern.length / 2) - 1][Math.floor(pattern[0].length / 2)] == 0 &&
                        pattern[Math.floor(pattern.length / 2)][Math.floor(pattern[0].length / 2) - 1] == 0) {
                        if (random.frac() < 0.5) {
                            pattern[Math.floor(pattern.length / 2) - 1][Math.floor(pattern[0].length / 2)] = 1;
                            pattern[Math.floor(pattern.length / 2) + 1][Math.floor(pattern[0].length / 2)] = 1;
                        } else {
                            pattern[Math.floor(pattern.length / 2)][Math.floor(pattern[0].length / 2) - 1] = 1;
                            pattern[Math.floor(pattern.length / 2)][Math.floor(pattern[0].length / 2) + 1] = 1;
                        }
                    }
                } else {
                    if (pattern[pattern.length - 1][Math.floor(pattern[0].length / 2)] == 0) {
                        pattern[pattern.length - 1][Math.floor(pattern[0].length / 2)] = 1;
                        pattern[0][Math.floor(pattern[0].length / 2)] = 1;
                    }
                }
            }
        } 
        return pattern;
    }

    static generateName(weapon: Weapon, pattern: number[][], random: Phaser.RandomDataGenerator,
        nameGenerator: WeaponNameGenerator): string {
        var seed: number[] = new Array(8);
        seed[0] = weapon.damage;
        seed[1] = weapon.cooldown;
        seed[2] = weapon.centered ? 1 : 0;
        seed[3] = weapon.objectExplode ? 1 : 0;
        seed[4] = weapon.repeat ? 1 : 0;
        seed[5] = weapon.lingering ? 1 : 0;
        var patternValue: number = 0, last: number = 0;
        for (var i: number = 0; i < pattern.length; i++) {
            for (var j: number = 0; j < pattern[0].length; j++) {
                patternValue += pattern[i][j] * (Math.pow(10, last));
                last++;
            }
        }
        seed[6] = patternValue;
        seed[7] = weapon.objectFade ? 1 : 0;
        random = new Phaser.RandomDataGenerator(seed);
        
        var quantAdj: number = 1, weaponValue: number = 0;;
        /*if (weapon.damage > Weapon.MAX_DAMAGE / 2)
            quantAdj++;
        if (weapon.isWeaponPoisoned() || weapon.isWeaponLingering())
            quantAdj++;
        if (weapon.cooldown < Weapon.MAX_COOLDOWN / 2)
            quantAdj++;
        if (quantAdj < 3 && (weapon.pattern.length > 3 && weapon.pattern[0].length > 3))
            quantAdj++;*/

        if (weapon.weaponPower > 7) {
            quantAdj = 1;
            weaponValue = 3;
        } else if (weapon.weaponPower > 3) {
            quantAdj = 2;
            weaponValue = 2;
        } else {
            quantAdj = 3;
            weaponValue = 1;
        }
        return nameGenerator.generateAName(quantAdj, random, (weapon.weaponPower > 7 ? true : false),
            (weapon.weaponPower < 7 && weapon.weaponPower > 3 ? true : false));
    }

}