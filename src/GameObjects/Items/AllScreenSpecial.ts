/// <reference path="BaseSpecial.ts"/>

class AllScreenSpecial extends BaseSpecial{
    constructor(){
        super("explosion", 2);
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
        damage[level.playerObject.getTilePosition().y][level.playerObject.getTilePosition().x] = 0;
        level.handleAttack(damage, true, false);
        level.add.existing(new WhiteLayer(level.game, 0, 0, 0.03));
        Global.audioManager.playSpecial(AudioManager.SPECIAL_GAT);
    }
}