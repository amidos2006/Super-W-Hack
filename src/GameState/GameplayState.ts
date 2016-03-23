class GameplayState extends BaseGameState{
    constructor(){
        super();
    }
    
    preload(){
        this.game.load.spritesheet("graphics", "assets/graphics/gameGraphics.png", 32, 32);
    }
    
    create(){
        super.create();        
        
        this.createCurrentRoom(Global.getCurrentRoom());
    }
    
    addDoor(x:number, y:number, cleared:boolean){
        var tempDoor:DoorTile = new DoorTile(this.game, x, y);
        tempDoor.lock();
        if(cleared){
            tempDoor.unlock();
        }
        this.game.add.existing(tempDoor);
    }
    
    createCurrentRoom(room:RoomInfoObject){
        this.game.rnd.sow([room.seed]);
        
        for(var x:number=0; x<Global.ROOM_WIDTH; x++){
            if(room.checkDoor(new Phaser.Point(0, -1)) && x == Math.floor(Global.ROOM_WIDTH / 2)){
                this.addDoor(x, 0, room.cleared);
            }
            else{
                this.game.add.existing(new WallTile(this.game, x, 0));
            }
            if(room.checkDoor(new Phaser.Point(0, 1)) && x == Math.floor(Global.ROOM_WIDTH / 2)){
                this.addDoor(x, Global.ROOM_HEIGHT - 1, room.cleared);
            }
            else{
                this.game.add.existing(new WallTile(this.game, x, Global.ROOM_HEIGHT - 1));
            }
        }
        
        for(var y:number=0; y<Global.ROOM_HEIGHT; y++){
            if(room.checkDoor(new Phaser.Point(-1, 0)) && y == Math.floor(Global.ROOM_HEIGHT / 2)){
                this.addDoor(0, y, room.cleared);
            }
            else{
                this.game.add.existing(new WallTile(this.game, 0, y));
            }
            if(room.checkDoor(new Phaser.Point(1, 0)) && y == Math.floor(Global.ROOM_HEIGHT / 2)){
                this.addDoor(Global.ROOM_WIDTH - 1, y, room.cleared);
            }
            else{
                this.game.add.existing(new WallTile(this.game, Global.ROOM_WIDTH - 1, y));
            }
        }
        
        for(var x:number=1; x<Global.ROOM_WIDTH - 1; x++){
            for(var y:number=1; y<Global.ROOM_HEIGHT - 1; y++){
                this.game.add.existing(new EmptyTile(this.game, x, y));
            }
        }
    }
}