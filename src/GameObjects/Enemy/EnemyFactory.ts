class EnemyFactory
{
    static getEnemey(game:Phaser.Game, x:number, y:number, random:Phaser.RandomDataGenerator){
        var enemyObject:EnemyObject;
        var randomType:number = random.integerInRange(0, 2);
        
        if(randomType == 0){
             enemyObject = new RandomEnemyObject(game, x, y, random.integerInRange(1, 3), 0, new Phaser.Point());
        }
        else if(randomType == 1){
            var maxChaserHP:number = 3;
            if(Math.floor(Global.currentWeapon.getAreaLevel() * 10) <= 1){
                maxChaserHP = Global.currentWeapon.getDamage();
            }    
            enemyObject = new ChaserEnemyObject(game, x, y, random.integerInRange(1, maxChaserHP), 0, new Phaser.Point());
        }
        else if(randomType == 2){
            var direction:Phaser.Point = new Phaser.Point();
            var cannonDirection:Phaser.Point = new Phaser.Point();
            if(Math.random() < 0.5){
                direction.x = 2 * random.integerInRange(0, 1) - 1;
                cannonDirection.y = 2 * random.integerInRange(0, 1) - 1;
            }
            else{
                direction.y = 2 * random.integerInRange(0, 1) - 1;
                cannonDirection.x = 2 * random.integerInRange(0, 1) - 1;
            }
            enemyObject = new BackAndForthEnemyObject(game, x, y, random.integerInRange(1, 3), 1, cannonDirection, direction);
        }
        return enemyObject;
    }
    
    static defineEnemyType(choose:number)
    {
        if (choose == 2)
        {
            return EnemyTypeEnum.BackAndForth;
        }
        if (choose == 3)
        {
            return EnemyTypeEnum.Chaser;
        }
        if (choose == 1)
        {   
            return EnemyTypeEnum.Random;    
        }
    }
}