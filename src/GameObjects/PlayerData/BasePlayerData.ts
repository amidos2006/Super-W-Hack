class BasePlayerData{
    text:String;
    baseIndex:number;
    specialAbility:BaseSpecial;
    graphicsIndex:number;
    
    constructor(text:string, baseIndex:number, graphicsIndex:number, specialAbility:BaseSpecial){
        this.text = text;
        this.baseIndex = baseIndex;
        this.graphicsIndex = graphicsIndex;
        this.specialAbility = specialAbility;
    }
    
    getPlayerName(){
        return this.text.split("\n")[this.baseIndex];
    }
    
    getDescription(){
        return this.text.split("\n")[this.baseIndex+1];
    }
    
    getSpecialText(){
        return this.text.split("\n")[this.baseIndex+2];
    }
}