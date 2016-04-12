/// <reference path="BaseSpecial.ts"/>

class AllScreenSpecial extends BaseSpecial{
    constructor(){
        super(2);
    }
    
    useSpecial(level:GameplayState){
        super.useSpecial(level);
        var damage:number[][] = [];
        
        for (var x = 0; x < Global.ROOM_WIDTH; x++) {
            damage.push([]);
            for (var y = 0; y < Global.ROOM_HEIGHT; y++) {
                damage[x].push(1);
            } 
        }
        
        level.handleAttack(damage);
        Global.audioManager.playSpecial(AudioManager.SPECIAL_GAT);
    }
}