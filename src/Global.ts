class Global{
    static TILE_SIZE:number = 32;
    static ROOM_WIDTH:number = 11;
    static ROOM_HEIGHT:number = 11;
    
    static levelRooms:RoomInfoObject[][];
    static levelNumber:number;
    static crateNumber:number;
    static currentX:number;
    static currentY:number;
    
    static getCurrentRoom():RoomInfoObject{
        var tempRoom:RoomInfoObject = new RoomInfoObject(DifficultyEnum.Easy);
        tempRoom.setDoor(new Phaser.Point(0, 1));
        tempRoom.setDoor(new Phaser.Point(1, 0));
        tempRoom.setDoor(new Phaser.Point(-1, 0));
        tempRoom.setDoor(new Phaser.Point(0, -1));
        //tempRoom.cleared = true;
        return tempRoom;
        //return Global.levelRooms[Global.currentX][Global.currentY];
    }
}