/// <reference path="BaseGameState.ts"/>
/// <reference path="../GameObjects/FloorTiles/DoorTile.ts"/>
/// <reference path="../GameObjects/FloorTiles/HighlightTile.ts"/>
/// <reference path="../GameObjects/FloorTiles/DirHighlightTile.ts"/>
/// <reference path="../GameObjects/FloorObject/BoxObject.ts"/>
/// <reference path="../GameObjects/Enemy/EnemyObject.ts"/>
/// <reference path="../GameObjects/PlayerObject.ts"/>
/// <reference path="../HUDElements/MiniMap.ts"/>
/// <reference path="../GameObjects/Boss/Boss.ts"/>

class GameplayState extends BaseGameState {
    currentDoors: DoorTile[];
    highlightTiles: HighlightTile[];
    arrowHighlight: DirHighlightTile;
    playerObject: PlayerObject;
    enemyObjects: EnemyObject[];
    bossObject: Boss;
    boxObject: BoxObject;
    portalObject: PortalObject;
    lastPosition: Phaser.Point;
    lastDirection: Phaser.Point;
    miniMap: MiniMap;
    handUI: HandUI;
    weaponUI:WeaponUI;
    buttonText: ButtonTutorial;

    listOfAdded: EnemyObject[];
    listOfDeleted: EnemyObject[];

    constructor() {
        super();
    }

    create() {
        super.create();
        this.listOfAdded = [];
        this.listOfDeleted = [];
        Global.audioManager.stopTitleMusic();
        Global.audioManager.playMusic(Global.levelCategory *
            Math.floor(AudioManager.AMOUNT_OF_MUSIC / Global.MAX_LVL_CATEGORY) + Global.levelMusic);

        this.createCurrentRoom(Global.getCurrentRoom());
        this.lastDirection = new Phaser.Point(-Global.previousDirection.x, -Global.previousDirection.y);
        if (this.lastDirection.getMagnitude() == 0) {
            this.lastDirection.y = 1;
        }
        Global.levelRooms[Global.currentX][Global.currentY].visited = true;
        this.createHUDElements();

        Global.enemyTypes.initNewRoom(Global.levelNumber, Global.previousDirection);
    }

    createHUDElements() {
        this.miniMap = new MiniMap(this.game, this.game.width - (Global.mapWidth + 1.5) * Global.MAP_SIZE,
            this.game.height - (this.game.height - this.game.width) / 2 - Global.mapHeight * Global.MAP_SIZE / 2 + 5);
        this.game.add.existing(this.miniMap);

        this.handUI = new HandUI(this.game, 1.5 * Global.MAP_SIZE,
            this.game.height - (this.game.height - this.game.width) / 2 - 3 * Global.MAP_SIZE / 2 + 5);
        this.game.add.existing(this.handUI);
        if (Global.currentWeapon != null) {
            this.updateHandUI();
        }

        this.buttonText = new ButtonTutorial(this.game, 7, this.game.height);
        this.game.add.existing(this.buttonText);

        this.weaponUI = new WeaponUI(this.game, this.game.width / 2, this.game.height - 70);
        this.game.add.existing(this.weaponUI);
        if (Global.currentWeapon != null) {
            this.updateHandUI();
        }
        this.game.add.existing(new CrateText(this.game, this.game.width / 2 + 2, this.game.height - 10));
        this.game.add.existing(new LevelName(this.game, this.game.width / 2, 5));
        this.game.add.existing(new WhiteLayout(this.game, -this.game.camera.x, -this.game.camera.y,
            Global.ROOM_WIDTH * Global.TILE_SIZE, Global.ROOM_HEIGHT * Global.TILE_SIZE));
    }

    addDoor(direction: Phaser.Point, cleared: boolean) {
        var tempDoor: DoorTile = new DoorTile(this.game, direction);
        tempDoor.lock();
        if (cleared) {
            tempDoor.unlock();
        }
        this.game.add.existing(tempDoor);

        this.currentDoors.push(tempDoor);
    }

    createCurrentRoom(room: RoomInfoObject) {
        this.currentDoors = [];

        for (var x: number = 0; x < Global.ROOM_WIDTH; x++) {
            for (var y: number = 0; y < Global.ROOM_HEIGHT; y++) {
                switch (room.tileMatrix[x][y]) {
                    case TileTypeEnum.Passable:
                        this.game.add.existing(new EmptyTile(this.game, x, y));
                        break;
                    case TileTypeEnum.Wall:
                        this.game.add.existing(new WallTile(this.game, x, y));
                        break;
                    case TileTypeEnum.Door:
                        if (x == 0) {
                            this.addDoor(new Phaser.Point(-1, 0), room.cleared || room.roomType == RoomTypeEnum.None);
                        }
                        if (x == Global.ROOM_WIDTH - 1) {
                            this.addDoor(new Phaser.Point(1, 0), room.cleared || room.roomType == RoomTypeEnum.None);
                        }
                        if (y == 0) {
                            this.addDoor(new Phaser.Point(0, -1), room.cleared || room.roomType == RoomTypeEnum.None);
                        }
                        if (y == Global.ROOM_HEIGHT - 1) {
                            this.addDoor(new Phaser.Point(0, 1), room.cleared || room.roomType == RoomTypeEnum.None);
                        }
                        break;
                }
            }
        }

        this.highlightTiles = [];
        for (var i: number = 0; i < 4 * (Global.ROOM_WIDTH + Global.ROOM_HEIGHT); i++) {
            var tempTile: HighlightTile = new HighlightTile(this.game)
            this.highlightTiles.push(tempTile);
            this.game.add.existing(tempTile);
        }
        this.arrowHighlight = new DirHighlightTile(this.game);
        this.game.add.existing(this.arrowHighlight);

        if (Global.currentPlayer == null) {
            Global.currentPlayer = new TatPlayerData(this.game.cache.getText("playerdata"));
        }

        this.boxObject = new BoxObject(this.game);
        this.portalObject = new PortalObject(this.game);
        this.game.add.existing(this.boxObject);
        this.game.add.existing(this.portalObject);

        this.enemyObjects = [];
        var numOfEnemies: number = Global.enemyNumbers.getNumber(this.rnd, Global.levelNumber);
        if (room.cleared || room.roomType == RoomTypeEnum.None || room.roomType == RoomTypeEnum.Boss) {
            numOfEnemies = 0;
        }

        var normalTiles: TileTypeEnum[][] = room.getMatrix(this.enemyObjects);
        for (var i: number = 0; i < numOfEnemies; i++) {
            var tempEnemy: EnemyObject = Global.enemyTypes.getEnemy(this.game, normalTiles,
                Global.currentWeapon.getWeaponPositions(new Phaser.Point(Math.floor(Global.ROOM_WIDTH / 2),
                    Math.floor(Global.ROOM_HEIGHT / 2)), new Phaser.Point(0, -1), normalTiles));
            normalTiles[tempEnemy.getTilePosition().x][tempEnemy.getTilePosition().y] = TileTypeEnum.Enemy;
            this.enemyObjects.push(tempEnemy);
            this.game.add.existing(tempEnemy);
        }

        this.bossObject = null;
        if (room.roomType == RoomTypeEnum.Boss) {
            this.bossObject = new Boss(this.game, Global.ROOM_WIDTH / 2 - Global.previousDirection.x * 2,
                Global.ROOM_HEIGHT / 2 - Global.previousDirection.y * 2);
            this.game.add.existing(this.bossObject);
        }

        if (!room.cleared && room.roomType == RoomTypeEnum.None) {
            this.showBoxObject(new Phaser.Point(Math.floor(Global.ROOM_WIDTH / 2), Math.floor(Global.ROOM_HEIGHT / 2)));
        }

        if (Global.previousDirection.getMagnitude() == 0) {
            var shift: number = 0;
            if (Global.levelNumber == 0) {
                this.boxObject.y -= Global.TILE_SIZE;
                for (var i = 0; i < this.currentDoors.length; i++) {
                    this.currentDoors[i].lock();
                }
                shift = 1;
            }
            this.playerObject = null;
            this.game.add.existing(new PlayerEntranceEffect(this.game, Math.floor(Global.ROOM_WIDTH / 2),
                Math.floor(Global.ROOM_HEIGHT / 2) + shift, 8));
        }
        else {
            this.playerObject = new PlayerObject(this.game, Math.floor(Global.ROOM_WIDTH / 2) +
                Global.previousDirection.x * (Math.floor(Global.ROOM_WIDTH / 2) - 1),
                Math.floor(Global.ROOM_HEIGHT / 2) +
                Global.previousDirection.y * (Math.floor(Global.ROOM_HEIGHT / 2) - 1),
                Global.currentWeapon);
            this.game.add.existing(this.playerObject);
            this.lastPosition = this.playerObject.getTilePosition();
        }

    }

    highlight(damageMatrix: number[][]) {
        this.unhighlight();

        var index: number = 0;
        for (var y: number = 0; y < Global.ROOM_HEIGHT; y++) {
            for (var x: number = 0; x < Global.ROOM_WIDTH; x++) {
                if (damageMatrix[y][x] > 0) {
                    this.highlightTiles[index].x = x * Global.TILE_SIZE;
                    this.highlightTiles[index].y = y * Global.TILE_SIZE;
                    this.highlightTiles[index].show(damageMatrix[y][x]);
                    index++;
                }
            }
        }
    }

    unhighlight() {
        for (var i: number = 0; i < this.highlightTiles.length; i++) {
            this.highlightTiles[i].hide();
        }
    }

    isHighlighted() {
        return this.highlightTiles[0].alpha == 1;
    }

    handleAttack(damage: number[][], isPlayer:boolean, isCreated:boolean = true) {
        for (var i: number = 0; i < this.enemyObjects.length; i++) {
            var eP = this.enemyObjects[i].getTilePosition();
            if (this.enemyObjects[i].takeDamage(damage[eP.y][eP.x])) {
                this.listOfDeleted.push(this.enemyObjects[i]);
            }
        }

        for (var x = 0; x < Global.ROOM_WIDTH; x++) {
            for (var y = 0; y < Global.ROOM_HEIGHT; y++) {
                if (damage[y][x] > 0 && isCreated) {
                    this.game.add.existing(new AttackEffect(this.game, x, y, isPlayer));
                }
            }
        }

        if (this.bossObject != null) {
            var bP: Phaser.Point = this.bossObject.getTilePosition();
            if (this.bossObject.takeDamage(damage[bP.y][bP.x])) {
                this.bossObject.killObject();
                this.bossObject = null;
            }
        }
        
        var playerPos:Phaser.Point = this.playerObject.getTilePosition();
        if(damage[playerPos.y][playerPos.x] > 0){
            this.playerObject.isAlive = false;
        }
    }

    updateObjectLists() {
        var lastEnemyDied: Phaser.Point = null;
        for (var i: number = this.listOfDeleted.length - 1; i >= 0; i--) {
            var e1:EnemyObject = this.listOfDeleted[i];
            for (var j = 0; j < this.enemyObjects.length; j++) {
                var e2 = this.enemyObjects[j];
                if(e1 == e2){
                    lastEnemyDied = this.enemyObjects[j].getTilePosition();
                    this.enemyObjects[j].killObject();
                    this.enemyObjects.splice(j, 1);
                    break;
                }
            }
        }
        
        for (var i = 0; i < this.listOfAdded.length; i++) {
            var enemy = this.listOfAdded[i];
            this.enemyObjects.push(enemy);
            this.game.add.existing(enemy);
        }

        if (lastEnemyDied != null && this.enemyObjects.length <= 0) {
            if (Global.isDungeonFinished()) {
                this.portalObject.showPortal(lastEnemyDied.x, lastEnemyDied.y);
            }
            else {
                this.showBoxObject(lastEnemyDied);
            }
        }
        
        this.listOfDeleted = [];
        this.listOfAdded = [];
    }

    addEnemy(enemy: EnemyObject) {
        this.listOfAdded.push(enemy);
    }

    showBoxObject(position: Phaser.Point) {
        this.boxObject.show(position);
    }

    changeHandWeapon(minDamage: number) {
        Global.currentWeapon = WeaponGenerator.GenerateWeapon(null, this.game.rnd,
            this.playerObject.getWeapon(), Global.weaponNameGenerator, minDamage);
        this.playerObject.setWeapon(Global.currentWeapon);
        this.updateHandUI();
    }

    updateHandUI() {
        this.weaponUI.updateName(Global.currentWeapon.getWeaponName().toString());
        this.weaponUI.updateDamage(Global.currentWeapon.getDamage(), 0);
        this.weaponUI.updateCooldown(Global.currentWeapon.cooldown - 1, 0);
        
        if(Global.currentWeapon != null){
            this.handUI.updateWeaponPattern(Global.currentWeapon.getWeaponPositions(
                new Phaser.Point(Math.floor(Global.ROOM_HEIGHT/2), Math.floor(Global.ROOM_WIDTH/2)), 
                new Phaser.Point(0, -1), Global.getCurrentRoom().getMatrix(this.enemyObjects)));
            this.handUI.showHide(HandObjects.Weapon);
        }
    }

    handleCollision() {
        var playerPosition: Phaser.Point = this.playerObject.getTilePosition();
        for (var i: number = 0; i < this.currentDoors.length; i++) {
            if (this.currentDoors[i].checkCollision(playerPosition.x, playerPosition.y)) {
                Global.currentX += this.currentDoors[i].direction.x;
                Global.currentY += this.currentDoors[i].direction.y;
                Global.previousDirection.set(-this.currentDoors[i].direction.x, -this.currentDoors[i].direction.y);
                this.game.state.start("gameplay", true);
                break;
            }
        }

        for (var i: number = 0; i < this.enemyObjects.length; i++) {
            if (this.enemyObjects[i].checkCollision(playerPosition.x, playerPosition.y)) {
                this.playerObject.isAlive = false;
                return true;
            }
        }

        if (!Global.getCurrentRoom().cleared && this.enemyObjects.length <= 0) {
            if (this.boxObject.checkCollision(playerPosition.x, playerPosition.y)) {
                this.changeHandWeapon(-1);
                this.boxObject.collectCrate();
                for (var i: number = 0; i < this.currentDoors.length; i++) {
                    this.currentDoors[i].unlock();
                }
                Global.getCurrentRoom().cleared = true;
                Global.crateNumber += 1;
            }
            if (this.portalObject.checkCollision(playerPosition.x, playerPosition.y)) {
                Global.getCurrentRoom().cleared = true;
                this.portalObject.enterPortal();
            }
        }

        return false;
    }

    handleEnemyCollision() {
        if (this.playerObject == null) {
            return true;
        }
        var playerPosition: Phaser.Point = this.playerObject.getTilePosition();
        var enemyAttacked: Phaser.Point[] = [];
        for (var i: number = 0; i < this.enemyObjects.length; i++) {
            if (this.enemyObjects[i].checkCollision(playerPosition.x, playerPosition.y)) {
                this.playerObject.isAlive = false;
                return true;
            }
            var colPoint: Phaser.Point = null;
            if(this.enemyObjects[i].isAlive){
                colPoint = this.enemyObjects[i].enemyShot(playerPosition,
                    Global.getCurrentRoom().getMatrix(this.enemyObjects));    
            }
            if (colPoint != null) {
                var enemyPos: Phaser.Point = this.enemyObjects[i].getTilePosition();
                this.game.add.existing(new LaserEffect(this.game, enemyPos.x, enemyPos.y,
                    colPoint.x, colPoint.y));
                if (colPoint.equals(playerPosition)) {
                    this.playerObject.isAlive = false;
                    return true;
                }
                else {
                    enemyAttacked.push(colPoint);
                }
            }
        }

        if (this.bossObject != null &&
            this.bossObject.checkCollision(playerPosition.x, playerPosition.y)) {
            this.playerObject.isAlive = false;
            return true;
        }

        var damageMatrix: number[][] = [];
        for (var y: number = 0; y < Global.ROOM_HEIGHT; y++) {
            damageMatrix.push([]);
            for (var x = 0; x < Global.ROOM_WIDTH; x++) {
                damageMatrix[y].push(0);
                for (var i = 0; i < enemyAttacked.length; i++) {
                    var pos = enemyAttacked[i];
                    if (pos.x == x && pos.y == y) {
                        damageMatrix[y][x] = 1;
                    }
                }
            }
        }
        this.handleAttack(damageMatrix, false);

        return false;
    }

    stepUpdate() {
        if (this.handleCollision()) {
            return;
        }

        for (var i = 0; i < this.enemyObjects.length; i++) {
            var tileMatrix: number[][] = Global.getCurrentRoom().getMatrix(this.enemyObjects);
            var blob:BlobEnemyObject = <BlobEnemyObject>this.enemyObjects[i];
            if(blob.dropTrail != null){
                this.enemyObjects[i].enemyMove(this.playerObject.getTilePosition(), tileMatrix);
            }
            else{
                this.enemyObjects[i].enemyMove(this.lastPosition, tileMatrix);
            }
        }

        if (this.bossObject != null) {
            this.bossObject.stepUpdate(this.lastPosition, Global.getCurrentRoom().getMatrix(this.enemyObjects));
        }

        if (this.handleEnemyCollision()) {
            return;
        }

        this.playerObject.updateCoolDown();
    }
    
    handleEnemyExplosion(){
        for (var i = 0; i < this.enemyObjects.length; i++) {
            var e:ExplosiveEnemyObject = <ExplosiveEnemyObject>this.enemyObjects[i];
            if(e.explode != null && !e.isAlive){
                this.handleAttack(e.explode(), false);
            }
        }
    }

    update() {
        super.update();

        this.buttonText.alpha = 1;
        if (Global.currentWeapon == null) {
            this.buttonText.alpha = 0;
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
            this.game.state.start("mainmenu", true);
            Global.audioManager.stopMusic();
            this.game.input.keyboard.reset();
        }

        if (this.playerObject == null) {
            if (Global.previousDirection.getMagnitude() != 0) {
                Global.audioManager.stopMusic();
            }
            return;
        }

        if (!this.playerObject.isAlive) {
            this.playerObject.takeDamage();
            this.playerObject = null;
            this.game.add.existing(new Gameover(this.game, this.game.width/2, this.game.height/2 - 30));
            return;
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            console.log(this.playerObject.getWeapon().toString());
            this.game.input.keyboard.reset();
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.E)) {
            console.log("New Weapon is Assigned Press W to view details");
            this.changeHandWeapon(-1);
            this.game.input.keyboard.reset();
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
            console.log("New Weapon is Assigned Press W to view details");
            this.changeHandWeapon(3);
            this.game.input.keyboard.reset();
        }

        var direction: Phaser.Point = new Phaser.Point();
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            direction.y -= 1;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            direction.y += 1;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            direction.x -= 1;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            direction.x += 1;
        }

        if (direction.x != 0 && direction.y != 0) {
            if (Math.random() < 0.5) {
                direction.x = 0;
            }
            else {
                direction.y = 0;
            }
        }

        if (this.arrowHighlight.isAppearing()) {
            if (direction.x != 0 || direction.y != 0) {
                this.lastDirection = direction;
                this.arrowHighlight.show(this.playerObject.getTilePosition(), this.lastDirection);
                this.highlight(this.playerObject.getWeapon().getWeaponPositions(
                    this.playerObject.getTilePosition(), this.lastDirection,
                    Global.matrixTranspose(Global.getCurrentRoom().getMatrix(this.enemyObjects))));
                this.game.input.keyboard.reset();
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.X)) {
                this.lastPosition = this.playerObject.getTilePosition();
                this.arrowHighlight.hide();
                this.unhighlight();
                this.playerObject.fireWeapon();
                this.handleAttack(this.playerObject.getWeapon().getWeaponPositions(
                    this.playerObject.getTilePosition(), this.lastDirection,
                    Global.matrixTranspose(Global.getCurrentRoom().getMatrix(this.enemyObjects))), true);
                this.handleEnemyExplosion();
                this.stepUpdate();
                this.game.input.keyboard.reset();
                this.buttonText.normalMode();
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.Z)) {
                this.arrowHighlight.hide();
                this.unhighlight();
                this.game.input.keyboard.reset();
                this.buttonText.normalMode();
            }
        }
        else {
            if (direction.x != 0 || direction.y != 0) {
                this.lastPosition = this.playerObject.getTilePosition();
                this.lastDirection = direction;
                if (this.playerObject.move(direction, Global.getCurrentRoom().getMatrix(this.enemyObjects))) {
                    this.stepUpdate();
                }
                this.game.input.keyboard.reset();
            }
            if (Global.currentWeapon != null) {
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.X) &&
                    this.playerObject.getWeapon().getCurrentCoolDown() <= 0) {
                    this.arrowHighlight.show(this.playerObject.getTilePosition(), this.lastDirection);
                    this.highlight(this.playerObject.getWeapon().getWeaponPositions(
                        this.playerObject.getTilePosition(), this.lastDirection,
                        Global.matrixTranspose(Global.getCurrentRoom().getMatrix(this.enemyObjects))));
                    this.game.input.keyboard.reset();
                    this.buttonText.aimMode();
                }

                if (this.game.input.keyboard.isDown(Phaser.Keyboard.C) &&
                    Global.crateNumber >= Global.getCurrentCost()) {
                    Global.crateNumber -= Global.getCurrentCost();
                    Global.itemUsage += 1;
                    Global.currentPlayer.specialAbility.useSpecial(this);
                    this.handleEnemyExplosion();
                    this.buttonText.normalMode();
                    this.game.input.keyboard.reset();
                }
            }
        }
        
        this.updateObjectLists();
    }
}