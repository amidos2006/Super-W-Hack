class EnemyFactory
{
    static getEnemey(game:Phaser.Game, x:number, y:number, random:Phaser.RandomDataGenerator){
        var enemyObject:EnemyObject;
        var randomType:number = random.integerInRange(0, 2);
        
        if(randomType == 0){
             enemyObject = new RandomEnemyObject(game, x, y, random.integerInRange(1, 3), 0, new Phaser.Point());
        }
        else if(randomType == 1){
            enemyObject = new ChaserEnemyObject(game, x, y, random.integerInRange(1, 3), 0, new Phaser.Point());
        }
        else if(randomType == 2){
            var direction:Phaser.Point = new Phaser.Point();
            if(Math.random() < 0.5){
                direction.x = 2 * random.integerInRange(0, 1) - 1;
            }
            else{
                direction.y = 2 * random.integerInRange(0, 1) - 1;
            }
            enemyObject = new BackAndForthEnemyObject(game, x, y, random.integerInRange(1, 3), 1, direction.rperp(), direction);
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