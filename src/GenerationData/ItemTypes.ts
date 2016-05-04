class ItemTypes{
    itemProb:number[];
    
    constructor(game:Phaser.Game){
        this.itemProb = [];
        var text:string[] = game.cache.getText("aaron").split("\n");
        for (var i = 0; i < text.length; i++) {
            this.itemProb.push(parseFloat(text[i]) / 100.0);
        }
    }
    
    isItemRoom(levelNumber:number){
        if(Math.random() < this.itemProb[levelNumber]){
            return true;
        }
        
        return false;
    }
}