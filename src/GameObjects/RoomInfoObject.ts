/// <reference path="DifficultyEnum.ts"/>
/// <reference path="TileTypeEnum.ts"/>

class RoomInfoObject{
    tileMatrix:TileTypeEnum[][];
    cleared:boolean;
    difficulty:DifficultyEnum;
    connections:number;
    visited:boolean;
    
    constructor(difficulty:DifficultyEnum, random:Phaser.RandomDataGenerator){
        this.difficulty = difficulty;
        this.cleared = false;
        this.visited = false;
        this.connections = 0;
        this.constMatrix(random);
    }
    
    constMatrix(random:Phaser.RandomDataGenerator){
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
        
       var shapeSize:number = random.integerInRange(1, 4);
       var numberOfShapes:number = random.integerInRange(0, 3);
       if(numberOfShapes == 3){
           shapeSize = random.integerInRange(1, 3);
       }
       
       for(var s:number=0; s<numberOfShapes; s++){
            var pattern:Phaser.Point[] = [];
            var direction:Phaser.Point = new Phaser.Point();
            var tileType:number = TileTypeEnum.Wall;
            var tempX:number = random.integerInRange(1, Math.floor(Global.ROOM_WIDTH / 2) - 1);
            var tempY:number = random.integerInRange(1, Math.floor(Global.ROOM_HEIGHT / 2) - 1);
            for(var i:number=0; i<shapeSize; i++){
                pattern.push(new Phaser.Point(tempX + direction.x, tempY + direction.y));
                if(Math.random() < 0.5){
                    direction.x = random.integerInRange(0, 1) * 2 - 1;
                    if(x <= 1){
                        direction.x = 1;
                    }
                    if(x >= Global.ROOM_WIDTH / 2 - 1){
                        direction.x = -1;
                    }
                }
                else{
                    direction.y = random.integerInRange(0, 1) * 2 - 1;
                    if(y <= 1){
                        direction.y = 1;
                    }
                    if(y >= Global.ROOM_HEIGHT / 2 - 1){
                        direction.y = -1;
                    }
                }
            }
            var coverP:number = random.integerInRange(0, 3);
            for(var i:number=0; i<pattern.length; i++){
                var p:Phaser.Point = pattern[i];
                if(coverP == 0 || coverP == 1){
                    this.tileMatrix[p.x][p.y] = tileType;
                    this.tileMatrix[Global.ROOM_WIDTH - p.x - 1][p.y] = tileType;
                    this.tileMatrix[p.x][Global.ROOM_HEIGHT - p.y - 1] = tileType;
                    this.tileMatrix[Global.ROOM_WIDTH - p.x - 1][Global.ROOM_HEIGHT - p.y - 1] = tileType;
                }
                else if(coverP == 2){
                    this.tileMatrix[p.x][p.y] = tileType;
                    this.tileMatrix[Global.ROOM_WIDTH - p.x - 1][Global.ROOM_HEIGHT - p.y - 1] = tileType;
                }
                else if(coverP == 3){
                    this.tileMatrix[Global.ROOM_WIDTH - p.x - 1][p.y] = tileType;
                    this.tileMatrix[p.x][Global.ROOM_HEIGHT - p.y - 1] = tileType;
                }
            } 
       }
       
    }
    
    getMatrix(enemyList:EnemyObject[]){
        var returnMatrix:TileTypeEnum[][] = [];
        for(var x:number=0; x<Global.ROOM_WIDTH; x++){
            returnMatrix.push([]);
            for(var y:number=0; y<Global.ROOM_HEIGHT; y++){
                returnMatrix[x].push(this.tileMatrix[x][y]);
            }
        }
        
        for (var i = 0; i < enemyList.length; i++) {
            var enemyPosition:Phaser.Point = enemyList[i].getTilePosition();
            returnMatrix[enemyPosition.x][enemyPosition.y] = TileTypeEnum.Enemy;
        }
        
        if(this.cleared || (this.difficulty == DifficultyEnum.None && 
            !(Global.previousDirection.getMagnitude() == 0 && Global.levelNumber == 0))){
            if(this.checkDoor(new Phaser.Point(-1, 0))){
                returnMatrix[0][Math.floor(Global.ROOM_HEIGHT / 2)] = TileTypeEnum.Passable;
            }
            if(this.checkDoor(new Phaser.Point(1, 0))){
                returnMatrix[Global.ROOM_WIDTH - 1][Math.floor(Global.ROOM_HEIGHT / 2)] = TileTypeEnum.Passable;
            }
            if(this.checkDoor(new Phaser.Point(0, -1))){
                returnMatrix[Math.floor(Global.ROOM_WIDTH / 2)][0] = TileTypeEnum.Passable;
            }
            if(this.checkDoor(new Phaser.Point(0, 1))){
                returnMatrix[Math.floor(Global.ROOM_WIDTH / 2)][Global.ROOM_HEIGHT - 1] = TileTypeEnum.Passable;
            }
        }
        
        return returnMatrix;
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
        if(direction.x < 0 && direction.y == 0){
            return (this.connections & 0x1) > 0;
        }
        if(direction.x > 0 && direction.y == 0){
            return (this.connections & 0x2) > 0;
        }
        if(direction.y < 0 && direction.x == 0){
            return (this.connections & 0x4) > 0;
        }
        if(direction.y > 0 && direction.x == 0){
            return (this.connections & 0x8) > 0;
        }
        
        return false;
    }
}