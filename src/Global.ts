class Global{
    static TILE_SIZE:number = 32;
    static ROOM_WIDTH:number = 11;
    static ROOM_HEIGHT:number = 11;
    
    static levelRooms:RoomInfoObject[];
    static levelNumber:number;
    static crateNumber:number;
    static currentX:number;
    static currentY:number;
    
    static getCurrentRoom():RoomInfoObject{
        return new RoomInfoObject(100, DifficultyEnum.Easy);
        //return Global.levelRooms[Global.currentX][Global.currentY];
    }
}