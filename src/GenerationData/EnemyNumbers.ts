class EnemyNumbers{
    probabilities:number[][];
    
    constructor(game:Phaser.Game){
        this.probabilities = [];
        
        var probString:String[] = game.cache.getText("enemyNumbers").split("\n");
        for (var i = 0; i < probString.length; i++) {
            this.probabilities.push([]);
            var values:string[] = probString[i].split(",");
            for (var j = 0; j < values.length; j++) {
                this.probabilities[i].push(parseInt(values[j]) / 100.0);
            }
        }
    }
    
    getNumber(random:Phaser.RandomDataGenerator, levelNumber:number){
        var cdf:number[] = [this.probabilities[levelNumber][0]];
        for (var i = 1; i < this.probabilities[levelNumber].length; i++) {
            cdf.push(cdf[i - 1] + this.probabilities[levelNumber][1]);
        }
        var value:number = random.realInRange(0, 1);
        for (var i = 0; i < cdf.length; i++) {
            if(value < cdf[i]){
                return 2 + i;
            }
        }
        return cdf.length + 1;
    }
}