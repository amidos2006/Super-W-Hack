class GameplayState extends BaseGameState{    
    currentDoors:DoorTile[];
    highlightTiles:HighlightTile[];
    playerObject:PlayerObject;
    lastDirection:Phaser.Point;
    
    constructor(){
        super();
    }
    
    preload(){
        this.game.load.spritesheet("graphics", "assets/graphics/gameGraphics.png", 32, 32);
    }
    
    create(){
        super.create();        
        
        this.createCurrentRoom(Global.getCurrentRoom());
        this.lastDirection = new Phaser.Point(0, 1);
        Global.constructLevel(this.game.rnd);
    }
    
    highlight(damageMatrix:number[][]){
        this.unhighlight();
        
        var index:number = 0;
        for(var y:number=0; y<Global.ROOM_HEIGHT; y++){
            for(var x:number=0; x<Global.ROOM_WIDTH; x++){
                if(damageMatrix[x][y] > 0){
                    this.highlightTiles[index].x = x * Global.TILE_SIZE;
                    this.highlightTiles[index].y = y * Global.TILE_SIZE;
                    this.highlightTiles[index].show();
                    index++;
                }
            }
        }
    }
    
    unhighlight(){
        for(var i:number=0; i<this.highlightTiles.length; i++){
            this.highlightTiles[i].hide();
        }
    }
    
    isHighlighted(){
        return this.highlightTiles[0].alpha == 1;
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
        this.currentDoors = [];
        
        for(var x:number=0; x<Global.ROOM_WIDTH; x++){
            for(var y:number=0; y<Global.ROOM_HEIGHT; y++){
                switch(room.tileMatrix[x][y]){
                    case TileTypeEnum.Passable:
                    this.game.add.existing(new EmptyTile(this.game, x, y));
                    break;
                    case TileTypeEnum.Wall:
                    this.game.add.existing(new WallTile(this.game, x, y));
                    break;
                    case TileTypeEnum.Door:
                    if(x == 0){
                        this.addDoor(new Phaser.Point(-1, 0), room.cleared);
                    }
                    if(x == Global.ROOM_WIDTH - 1){
                        this.addDoor(new Phaser.Point(1, 0), room.cleared);
                    }
                    if(y == 0){
                        this.addDoor(new Phaser.Point(0, -1), room.cleared);
                    }
                    if(y == Global.ROOM_HEIGHT - 1){
                        this.addDoor(new Phaser.Point(0, 1), room.cleared);
                    }
                    break;
                }   
            }
        }
        
        this.highlightTiles = [];
        for(var i:number=0; i< 2 * (Global.ROOM_WIDTH + Global.ROOM_HEIGHT); i++){
            var tempTile:HighlightTile = new HighlightTile(this.game)
            this.highlightTiles.push(tempTile);
            this.game.add.existing(tempTile);
        }
        
        this.playerObject = new PlayerObject(this.game, Math.floor(Global.ROOM_WIDTH / 2) + 
            Global.previousDirection.x * (Math.floor(Global.ROOM_WIDTH / 2) - 1), 
            Math.floor(Global.ROOM_HEIGHT / 2) + 
            Global.previousDirection.y * (Math.floor(Global.ROOM_HEIGHT / 2) - 1),
            WeaponGenerator.GenerateWeapon(null, this.game.rnd));
        this.game.add.existing(this.playerObject);
    }

    stepUpdate(){
        //enemies move
        
        var playerPosition:Phaser.Point = this.playerObject.getTilePosition();
        for(var i:number=0; i<this.currentDoors.length; i++){
            if(this.currentDoors[i].checkCollision(playerPosition.x, playerPosition.y)){
                Global.currentX += this.currentDoors[i].direction.x;
                Global.currentY += this.currentDoors[i].direction.y;
                Global.previousDirection.set(-this.currentDoors[i].direction.x, -this.currentDoors[i].direction.y);
                this.game.state.start("gameplay", true);
                break;
            }
        }
    }
    
    update(){
        super.update();
        
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
        
        if(this.isHighlighted()){
            if(direction.x != 0 || direction.y != 0){
                this.lastDirection = direction;
                this.highlight(this.playerObject.getWeapon().getWeaponPositions(
                    this.playerObject.getTilePosition(), this.lastDirection, 
                    Global.getCurrentRoom().getMatrix()));
                this.game.input.keyboard.reset();
            }
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.X)){
                this.unhighlight();
                this.playerObject.getWeapon().fireWeapon();
                this.stepUpdate();
                this.game.input.keyboard.reset();
            }
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.Z)){
                this.unhighlight();
                this.game.input.keyboard.reset();
            }
        }
        else{
            if(direction.x != 0 || direction.y != 0){
                this.lastDirection = direction;
                this.playerObject.move(direction, Global.getCurrentRoom().getMatrix());
                this.stepUpdate();
                this.game.input.keyboard.reset();
            }
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.X)){
                this.highlight(this.playerObject.getWeapon().getWeaponPositions(
                    this.playerObject.getTilePosition(), this.lastDirection, 
                    Global.getCurrentRoom().getMatrix()));
                console.log(this.playerObject.getWeapon().shape);
                this.game.input.keyboard.reset();
            }
        }
        
    }
}