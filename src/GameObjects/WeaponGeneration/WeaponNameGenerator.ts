class WeaponNameGenerator {
    adjectives: string[];
    nouns: string[];

    constructor(adjectives: string, nouns:string) {
        this.adjectives = adjectives.split(",");
        this.nouns = nouns.split(",");
    }

    generateAName(amountAdj: number, random: Phaser.RandomDataGenerator): string {
        var result: string = "the ";
        for (var i: number = 0; i < amountAdj; i++)
            result += this.adjectives[random.between(0, this.adjectives.length - 1)] + " ";
        result += this.nouns[random.between(0, this.nouns.length - 1)];
        return result;
    }
}