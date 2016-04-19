class WeaponNameGenerator {
    adjectivesPos: string[];
    adjectivesNeg: string[];
    adjectivesNeut: string[];
    nouns: string[];

    constructor(adjectives: string, nouns:string) {
        this.nouns = nouns.split(",");
        var adj: string[] = new Array(2);
        var aux: string[] = adjectives.split("\n");
        var pos: number = 0, neg: number = 0, neut: number = 0;
        for (var i: number = 0; i < aux.length; i++) {
            adj = aux[i].split("\@");
            switch (adj[1].charAt(0)) {
                case '+': pos++; break;
                case '-': neg++; break;
                default : neut++; break;
            }
        }

        this.adjectivesPos = new Array(pos);
        this.adjectivesNeg = new Array(neg);
        this.adjectivesNeut = new Array(neut);

        pos = 0; neg = 0; neut = 0;
        for (var i: number = 0; i < aux.length; i++) {
            adj = aux[i].split("\@");
            switch (adj[1].charAt(0)) {
                case '+': this.adjectivesPos[pos] = adj[0]; pos++; break;
                case '-': this.adjectivesNeg[neg] = adj[0];neg++; break;
                default: this.adjectivesNeut[neut] = adj[0];neut++; break;
            }
        }
    }

    generateAName(amountAdj: number, random: Phaser.RandomDataGenerator, good: boolean, bad: boolean): string {
        var prob: number[] = new Array(3);

        if (good) {
            prob = [5, 65, 30];
        } else if (bad) {
            prob = [65, 5, 30];
        } else {
            prob = [33, 33, 33];
        }

        var result: string = "The ";
        for (var i: number = 0; i < amountAdj; i++) {
            var p: number = random.integerInRange(0, 100);
            var selected: string = "";
            if (p < prob[0]) {
                selected = this.adjectivesPos[random.between(0, this.adjectivesPos.length - 1)];
            } else if (p < prob[0] + prob[1]) {
                selected = this.adjectivesNeg[random.between(0, this.adjectivesNeg.length - 1)];
            } else {
                selected = this.adjectivesNeut[random.between(0, this.adjectivesNeut.length - 1)];
            }
            result += selected + " ";
        }
        result += this.nouns[random.between(0, this.nouns.length - 1)];
        return result;
    }
}