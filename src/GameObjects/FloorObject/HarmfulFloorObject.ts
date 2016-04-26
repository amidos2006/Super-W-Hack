class HarmfulFloorObject extends BaseGameObject{
    damage:number;
    time:number;
    explode:boolean;
    
    constructor(game:Phaser.Game, xTile:number, yTile:number, damage:number, time:number, explode:boolean){
        super(game, xTile * Global.TILE_SIZE, yTile * Global.TILE_SIZE);
        
        this.damage = damage;
        this.time = time;
        this.explode = explode;
    }
    
    killObject(){
        if(this.explode){
            
        }
        
        super.killObject();
    }
    
    updateStep(){
        if(this.time == 0){
            this.killObject();
            return;
        }
        
        this.time -= 1;
    }
}