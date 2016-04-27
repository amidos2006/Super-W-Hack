class HarmfulFloorObject extends BaseGameObject{
    damage:number;
    time:number;
    exp:boolean;
    isAlive:boolean;
    
    constructor(game:Phaser.Game, xTile:number, yTile:number, damage:number, time:number, explode:boolean){
        super(game, xTile * Global.TILE_SIZE, yTile * Global.TILE_SIZE);
        
        this.damage = damage;
        this.time = time;
        this.exp = explode;
        this.isAlive = true;
    }
    
    explode(){
        var explosionDmg: number[][] = [];
        for (var y = 0; y < Global.ROOM_HEIGHT; y++) {
            explosionDmg.push([]);
            for (var x = 0; x < Global.ROOM_WIDTH; x++) {
                explosionDmg[y].push(0);
            }
        }

        var location: Phaser.Point = this.getTilePosition();
        for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
                if (location.x + x >= 0 && location.y + y >= 0 &&
                    location.x + x < Global.ROOM_WIDTH && location.y + y < Global.ROOM_HEIGHT) {
                    explosionDmg[location.y + y][location.x + x] = 3;
                }
            }
        }
        return explosionDmg;
    }
    
    updateStep(){
        if(this.time == 0){
            this.killObject();
            return;
        }
        
        this.time -= 1;
    }
    
    update(){
        super.update();
        var pl
    }
}