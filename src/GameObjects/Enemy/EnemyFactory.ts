class EnemyFactory
{
    static getEnemey(game:Phaser.Game, x:number, y:number, params:number[])
    {
        var enemy;
        
        if(params == null)
        {
             enemy = new RandomEnemyObject(game, x, y, params);
        }
        else if(EnemyFactory.defineEnemyType(params[3]) == EnemyTypeEnum.Random)
        {
            enemy = new RandomEnemyObject(game, x, y, params);
        }
        else if(EnemyFactory.defineEnemyType(params[3]) == EnemyTypeEnum.BackAndForth)
        {
            enemy = new BackAndForthEnemyObject(game, x, y, params);
        }
        else
        {
            enemy = new ChaserEnemyObject(game, x, y, params); 
        }
        return enemy;
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