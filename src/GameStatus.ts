class GameStatus{
    normalWin:number;
    normalDeath:number;
    normalScore:number;
    
    arcadeMaxCrates:number;
    arcadeTotalCrates:number;
    arcadePlays:number;
    
    constructor(){
        this.resetValues();
    }
    
    saveStatus(){
        var date = new Date();
        date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000)
        var value:string = "normalWin=" + this.normalWin + 
            " normalDeath=" + this.normalDeath +
            " normalScore=" + this.normalScore +
            " arcadeMaxCrates=" + this.arcadeTotalCrates +
            " arcadeTotalCrates=" + this.arcadeTotalCrates +
            " arcadePlays=" + this.arcadePlays +
            " expires=" + date.toUTCString() +
            " path=/";
        document.cookie = value;
    }
    
    loadStatus(){
        var array:string[] = (<string>document.cookie).split(" ");
        for(var i:number=0; i<array.length; i++){
            var key:String = array[i].split("=")[0];
            var value:String = array[i].split("=")[1];
            if(key.trim() == "normalWin"){
                this.normalWin = Number(value.trim());
            }
            if(key.trim() == "normalDeath"){
                this.normalDeath = Number(value.trim());
            }
            if(key.trim() == "normalScore"){
                this.normalScore = Number(value.trim());
            }
            if(key.trim() == "arcadeMaxCrates"){
                this.arcadeMaxCrates = Number(value.trim());
            }
            if(key.trim() == "arcadeTotalCrates"){
                this.arcadeTotalCrates = Number(value.trim());
            }
            if(key.trim() == "arcadePlays"){
                this.arcadePlays = Number(value.trim());
            }
        }
    }
    
    resetValues(){
        this.normalWin = 0;
        this.normalDeath = 0;
        this.normalScore = 0;
        
        this.arcadePlays = 0;
        this.arcadeTotalCrates = 0;
        this.arcadeMaxCrates = 0;
    }
}