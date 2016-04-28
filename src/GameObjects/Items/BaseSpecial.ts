class BaseSpecial{
    specialCost:number;
    specialName:string;
    
    constructor(specialName:string, specialCost:number){
        this.specialName = specialName;
        this.specialCost = specialCost;
    }
    
    useSpecial(level:GameplayState){
        
    }
}