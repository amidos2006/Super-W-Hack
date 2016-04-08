class RoomSet{
    rooms:Phaser.Point[];
    
    constructor(p:Phaser.Point){
        this.rooms = [p];
    }
    
    combine(set:RoomSet){
        for(var i:number=0; i<set.rooms.length; i++){
            this.rooms.push(set.rooms[i]);
        }
    }
    
    getListOfConnections(set:RoomSet){
        var result:Phaser.Point[] = [];
        for(var i:number=0; i<this.rooms.length; i++){
            for(var j:number=0; j<set.rooms.length; j++){
                var d:Phaser.Point = new Phaser.Point(this.rooms[i].x - set.rooms[j].x, 
                    this.rooms[i].y - set.rooms[j].y);
                if(d.getMagnitude() == 1){
                    result.push(this.rooms[i]);
                    result.push(set.rooms[j]);
                }
            }
        }
        
        return result;
    }
}

class Global{
    static TILE_SIZE:number = 32;
    static MAP_SIZE:number = 10;
    static ROOM_WIDTH:number = 11;
    static ROOM_HEIGHT:number = 11;
    
    static levelRooms:RoomInfoObject[][];
    static levelNumber:number = 0;
    static levelName:string = "";
    static crateNumber:number = 0;
    static itemUsage:number = 0;
    static currentWeapon:Weapon = null;
    static currentPlayer:BasePlayerData = null;
    static currentX:number = 0;
    static currentY:number = 0;
    static mapWidth:number = 0;
    static mapHeight:number = 0;
    static previousDirection:Phaser.Point;
    
    static initialize(text:string, random:Phaser.RandomDataGenerator){
        Global.levelNumber = 0;
        Global.crateNumber = 0;
        Global.currentWeapon = null;
        Global.currentPlayer = null;
        Global.itemUsage = 0;
        Global.previousDirection = new Phaser.Point(0, 0);
        EnemyObject.enemySpriteNumbers = Phaser.ArrayUtils.shuffle(EnemyObject.enemySpriteNumbers);
        EnemyObject.enemySpriteNumbers.push(EnemyObject.enemySpriteNumbers[EnemyObject.enemySpriteNumbers.length - 1]);
        Global.constructLevelName(text, random);
    }
    
    static constructLevelName(inputText:string, random:Phaser.RandomDataGenerator){
        var text:string[] = inputText.split("\n");
        var f1:string = text[random.integerInRange(0, text.length-1)].split(",")[0].trim();
        var f2:string = text[random.integerInRange(0, text.length-1)].split(",")[1].trim();
        var f3:string = text[random.integerInRange(0, text.length-1)].split(",")[2].trim();
        
        Global.levelName = "The " + f1 + " of the " + f2 + " " + f3;
    }
    
    static getCurrentCost(){
        return Math.pow(2, Global.itemUsage) * Global.currentPlayer.specialAbility.specialCost;
    }
    
    static matrixTranspose(matrix:TileTypeEnum[][]){
        var result:TileTypeEnum[][] = [];
        
        for(var y:number = 0; y < matrix[0].length; y++){
            result.push([])
            for(var x:number = 0; x < matrix.length; x++){
                result[y].push(matrix[x][y]);
            }
        }
        
        return result;
    }
    
    static constructLevel(random:Phaser.RandomDataGenerator){
        var probabilityOfEmptyPlace:number = 0.15;
        var precentageCovered:number = 0.6;
        
        Global.mapWidth = random.integerInRange(4, 5);
        Global.mapHeight = random.integerInRange(3, 4);
        
        Global.levelRooms = [];
        for(var x:number=0; x<Global.mapWidth; x++){
            Global.levelRooms.push([]);
            for(var y:number=0; y<Global.mapHeight; y++){
                Global.levelRooms[x].push(null);
            }
        }
        
        var sets:RoomSet[] = [];
        
        var queue:Phaser.Point[] = [new Phaser.Point(random.integerInRange(0, Global.mapWidth - 1), 
            random.integerInRange(0, Global.mapHeight - 1))];
        Global.currentX = queue[0].x;
        Global.currentY = queue[0].y;
        var roomNumbers:number = 0;
        while(queue.length != 0 && roomNumbers / (Global.mapWidth * Global.mapHeight) < precentageCovered){
            var p:Phaser.Point = queue.splice(random.integerInRange(0, queue.length - 1), 1)[0];
            if(Global.levelRooms[p.x][p.y] == null){
                var diff:number = random.integerInRange(1, 3);
                if(Math.random() < probabilityOfEmptyPlace){
                    diff = 0;
                }
                Global.levelRooms[p.x][p.y] = new RoomInfoObject(diff, random);
                sets.push(new RoomSet(p));
                roomNumbers += 1;
            }
            for(var x:number=-1; x<=1; x++){
                for(var y:number=-1; y<=1; y++){
                    if(Math.abs(x) + Math.abs(y) == 1){
                        if(p.x + x >=0 && p.x + x < Global.mapWidth && 
                            p.y + y >= 0 && p.y + y < Global.mapHeight){
                            queue.push(new Phaser.Point(p.x + x, p.y + y));
                        }
                    }
                }
            }
        }
        
        Global.levelRooms[Global.currentX][Global.currentY].difficulty = DifficultyEnum.None;
        Global.levelRooms[Global.currentX][Global.currentY].cleared = true;
        
        while(sets.length > 1){
            var firstIndex:number = random.integerInRange(0, sets.length - 1);
            var secondIndex:number = (firstIndex + random.integerInRange(1, sets.length - 1)) % sets.length;
            
            var connections:Phaser.Point[] = sets[firstIndex].getListOfConnections(sets[secondIndex]);
            if(connections.length > 0){
                sets[firstIndex].combine(sets[secondIndex]);
                sets.splice(secondIndex, 1);
                var numConn:number = random.integerInRange(1, connections.length / 2);
                console.log(connections.length / 2);
                for(var i:number=0; i<numConn; i++){
                    var randomIndex:number = random.integerInRange(0, connections.length / 2 - 1);
                    var fRoom:Phaser.Point = connections.splice(2*randomIndex + 1, 1)[0];
                    var sRoom:Phaser.Point = connections.splice(2*randomIndex, 1)[0];
                    console.log(numConn + " " + connections.length)
                                  
                    Global.levelRooms[fRoom.x][fRoom.y].setDoor(new Phaser.Point(sRoom.x - fRoom.x, sRoom.y - fRoom.y));
                    Global.levelRooms[sRoom.x][sRoom.y].setDoor(new Phaser.Point(fRoom.x - sRoom.x, fRoom.y - sRoom.y));
                }
            }
        }
    }
    
    static getCurrentRoom():RoomInfoObject{
        return Global.levelRooms[Global.currentX][Global.currentY];
    }
}