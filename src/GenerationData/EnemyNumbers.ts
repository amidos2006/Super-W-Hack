class EnemyNumbers{
    probabilities:number[][];
    
    constructor(game:Phaser.Game){
        this.probabilities = [];
        
        var probString:String[] = game.cache.getText("enemyNumbers").split("\n");
        for (var i = 0; i < probString.length; i++) {
            this.probabilities.push([]);
            var values:string[] = probString[i].split(",");
            for (var j = 0; j < values.length; j++) {
                this.probabilities[i].push(parseInt(values[j]));
            }
        }
    }
    
    getNumber(random:Phaser.RandomDataGenerator, levelNumber:number){
        switch (Global.levelNumber) {
            case 0:
                switch (Global.difficultyNumber) {
                    case 0:
                        return 1;
                    case 1:
                        return 1;
                    case 2:
                        return 2;
                }
                break;
            case 1:
                switch (Global.difficultyNumber) {
                    case 0:
                        return 1;
                    case 1:
                        return 3;
                }
                break;
        }
        var cdf:number[] = [this.probabilities[levelNumber][0]];
        var total:number = 0;
        for (var i = 1; i < this.probabilities[levelNumber].length; i++) {
            cdf.push(cdf[i - 1] + this.probabilities[levelNumber][i]);
            total = cdf[i];
        }
        for (var i = 0; i < this.probabilities[levelNumber].length; i++) {
            cdf[i] /= total;
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