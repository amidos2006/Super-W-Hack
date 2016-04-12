/// <reference path="BaseGameState.ts"/>
/// <reference path="../GameObjects/FloorTiles/DoorTile.ts"/>
/// <reference path="../GameObjects/FloorTiles/HighlightTile.ts"/>
/// <reference path="../GameObjects/FloorTiles/DirHighlightTile.ts"/>
/// <reference path="../GameObjects/BoxObject.ts"/>
/// <reference path="../GameObjects/Enemy/EnemyObject.ts"/>
/// <reference path="../GameObjects/PlayerObject.ts"/>
/// <reference path="../GameObjects/HUDElements/MiniMap.ts"/>

class GameplayState extends BaseGameState{    
    currentDoors:DoorTile[];
    highlightTiles:HighlightTile[];
    arrowHighlight:DirHighlightTile;
    playerObject:PlayerObject;
    enemyObjects:EnemyObject[];
    boxObject:BoxObject;
    lastDirection:Phaser.Point;
    miniMap:MiniMap;
    buttonText:ButtonTutorial;
    
    constructor(){
        super();
    }
    
    create(){
        super.create();        
        
        this.createCurrentRoom(Global.getCurrentRoom());
        this.lastDirection = new Phaser.Point(-Global.previousDirection.x, -Global.previousDirection.y);
        if(this.lastDirection.getMagnitude() == 0){
            this.lastDirection.y = 1;
        }
        Global.levelRooms[Global.currentX][Global.currentY].visited = true;
        this.createHUDElements();
    }
    
    createHUDElements(){
        this.miniMap = new MiniMap(this.game, this.game.width - (Global.mapWidth + 1.5) * Global.MAP_SIZE, 
            this.game.height - (this.game.height - this.game.width) / 2 - Global.mapHeight * Global.MAP_SIZE / 2 + 5);
        this.game.add.existing(this.miniMap);
        
        this.buttonText = new ButtonTutorial(this.game, 5, this.game.height);
        this.game.add.existing(this.buttonText);
        
        this.game.add.existing(new CrateText(this.game, this.game.width/2, this.game.height - 
            (this.game.height - this.game.width) + 25));
        this.game.add.existing(new LevelName(this.game, this.game.width/2, 5));
        this.game.add.existing(new WhiteLayout(this.game, -this.game.camera.x, -this.game.camera.y));
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
                        this.addDoor(new Phaser.Point(-1, 0), room.cleared || room.difficulty == DifficultyEnum.None);
                    }
                    if(x == Global.ROOM_WIDTH - 1){
                        this.addDoor(new Phaser.Point(1, 0), room.cleared || room.difficulty == DifficultyEnum.None);
                    }
                    if(y == 0){
                        this.addDoor(new Phaser.Point(0, -1), room.cleared || room.difficulty == DifficultyEnum.None);
                    }
                    if(y == Global.ROOM_HEIGHT - 1){
                        this.addDoor(new Phaser.Point(0, 1), room.cleared || room.difficulty == DifficultyEnum.None);
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
        this.arrowHighlight = new DirHighlightTile(this.game);
        this.game.add.existing(this.arrowHighlight);
        
        if(Global.currentWeapon == null){
            Global.currentWeapon = WeaponGenerator.GenerateWeapon(null, this.game.rnd, null, Global.weaponNameGenerator);
        }
        
        if(Global.currentPlayer == null){
            Global.currentPlayer = new TatPlayerData(this.game.cache.getText("playerdata"));
        }
        
        this.boxObject = new BoxObject(this.game);
        this.game.add.existing(this.boxObject);
        
        this.enemyObjects = [];
        var numOfEnemies:number = 6;
        if(room.cleared){
            numOfEnemies = 0;
        }
        var tiles:TileTypeEnum[][] = room.getMatrix(this.enemyObjects);
        for (var dx = -2; dx <= 2; dx++) {
            for (var dy = -2; dy <= 2; dy++) {
                if(dy > -2){
                    tiles[Math.floor(Global.ROOM_WIDTH / 2) + dx][1 + dy] = TileTypeEnum.Wall;
                }
                if(dy < 2){
                    tiles[Math.floor(Global.ROOM_WIDTH / 2) + dx][Global.ROOM_HEIGHT - 2 + dy] = TileTypeEnum.Wall;
                }
                if(dx > -2){
                    tiles[1 + dx][Math.floor(Global.ROOM_HEIGHT / 2) + dy] = TileTypeEnum.Wall;
                }
                if(dx < 2){
                    tiles[Global.ROOM_WIDTH - 2 + dx][Math.floor(Global.ROOM_HEIGHT / 2) + dy] = TileTypeEnum.Wall;
                }
            }
        }
        
        for(var i:number=0; i<numOfEnemies; i++){
            var list:Phaser.Point[] = this.getEmptyTiles(tiles);
            var point:Phaser.Point = list[this.game.rnd.integerInRange(0, list.length - 1)];
            tiles[point.x][point.y] = TileTypeEnum.Enemy;
            
            var tempEnemy:EnemyObject = EnemyObject.getEnemey(this.game, point.x, point.y, null);
            this.enemyObjects.push(tempEnemy);
            this.game.add.existing(tempEnemy);
        }
        
        this.playerObject = new PlayerObject(this.game, Math.floor(Global.ROOM_WIDTH / 2) + 
                Global.previousDirection.x * (Math.floor(Global.ROOM_WIDTH / 2) - 1), 
                Math.floor(Global.ROOM_HEIGHT / 2) + 
                Global.previousDirection.y * (Math.floor(Global.ROOM_HEIGHT / 2) - 1), 
                Global.currentWeapon);
        this.game.add.existing(this.playerObject);
        
        if(room.difficulty == DifficultyEnum.None && !room.cleared){
            this.showBoxObject(new Phaser.Point(Math.floor(Global.ROOM_WIDTH / 2), Math.floor(Global.ROOM_HEIGHT / 2)));
        }
    }

    highlight(damageMatrix:number[][]){
        this.unhighlight();
        
        var index:number = 0;
        for(var y:number=0; y<Global.ROOM_HEIGHT; y++){
            for(var x:number=0; x<Global.ROOM_WIDTH; x++){
                if(damageMatrix[y][x] > 0){
                    this.highlightTiles[index].x = x * Global.TILE_SIZE;
                    this.highlightTiles[index].y = y * Global.TILE_SIZE;
                    this.highlightTiles[index].show(damageMatrix[y][x]);
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
    
    getEmptyTiles(tiles:TileTypeEnum[][]){
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

    handleAttack(damage:number[][]){
        var lastEnemyDied:Phaser.Point = null;
        var listOfIndeces:number[] = [];
        for (var i:number = 0; i < this.enemyObjects.length; i++) {
            var eP = this.enemyObjects[i].getTilePosition();
            if(this.enemyObjects[i].takeDamage(damage[eP.y][eP.x])){
                listOfIndeces.push(i);
            }
        }
        for(var i:number = listOfIndeces.length - 1; i >= 0; i--){
            lastEnemyDied = this.enemyObjects[i].getTilePosition();
            this.enemyObjects.splice(listOfIndeces[i], 1);
        }
        
        
        if(lastEnemyDied != null && this.enemyObjects.length <= 0){
            this.showBoxObject(lastEnemyDied);
        }
    }
    
    showBoxObject(position:Phaser.Point){
        this.boxObject.show(position);
    }
    
    handleCollision(){
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
        
        for(var i:number=0; i<this.enemyObjects.length; i++){
            if(this.enemyObjects[i].checkCollision(playerPosition.x, playerPosition.y)){
                this.playerObject.killObject();
                this.playerObject = null;
                return true;
            }
        }
        
        if(!Global.getCurrentRoom().cleared && this.enemyObjects.length <= 0){
            if(this.boxObject.checkCollision(playerPosition.x, playerPosition.y)){
                Global.currentWeapon = WeaponGenerator.GenerateWeapon(null, this.game.rnd, this.playerObject.getWeapon(), Global.weaponNameGenerator);
                this.playerObject.setWeapon(Global.currentWeapon);
                this.boxObject.destroy();
                for(var i:number=0; i<this.currentDoors.length; i++){
                    this.currentDoors[i].unlock();
                }
                Global.getCurrentRoom().cleared = true;
                Global.crateNumber += 1;
            }
        }
        
        return false;
    }
    
    handleEnemyCollision(){
        var playerPosition:Phaser.Point = this.playerObject.getTilePosition();
        for(var i:number=0; i<this.enemyObjects.length; i++){
            if(this.enemyObjects[i].checkCollision(playerPosition.x, playerPosition.y)){
                this.playerObject.killObject();
                this.playerObject = null;
                return true;
            }
        }
        
        return false;
    }
    
    stepUpdate(){
        if(this.handleCollision()){
            return;
        }
        
        for (var i = 0; i < this.enemyObjects.length; i++) {
            this.enemyObjects[i].movement(this.playerObject.getTilePosition(), 
                Global.getCurrentRoom().getMatrix(this.enemyObjects));
        }
        
        if(this.handleEnemyCollision()){
            return;
        }
        
        this.playerObject.updateCoolDown();
    }
    
    update(){
        super.update();
        
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.R)){
            this.game.state.start("loading", true);
            this.game.input.keyboard.reset();
        }
        
        if(this.playerObject == null){
            return;
        }
        
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.W)){
            console.log(this.playerObject.getWeapon().toString());
            this.game.input.keyboard.reset();
        }
        
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.E)){
            console.log("New Weapon is Assigned Press W to view details");
            this.playerObject.setWeapon(WeaponGenerator.GenerateWeapon(null, this.game.rnd, 
                this.playerObject.getWeapon(), Global.weaponNameGenerator));
            this.game.input.keyboard.reset();
        }
        
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
        
        if(this.arrowHighlight.isAppearing()){
            if(direction.x != 0 || direction.y != 0){
                this.lastDirection = direction;
                this.arrowHighlight.show(this.playerObject.getTilePosition(), this.lastDirection);
                this.highlight(this.playerObject.getWeapon().getWeaponPositions(
                    this.playerObject.getTilePosition(), this.lastDirection, 
                    Global.matrixTranspose(Global.getCurrentRoom().getMatrix(this.enemyObjects))));
                this.game.input.keyboard.reset();
            }
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.X)){
                this.arrowHighlight.hide();
                this.unhighlight();
                this.playerObject.getWeapon().fireWeapon();
                this.handleAttack(this.playerObject.getWeapon().getWeaponPositions(
                    this.playerObject.getTilePosition(), this.lastDirection, 
                    Global.matrixTranspose(Global.getCurrentRoom().getMatrix(this.enemyObjects))));
                this.stepUpdate();
                this.game.input.keyboard.reset();
                this.buttonText.normalMode();
            }
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.Z)){
                this.arrowHighlight.hide();
                this.unhighlight();
                this.game.input.keyboard.reset();
                this.buttonText.normalMode();
            }
        }
        else{
            if(direction.x != 0 || direction.y != 0){
                this.lastDirection = direction;
                if(this.playerObject.move(direction, Global.getCurrentRoom().getMatrix(this.enemyObjects))){
                    this.stepUpdate();
                }
                this.game.input.keyboard.reset();
            }
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.X) && 
                this.playerObject.getWeapon().getCurrentCoolDown() <= 0){
                this.arrowHighlight.show(this.playerObject.getTilePosition(), this.lastDirection);
                this.highlight(this.playerObject.getWeapon().getWeaponPositions(
                    this.playerObject.getTilePosition(), this.lastDirection, 
                    Global.matrixTranspose(Global.getCurrentRoom().getMatrix(this.enemyObjects))));
                this.game.input.keyboard.reset();
                this.buttonText.aimMode();
            }
            
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.Z) && 
                Global.crateNumber >= Global.getCurrentCost()){
                Global.crateNumber -= Global.getCurrentCost();
                Global.itemUsage += 1;
                Global.currentPlayer.specialAbility.useSpecial(this);
                this.buttonText.normalMode();
                this.game.input.keyboard.reset();
            }
        }
        
    }
}