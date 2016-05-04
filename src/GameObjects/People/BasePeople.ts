class BasePeople{
    name:string;
    cost:number;
    renderIndex:number;
    
    constructor(name:string, cost:number, renderIndex:number){
        this.name = name;
        this.cost = cost;
        this.renderIndex = renderIndex;
    }
    
    applySpecial(game:Phaser.Game){
        Global.crateNumber = 0;
        Global.currentX = Global.entranceX;
        Global.currentY = Global.entranceY;
        Global.currentItem = null;
        game.state.start("gameplay", true);
    }
}