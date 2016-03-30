class Global{
    static TILE_SIZE:number = 32;
    static ROOM_WIDTH:number = 11;
    static ROOM_HEIGHT:number = 11;
    
    static levelRooms:RoomInfoObject[][];
    static levelNumber:number = 0;
    static crateNumber:number = 0;
    static currentX:number = 0;
    static currentY:number = 0;
    static mapWidth:number = 0;
    static mapHeight:number = 0;
    static previousDirection:Phaser.Point = new Phaser.Point();
    
    static initialize(){
        Global.levelNumber = 0;
        Global.crateNumber = 0;
    }
    
    static constructLevel(random:Phaser.RandomDataGenerator){
        var probabilityOfEmptyPlace:number = 0.1;
        var precentageCovered:number = 0.5;
        
        Global.mapWidth = random.integerInRange(4, 5);
        Global.mapHeight = random.integerInRange(3, 4);
        
        Global.levelRooms = [];
        for(var x:number=0; x<Global.mapWidth; x++){
            Global.levelRooms.push([]);
            for(var y:number=0; y<Global.mapHeight; y++){
                Global.levelRooms[x].push(null);
            }
        }
        
        var queue:Phaser.Point[] = [new Phaser.Point(random.integerInRange(0, Global.mapWidth - 1), 
            random.integerInRange(0, Global.mapHeight - 1))];
        var roomNumbers:number = 0;
        while(queue.length != 0 && roomNumbers / (Global.mapWidth * Global.mapHeight) < precentageCovered){
            var p:Phaser.Point = queue.splice(random.integerInRange(0, queue.length - 1), 1)[0];
            if(Global.levelRooms[p.x][p.y] == null){
                var diff:number = random.integerInRange(1, 4);
                if(Math.random() < probabilityOfEmptyPlace){
                    diff = 0;
                }
                Global.levelRooms[p.x][p.y] = new RoomInfoObject(diff);
                roomNumbers += 1;
            }
            for(var x:number=-1; x<=1; x++){
                for(var y:number=-1; y<=1; y++){
                    if(x != 0 || y!= 0){
                        if(p.x + x >=0 && p.x + x < Global.mapWidth && 
                            p.y + y >= 0 && p.y + y < Global.mapHeight){
                            queue.push(new Phaser.Point(p.x + x, p.y + y));
                        }
                    }
                }
            }
        }
    }
    
    static getCurrentRoom():RoomInfoObject{
        var tempRoom:RoomInfoObject = new RoomInfoObject(DifficultyEnum.Easy);
        tempRoom.setDoor(new Phaser.Point(0, 1));
        tempRoom.setDoor(new Phaser.Point(1, 0));
        tempRoom.setDoor(new Phaser.Point(-1, 0));
        tempRoom.setDoor(new Phaser.Point(0, -1));
        tempRoom.cleared = true;
        return tempRoom;
        //return Global.levelRooms[Global.currentX][Global.currentY];
    }
}