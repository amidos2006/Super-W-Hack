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
    static WEAPON_PATTERN_SIZE:number = 5;
    static ROOM_WIDTH:number = 11;
    static ROOM_HEIGHT:number = 11;
    static MAX_LVL_CATEGORY:number = 1;
    static MAX_DEPTH:number = 5;
    
    static gameController:GameController;
    static weaponNameGenerator:WeaponNameGenerator;
    static audioManager:AudioManager;
    static levelRooms:RoomInfoObject[][];
    static levelNumber:number = 0;
    static levelName:string = "";
    static levelCategory:number = 0;
    static levelMusic:number = 0;
    static crateNumber:number = 0;
    static totalCrateNumber:number = 0;
    static scoreNumber:number = 0;
    static difficultyNumber:number = 0;
    static itemUsage:number = 0;
    static currentWeapon:Weapon = null;
    static currentPlayer:BasePlayerData = null;
    static currentItem:BasePeople = null;
    static currentX:number = 0;
    static currentY:number = 0;
    static entranceX:number = 0;
    static entranceY:number = 0;
    static mapWidth:number = 0;
    static mapHeight:number = 0;
    static previousDirection:Phaser.Point;
    static currentGameMode:GameplayModes;
    
    static enemyNumbers:EnemyNumbers;
    static enemyTypes:EnemyTypes;
    static itemTypes:ItemTypes;
    static gameStatus:GameStatus;
    
    static initialize(text1:string, text2:string, text3:string, random:Phaser.RandomDataGenerator){
        Global.levelNumber = 0;
        Global.crateNumber = 0;
        Global.totalCrateNumber = 0;
        Global.scoreNumber = 0;
        Global.currentWeapon = null;
        Global.currentPlayer = null;
        Global.currentItem = null;
        Global.itemUsage = 0;
        switch(Global.currentGameMode){
            case GameplayModes.adventure:
                Global.constructLevelName(text1, text2, text3, random);
                Global.constructLevel(random);
            break;
            case GameplayModes.arcade:
                Global.constructSingleLevel(random);
            break;
        }
    }
    
    static constructLevelName(inputText1:string, inputText2:string, inputText3:string, random:Phaser.RandomDataGenerator){
        Global.MAX_LVL_CATEGORY = inputText1.split("\n").length;
        Global.levelCategory = random.integerInRange(0, Global.MAX_LVL_CATEGORY - 1);
        var sizeChoice:number = Math.floor(AudioManager.AMOUNT_OF_MUSIC / Global.MAX_LVL_CATEGORY);
        Global.levelMusic = random.integerInRange(0, sizeChoice - 1);
        var i1:number = random.integerInRange(0, inputText1.split("\n")[Global.levelCategory].split(",").length - 1);
        var i2:number = random.integerInRange(0, inputText2.split(",").length-1);
        var i3:number = random.integerInRange(0, inputText3.split(",").length-1);
        
        var f1:string = inputText1.split("\n")[Global.levelCategory].split(",")[i1].trim();
        var f2:string = inputText2.split(",")[i2].trim();
        var f3:string = inputText3.split(",")[i3].trim();
        
        Global.levelName = "The " + f1 + " of the " + f2 + " " + f3;
    }
    
    static getCurrentCost(){
        if(Global.itemUsage == 0){
            return 1;
        }
        return Math.pow(2, Global.itemUsage - 1) * Global.currentPlayer.specialAbility.specialCost;
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
    
    static matrixReflectX(matrix:TileTypeEnum[][]){
        var result:TileTypeEnum[][] = [];
        
        for(var x:number = 0; x < matrix.length; x++){
            result.push([])
            for(var y:number = 0; y < matrix[x].length; y++){
                result[x].push(matrix[matrix.length - x - 1][y]);
            }
        }
        
        return result;
    }
    
    static getEmptyTiles(tiles:TileTypeEnum[][]){
        var result:Phaser.Point[] = [];
        for (var x = 0; x < tiles.length; x++) {
            for (var y = 0; y < tiles[x].length; y++) {
                if(tiles[x][y] == TileTypeEnum.Passable){
                    result.push(new Phaser.Point(x, y));
                }
            }
        }
        return result;
    }
    
    static constructSingleLevel(random:Phaser.RandomDataGenerator, influence:RoomTypeEnum = -1){
        Global.previousDirection = new Phaser.Point(0, 1);
        
        Global.mapWidth = 1;
        Global.mapHeight = 1;
        Global.levelRooms = [[new RoomInfoObject(RoomTypeEnum.Spawning, random)]];
        if(influence != -1){
            Global.levelRooms = [[new RoomInfoObject(influence, random)]];
        }
        Global.currentX = 0;
        Global.currentY = 0;
    }
    
    static constructLevel(random:Phaser.RandomDataGenerator){
        Global.previousDirection = new Phaser.Point(0, 0);
        Global.difficultyNumber = 0;
        
        var probabilityOfEmptyPlace:number = 0.08;
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
        
        if(Global.levelNumber == Global.MAX_DEPTH - 1){
            Global.currentX = Math.floor(Global.mapWidth / 2);
            Global.currentY = Math.floor(Global.mapHeight / 2) + 1;
            Global.entranceX = Global.currentX;
            Global.entranceY = Global.currentY;
            Global.levelRooms[Global.currentX][Global.currentY] = new RoomInfoObject(RoomTypeEnum.None, random);
            Global.levelRooms[Global.currentX][Global.currentY].cleared = true;
            Global.levelRooms[Global.currentX][Global.currentY].setDoor(new Phaser.Point(0, -1));
            Global.levelRooms[Global.currentX][Global.currentY - 1] = new RoomInfoObject(RoomTypeEnum.None, random);
            Global.levelRooms[Global.currentX][Global.currentY - 1].setDoor(new Phaser.Point(0, 1));
            Global.levelRooms[Global.currentX][Global.currentY - 1].setDoor(new Phaser.Point(0, -1));
            Global.levelRooms[Global.currentX][Global.currentY - 2] = new RoomInfoObject(RoomTypeEnum.Boss, random);
            Global.levelRooms[Global.currentX][Global.currentY - 2].setDoor(new Phaser.Point(0, 1));
            return;
        }
        
        var sets:RoomSet[] = [];
        
        var queue:Phaser.Point[] = [new Phaser.Point(random.integerInRange(0, Global.mapWidth - 1), 
            random.integerInRange(0, Global.mapHeight - 1))];
        Global.currentX = queue[0].x;
        Global.currentY = queue[0].y;
        Global.entranceX = Global.currentX;
        Global.entranceY = Global.currentY;
        var roomNumbers:number = 0;
        while(queue.length != 0 && roomNumbers / (Global.mapWidth * Global.mapHeight) < precentageCovered){
            var p:Phaser.Point = queue.splice(random.integerInRange(0, queue.length - 1), 1)[0];
            if(Global.levelRooms[p.x][p.y] == null){
                var roomType:RoomTypeEnum = RoomTypeEnum.Enemy;
                if(Math.random() < probabilityOfEmptyPlace){
                    roomType = RoomTypeEnum.None;
                    if(Global.itemTypes.isItemRoom(Global.levelNumber)){
                        roomType = RoomTypeEnum.Item;
                    }
                }
                Global.levelRooms[p.x][p.y] = new RoomInfoObject(roomType, random);
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
        
        Global.levelRooms[Global.currentX][Global.currentY].roomType = RoomTypeEnum.None;
        if(Global.levelNumber > 0){
            Global.levelRooms[Global.currentX][Global.currentY].cleared = true;
        }
        
        while(sets.length > 1){
            var firstIndex:number = random.integerInRange(0, sets.length - 1);
            var secondIndex:number = (firstIndex + random.integerInRange(1, sets.length - 1)) % sets.length;
            
            var connections:Phaser.Point[] = sets[firstIndex].getListOfConnections(sets[secondIndex]);
            if(connections.length > 0){
                sets[firstIndex].combine(sets[secondIndex]);
                sets.splice(secondIndex, 1);
                var numConn:number = random.integerInRange(1, connections.length / 2);
                for(var i:number=0; i<numConn; i++){
                    var randomIndex:number = random.integerInRange(0, connections.length / 2 - 1);
                    var fRoom:Phaser.Point = connections.splice(2*randomIndex + 1, 1)[0];
                    var sRoom:Phaser.Point = connections.splice(2*randomIndex, 1)[0];
                                  
                    Global.levelRooms[fRoom.x][fRoom.y].setDoor(new Phaser.Point(sRoom.x - fRoom.x, sRoom.y - fRoom.y));
                    Global.levelRooms[sRoom.x][sRoom.y].setDoor(new Phaser.Point(fRoom.x - sRoom.x, fRoom.y - sRoom.y));
                }
            }
        }
        
        var bossRooms:Phaser.Point[] = [];
        for (var x = 0; x < Global.mapWidth; x++) {
            for (var y = 0; y < Global.mapHeight; y++) {
                if (Global.levelRooms[x][y] != null &&
                    Global.levelRooms[x][y].roomType == RoomTypeEnum.None &&
                    Global.levelRooms[x][y].getNumberOfConnection() <= 1 &&
                    !(x == Global.currentX && y == Global.currentY)) {
                    Global.levelRooms[x][y].roomType = RoomTypeEnum.Enemy;
                }
                if (Global.levelRooms[x][y] != null &&
                    Global.levelRooms[x][y].getNumberOfConnection() <= 1 &&
                    !(x == Global.currentX && y == Global.currentY)) {
                    bossRooms.push(new Phaser.Point(x, y));
                }
            }
        }
        
        if(Global.levelNumber >= Global.MAX_DEPTH - 1){
            var index:number = random.integerInRange(0, bossRooms.length - 1);
            Global.levelRooms[bossRooms[i].x][bossRooms[i].y].roomType = RoomTypeEnum.Boss;
        }
    }
    
    static getCurrentRoom():RoomInfoObject{
        return Global.levelRooms[Global.currentX][Global.currentY];
    }
    
    static isDungeonFinished(){
        for (var x = 0; x < Global.mapWidth; x++) {
            for (var y = 0; y < Global.mapHeight; y++) {
                if(Global.levelRooms[x][y] != null && !(Global.currentX == x && Global.currentY == y) &&
                    (!Global.levelRooms[x][y].cleared && 
                    Global.levelRooms[x][y].roomType != RoomTypeEnum.None)){
                        return false;
                }
            }  
        }
        return true;
    }
}