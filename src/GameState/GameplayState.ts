class GameplayState extends BaseGameState{    
    currentDoors:DoorTile[];
    
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
    
    addDoor(direction:Phaser.Point, cleared:boolean){
        var tempDoor:DoorTile = new DoorTile(this.game, direction);
        tempDoor.lock();
        if(cleared){
            tempDoor.unlock();
        }
        this.game.add.existing(tempDoor);
        
        this.currentDoors.push(tempDoor);
    }
    
    createCurrentRoom(room:RoomInfoObject){
        this.game.rnd.sow([room.seed]);
        
        this.currentDoors = [];
        
        for(var x:number=0; x<Global.ROOM_WIDTH; x++){
            if(room.checkDoor(new Phaser.Point(0, -1)) && x == Math.floor(Global.ROOM_WIDTH / 2)){
                this.addDoor(new Phaser.Point(0, -1), room.cleared);
            }
            else{
                this.game.add.existing(new WallTile(this.game, x, 0));
            }
            if(room.checkDoor(new Phaser.Point(0, 1)) && x == Math.floor(Global.ROOM_WIDTH / 2)){
                this.addDoor(new Phaser.Point(0, 1), room.cleared);
            }
            else{
                this.game.add.existing(new WallTile(this.game, x, Global.ROOM_HEIGHT - 1));
            }
        }
        
        for(var y:number=0; y<Global.ROOM_HEIGHT; y++){
            if(room.checkDoor(new Phaser.Point(-1, 0)) && y == Math.floor(Global.ROOM_HEIGHT / 2)){
                this.addDoor(new Phaser.Point(-1, 0), room.cleared);
            }
            else{
                this.game.add.existing(new WallTile(this.game, 0, y));
            }
            if(room.checkDoor(new Phaser.Point(1, 0)) && y == Math.floor(Global.ROOM_HEIGHT / 2)){
                this.addDoor(new Phaser.Point(1, 0), room.cleared);
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
    
    update(){
        var direction:Phaser.Point = new Phaser.Point();
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            direction.y -= 1;
        }
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            direction.y += 1;
        }
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            direction.x -= 1;
        }
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            direction.x += 1;
        }
        
        if(direction.x != 0 && direction.y != 0){
            if(Math.random() < 0.5){
                direction.x = 0;
            }
            else{
                direction.y = 0;
            }
        }
        
        if(direction.x != 0 || direction.y != 0){
            this.game.input.keyboard.reset();
        }
    }
}