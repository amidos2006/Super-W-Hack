class RoomInfoObject{
    tileMatrix:TileTypeEnum[][];
    cleared:boolean;
    difficulty:DifficultyEnum;
    connections:number;
    
    constructor(difficulty:DifficultyEnum){
        this.difficulty = difficulty;
        this.cleared = false;
        this.connections = 0;
        this.constMatrix();
    }
    
    constMatrix(){
        this.tileMatrix = [];
        for(var x:number=0; x<Global.ROOM_WIDTH; x++){
            this.tileMatrix.push([]);
            for(var y:number=0; y<Global.ROOM_HEIGHT; y++){
                this.tileMatrix[x].push(TileTypeEnum.Passable);
            }
        }
        
        for(var x:number=0; x<Global.ROOM_WIDTH; x++){
            this.tileMatrix[x][0] = TileTypeEnum.Wall;
            this.tileMatrix[x][Global.ROOM_HEIGHT - 1] = TileTypeEnum.Wall;
        }
        
        for(var y:number=0; y<Global.ROOM_HEIGHT; y++){
            this.tileMatrix[0][y] = TileTypeEnum.Wall;
            this.tileMatrix[Global.ROOM_WIDTH - 1][y] = TileTypeEnum.Wall;
        }
    }
    
    getMatrix(){
        if(this.cleared){
            if(this.checkDoor(new Phaser.Point(-1, 0))){
                this.tileMatrix[0][Math.floor(Global.ROOM_HEIGHT / 2)] = TileTypeEnum.Passable;
            }
            if(this.checkDoor(new Phaser.Point(1, 0))){
                this.tileMatrix[Global.ROOM_WIDTH - 1][Math.floor(Global.ROOM_HEIGHT / 2)] = TileTypeEnum.Passable;
            }
            if(this.checkDoor(new Phaser.Point(0, -1))){
                this.tileMatrix[Math.floor(Global.ROOM_WIDTH / 2)][0] = TileTypeEnum.Passable;
            }
            if(this.checkDoor(new Phaser.Point(0, 1))){
                this.tileMatrix[Math.floor(Global.ROOM_WIDTH / 2)][Global.ROOM_HEIGHT - 1] = TileTypeEnum.Passable;
            }
        }
        
        return this.tileMatrix;
    }
    
    setDoor(direction:Phaser.Point){
        if(direction.x < 0){
            this.connections |= 0x1;
        }
        if(direction.x > 0){
            this.connections |= 0x2;
        }
        if(direction.y < 0){
            this.connections |= 0x4;
        }
        if(direction.y > 0){
            this.connections |= 0x8;
        }
        
        this.tileMatrix[Math.floor((direction.x + 1) * Global.ROOM_WIDTH / 2) - Math.floor((direction.x + 1) / 2)]
            [Math.floor((direction.y + 1) * Global.ROOM_HEIGHT / 2) - Math.floor((direction.y + 1) / 2)] = TileTypeEnum.Door;
    }
    
    checkDoor(direction:Phaser.Point):boolean{
        if(direction.x < 0){
            return (this.connections & 0x1) > 0;
        }
        if(direction.x > 0){
            return (this.connections & 0x2) > 0;
        }
        if(direction.y < 0){
            return (this.connections & 0x4) > 0;
        }
        if(direction.y > 0){
            return (this.connections & 0x8) > 0;
        }
        
        return false;
    }
}