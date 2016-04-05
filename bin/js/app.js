var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(352, 430, Phaser.AUTO, 'content');
        this.game.state.add("gameplay", GameplayState, false);
        this.game.state.start("gameplay", false, false);
        Global.initialize();
        Global.constructLevel(new Phaser.RandomDataGenerator([Date.now()]));
    }
    return SimpleGame;
}());
window.onload = function () {
    var game = new SimpleGame();
};
var RoomSet = (function () {
    function RoomSet(p) {
        this.rooms = [p];
    }
    RoomSet.prototype.combine = function (set) {
        for (var i = 0; i < set.rooms.length; i++) {
            this.rooms.push(set.rooms[i]);
        }
    };
    RoomSet.prototype.getListOfConnections = function (set) {
        var result = [];
        for (var i = 0; i < this.rooms.length; i++) {
            for (var j = 0; j < set.rooms.length; j++) {
                var d = new Phaser.Point(this.rooms[i].x - set.rooms[j].x, this.rooms[i].y - set.rooms[j].y);
                if (d.getMagnitude() == 1) {
                    result.push(this.rooms[i]);
                    result.push(set.rooms[j]);
                }
            }
        }
        return result;
    };
    return RoomSet;
}());
var Global = (function () {
    function Global() {
    }
    Global.initialize = function () {
        Global.levelNumber = 0;
        Global.crateNumber = 0;
        Global.currentWeapon = null;
    };
    Global.constructLevel = function (random) {
        var probabilityOfEmptyPlace = 0.15;
        var precentageCovered = 0.6;
        Global.mapWidth = random.integerInRange(4, 5);
        Global.mapHeight = random.integerInRange(3, 4);
        Global.levelRooms = [];
        for (var x = 0; x < Global.mapWidth; x++) {
            Global.levelRooms.push([]);
            for (var y = 0; y < Global.mapHeight; y++) {
                Global.levelRooms[x].push(null);
            }
        }
        var sets = [];
        var queue = [new Phaser.Point(random.integerInRange(0, Global.mapWidth - 1), random.integerInRange(0, Global.mapHeight - 1))];
        Global.currentX = queue[0].x;
        Global.currentY = queue[0].y;
        var roomNumbers = 0;
        while (queue.length != 0 && roomNumbers / (Global.mapWidth * Global.mapHeight) < precentageCovered) {
            var p = queue.splice(random.integerInRange(0, queue.length - 1), 1)[0];
            if (Global.levelRooms[p.x][p.y] == null) {
                var diff = random.integerInRange(1, 3);
                if (Math.random() < probabilityOfEmptyPlace) {
                    diff = 0;
                }
                Global.levelRooms[p.x][p.y] = new RoomInfoObject(diff);
                sets.push(new RoomSet(p));
                roomNumbers += 1;
            }
            for (var x = -1; x <= 1; x++) {
                for (var y = -1; y <= 1; y++) {
                    if (Math.abs(x) + Math.abs(y) == 1) {
                        if (p.x + x >= 0 && p.x + x < Global.mapWidth &&
                            p.y + y >= 0 && p.y + y < Global.mapHeight) {
                            queue.push(new Phaser.Point(p.x + x, p.y + y));
                        }
                    }
                }
            }
        }
        Global.levelRooms[Global.currentX][Global.currentY].difficulty = DifficultyEnum.None;
        Global.levelRooms[Global.currentX][Global.currentY].cleared = true;
        while (sets.length > 1) {
            var firstIndex = random.integerInRange(0, sets.length - 1);
            var secondIndex = (firstIndex + random.integerInRange(1, sets.length - 1)) % sets.length;
            var connections = sets[firstIndex].getListOfConnections(sets[secondIndex]);
            if (connections.length > 0) {
                sets[firstIndex].combine(sets[secondIndex]);
                sets.splice(secondIndex, 1);
                var numConn = random.integerInRange(1, connections.length / 2);
                console.log(connections.length / 2);
                for (var i = 0; i < numConn; i++) {
                    var randomIndex = random.integerInRange(0, connections.length / 2 - 1);
                    var fRoom = connections.splice(2 * randomIndex + 1, 1)[0];
                    var sRoom = connections.splice(2 * randomIndex, 1)[0];
                    console.log(numConn + " " + connections.length);
                    Global.levelRooms[fRoom.x][fRoom.y].setDoor(new Phaser.Point(sRoom.x - fRoom.x, sRoom.y - fRoom.y));
                    Global.levelRooms[sRoom.x][sRoom.y].setDoor(new Phaser.Point(fRoom.x - sRoom.x, fRoom.y - sRoom.y));
                }
            }
        }
    };
    Global.getCurrentRoom = function () {
        return Global.levelRooms[Global.currentX][Global.currentY];
    };
    Global.TILE_SIZE = 32;
    Global.ROOM_WIDTH = 11;
    Global.ROOM_HEIGHT = 11;
    Global.levelNumber = 0;
    Global.crateNumber = 0;
    Global.currentWeapon = null;
    Global.currentX = 0;
    Global.currentY = 0;
    Global.mapWidth = 0;
    Global.mapHeight = 0;
    Global.previousDirection = new Phaser.Point();
    return Global;
}());
var BaseGameObject = (function (_super) {
    __extends(BaseGameObject, _super);
    function BaseGameObject(game, x, y) {
        _super.call(this, game);
        this.x = x;
        this.y = y;
    }
    BaseGameObject.prototype.isAnimating = function () {
        return false;
    };
    BaseGameObject.prototype.getTilePosition = function () {
        return new Phaser.Point(Math.floor(this.x / Global.TILE_SIZE), Math.floor(this.y / Global.TILE_SIZE));
    };
    BaseGameObject.prototype.checkCollision = function (xTile, yTile) {
        return this.getTilePosition().equals(new Phaser.Point(xTile, yTile));
    };
    BaseGameObject.prototype.killObject = function () {
        this.destroy(true);
    };
    return BaseGameObject;
}(Phaser.Group));
var BaseUIObject = (function (_super) {
    __extends(BaseUIObject, _super);
    function BaseUIObject(game, x, y) {
        _super.call(this, game);
        this.x = x;
        this.y = y;
    }
    return BaseUIObject;
}(Phaser.Group));
var BoxObject = (function (_super) {
    __extends(BoxObject, _super);
    function BoxObject(game) {
        _super.call(this, game, 0, 0);
        this.sprite = this.game.add.sprite(0, 0, "graphics");
        this.sprite.animations.add("normal", [4]);
        this.sprite.animations.play("normal");
        this.sprite.tint = 0xffcc66;
        this.sprite.alpha = 0;
        this.add(this.sprite);
    }
    BoxObject.prototype.show = function (tilePosition, roomMatrix) {
        this.sprite.alpha = 1;
        this.x = tilePosition.x * Global.TILE_SIZE;
        this.y = tilePosition.y * Global.TILE_SIZE;
    };
    return BoxObject;
}(BaseGameObject));
var CannonObject = (function (_super) {
    __extends(CannonObject, _super);
    function CannonObject(game, x, y, speed, cannonDirection) {
        _super.call(this, game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
        this.cannonDirection = cannonDirection;
    }
    CannonObject.prototype.blockShoot = function (mapMatrix) {
        var allowedToShoot = true;
        if (this.cannonDirection.equals(new Phaser.Point(1, 0))) {
            for (var index = this.getTilePosition().x + 1; index < 10; index++) {
                if (mapMatrix[index][this.getTilePosition().y] == TileTypeEnum.Hole
                    || mapMatrix[index][this.getTilePosition().y] == TileTypeEnum.Wall) {
                    allowedToShoot = false;
                }
            }
        }
        else if (this.cannonDirection.equals(new Phaser.Point(-1, 0))) {
            for (var index = this.getTilePosition().x - 1; index > 0; index--) {
                if (mapMatrix[index][this.getTilePosition().y] == TileTypeEnum.Hole
                    || mapMatrix[index][this.getTilePosition().y] == TileTypeEnum.Wall) {
                    allowedToShoot = false;
                }
            }
        }
        else if (this.cannonDirection.equals(new Phaser.Point(0, 1))) {
            for (var index = this.getTilePosition().y + 1; index < 10; index++) {
                if (mapMatrix[this.getTilePosition().x][index] == TileTypeEnum.Hole
                    || mapMatrix[this.getTilePosition().x][index] == TileTypeEnum.Wall) {
                    allowedToShoot = false;
                }
            }
        }
        else if (this.cannonDirection.equals(new Phaser.Point(0, -1))) {
            for (var index = this.getTilePosition().y - 1; index > 0; index--) {
                if (mapMatrix[this.getTilePosition().x][index] == TileTypeEnum.Hole
                    || mapMatrix[this.getTilePosition().x][index] == TileTypeEnum.Wall) {
                    allowedToShoot = false;
                }
            }
        }
        else {
            allowedToShoot = true;
        }
    };
    CannonObject.prototype.shoot = function (player, mapMatrix) {
        var shot = false;
        if (this.blockShoot(mapMatrix)) {
            if (this.getTilePosition().y == player.getTilePosition().y
                && this.getTilePosition().x > player.getTilePosition().x
                && this.cannonDirection.equals(new Phaser.Point(-1, 0))) {
                shot = true;
            }
            else if (this.getTilePosition().y == player.getTilePosition().y
                && this.getTilePosition().x < player.getTilePosition().x
                && this.cannonDirection.equals(new Phaser.Point(1, 0))) {
                shot = true;
            }
            else if (this.getTilePosition().x == player.getTilePosition().x
                && this.getTilePosition().y < player.getTilePosition().y
                && this.cannonDirection.equals(new Phaser.Point(0, 1))) {
                shot = true;
            }
            else if (this.getTilePosition().x == player.getTilePosition().x
                && this.getTilePosition().y > player.getTilePosition().y
                && this.cannonDirection.equals(new Phaser.Point(0, -1))) {
                shot = true;
            }
        }
        return shot;
    };
    CannonObject.prototype.getCannonDirection = function () {
        return this.cannonDirection;
    };
    return CannonObject;
}(BaseGameObject));
var DifficultyEnum;
(function (DifficultyEnum) {
    DifficultyEnum[DifficultyEnum["None"] = 0] = "None";
    DifficultyEnum[DifficultyEnum["Easy"] = 1] = "Easy";
    DifficultyEnum[DifficultyEnum["Medium"] = 2] = "Medium";
    DifficultyEnum[DifficultyEnum["Hard"] = 3] = "Hard";
    DifficultyEnum[DifficultyEnum["Final"] = 4] = "Final";
})(DifficultyEnum || (DifficultyEnum = {}));
var EnemyObject = (function (_super) {
    __extends(EnemyObject, _super);
    function EnemyObject(game, x, y, speed) {
        _super.call(this, game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
        this.enemySprite = this.game.add.sprite(0, 0, 'graphics');
        this.enemySprite.animations.add("normal", [6]);
        this.enemySprite.animations.play("normal");
        this.enemySprite.tint = 0xcc6668;
        this.enemyHealth = 1;
        this.enemySpeed = speed;
        this.isAlive = true;
        this.add(this.enemySprite);
        this.setDirections();
        this.keepDirection = 0;
        this.factorDirectionChange = 2;
        this.hitWall = false;
        this.enemyDirection = this.pickDirection();
    }
    EnemyObject.prototype.chaser = function (player) {
        if ((this.getTilePosition().x < player.getTilePosition().x)
            && (this.getTilePosition().y < player.getTilePosition().y)) {
            var difX = player.getTilePosition().x - this.getTilePosition().x;
            var difY = player.getTilePosition().y - this.getTilePosition().y;
            if (difX >= difY) {
                this.x += Global.TILE_SIZE * this.enemySpeed;
            }
            else {
                this.y += Global.TILE_SIZE * this.enemySpeed;
            }
        }
        if ((this.getTilePosition().x < player.getTilePosition().x)
            && (this.getTilePosition().y > player.getTilePosition().y)) {
            var difX = player.getTilePosition().x - this.getTilePosition().x;
            var difY = this.getTilePosition().y - player.getTilePosition().y;
            if (difX >= difY) {
                this.x += Global.TILE_SIZE * this.enemySpeed;
            }
            else {
                this.y -= Global.TILE_SIZE * this.enemySpeed;
            }
        }
        if ((this.getTilePosition().x > player.getTilePosition().x)
            && (this.getTilePosition().y < player.getTilePosition().y)) {
            var difX = this.getTilePosition().x - player.getTilePosition().x;
            var difY = player.getTilePosition().y - this.getTilePosition().y;
            if (difX >= difY) {
                this.x -= Global.TILE_SIZE * this.enemySpeed;
            }
            else {
                this.y += Global.TILE_SIZE * this.enemySpeed;
            }
        }
        if ((this.getTilePosition().x > player.getTilePosition().x)
            && (this.getTilePosition().y > player.getTilePosition().y)) {
            var difX = player.getTilePosition().x - this.getTilePosition().x;
            var difY = player.getTilePosition().y - this.getTilePosition().y;
            if (difX >= difY) {
                this.x -= Global.TILE_SIZE * this.enemySpeed;
            }
            else {
                this.y -= Global.TILE_SIZE * this.enemySpeed;
            }
        }
    };
    EnemyObject.prototype.setDirections = function () {
        this.directions = [new Phaser.Point(0, 0),
            new Phaser.Point(1, 0),
            new Phaser.Point(0, 1),
            new Phaser.Point(-1, 0),
            new Phaser.Point(0, -1)];
    };
    EnemyObject.prototype.pickDirection = function () {
        var dir;
        var choose = Math.floor(Math.random() * 4) + 1;
        dir = this.directions[choose];
        return dir;
    };
    EnemyObject.prototype.findDirectionIndex = function (dir) {
        var indexReturn = 1;
        for (var index = 1; index < this.directions.length; index++) {
            if (dir.equals(this.directions[index])) {
                indexReturn = index;
            }
        }
        return indexReturn;
    };
    EnemyObject.prototype.pickDirectionWithThisConstraint = function (constraint) {
        var choose = (Math.floor(Math.random() * 4) + 1) % constraint;
        return this.directions[choose];
    };
    EnemyObject.prototype.moveUntilFindWall = function (playerPosition, tileMatrix) {
        if (this.keepDirection % this.factorDirectionChange == 0) {
            this.enemyDirection = this.pickDirection();
        }
        this.keepDirection++;
        if (!this.updateEnemy(this.enemyDirection, tileMatrix)) {
            var newDir = this.pickDirectionWithThisConstraint(this.findDirectionIndex(this.enemyDirection));
            this.updateEnemy(newDir, tileMatrix);
        }
    };
    EnemyObject.prototype.moveAndKeepDirection = function (playerPosition, tileMatrix) {
        if (this.keepDirection % this.factorDirectionChange == 0) {
            this.enemyDirection = this.pickDirection();
        }
        this.keepDirection++;
        if (!this.updateEnemy(this.enemyDirection, tileMatrix)) {
            var newDir = this.pickDirectionWithThisConstraint(this.findDirectionIndex(this.enemyDirection));
            this.updateEnemy(newDir, tileMatrix);
        }
    };
    EnemyObject.prototype.reverseDirection = function (dir) {
        dir.x = dir.x * (-1);
        dir.y = dir.y * (-1);
        return dir;
    };
    EnemyObject.prototype.moveBackAndForth = function (playerPosition, tileMatrix) {
        if (!this.updateEnemy(this.enemyDirection, tileMatrix)) {
            this.updateEnemy(this.reverseDirection(this.enemyDirection), tileMatrix);
        }
    };
    EnemyObject.prototype.moveEnemy = function (playerPosition, tileMatrix) {
        var enemyDirection = this.pickDirection();
        if (!this.updateEnemy(enemyDirection, tileMatrix)) {
            var newDir = this.pickDirectionWithThisConstraint(this.findDirectionIndex(enemyDirection));
            this.updateEnemy(newDir, tileMatrix);
        }
    };
    EnemyObject.prototype.updateEnemy = function (enemyDirection, tileMap) {
        var canMove = false;
        if (enemyDirection.x > 0) {
            if (tileMap[this.getTilePosition().x + 1][this.getTilePosition().y] == TileTypeEnum.Passable) {
                this.x += Global.TILE_SIZE * this.enemySpeed;
                canMove = true;
            }
            else {
                canMove = false;
            }
        }
        if (enemyDirection.x < 0) {
            if (tileMap[this.getTilePosition().x - 1][this.getTilePosition().y] == TileTypeEnum.Passable) {
                this.x -= Global.TILE_SIZE * this.enemySpeed;
                canMove = true;
            }
            else {
                canMove = false;
            }
        }
        if (enemyDirection.y > 0) {
            if (tileMap[this.getTilePosition().x][this.getTilePosition().y + 1] == TileTypeEnum.Passable) {
                this.y += Global.TILE_SIZE * this.enemySpeed;
                canMove = true;
            }
            else {
                canMove = false;
            }
        }
        if (enemyDirection.y < 0) {
            if (tileMap[this.getTilePosition().x][this.getTilePosition().y - 1] == TileTypeEnum.Passable) {
                this.y -= Global.TILE_SIZE * this.enemySpeed;
                canMove = true;
            }
            else {
                canMove = false;
            }
        }
        return canMove;
    };
    EnemyObject.prototype.takeDamage = function (damage) {
        if (this.enemyHealth - damage > 0) {
            this.enemyHealth = this.enemyHealth - damage;
        }
        else {
            this.isAlive = false;
            _super.prototype.killObject.call(this);
            return true;
        }
        return false;
    };
    EnemyObject.prototype.isEnemyAlive = function () {
        return this.isAlive;
    };
    return EnemyObject;
}(BaseGameObject));
var PlayerObject = (function (_super) {
    __extends(PlayerObject, _super);
    function PlayerObject(game, x, y, weapon) {
        _super.call(this, game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
        this.playerSprite = this.game.add.sprite(0, 0, 'graphics');
        this.playerSprite.animations.add("normal", [3]);
        this.add(this.playerSprite);
        this.playerWeapon = weapon;
        this.playerSprite.animations.play("normal");
        this.playerHealth = 1;
        this.isAlive = true;
    }
    PlayerObject.prototype.move = function (cursors, mapMatrix) {
        var canMove = false;
        if (cursors.x > 0) {
            if (mapMatrix[this.getTilePosition().x + 1][this.getTilePosition().y] == TileTypeEnum.Passable
                || mapMatrix[this.getTilePosition().x + 1][this.getTilePosition().y] == TileTypeEnum.Enemy) {
                this.x += Global.TILE_SIZE;
                canMove = true;
            }
            else {
                canMove = false;
            }
        }
        if (cursors.x < 0) {
            if (mapMatrix[this.getTilePosition().x - 1][this.getTilePosition().y] == TileTypeEnum.Passable
                || mapMatrix[this.getTilePosition().x - 1][this.getTilePosition().y] == TileTypeEnum.Enemy) {
                this.x -= Global.TILE_SIZE;
                canMove = true;
            }
            else {
                canMove = false;
            }
        }
        if (cursors.y > 0) {
            if (mapMatrix[this.getTilePosition().x][this.getTilePosition().y + 1] == TileTypeEnum.Passable
                || mapMatrix[this.getTilePosition().x][this.getTilePosition().y + 1] == TileTypeEnum.Enemy) {
                this.y += Global.TILE_SIZE;
                canMove = true;
            }
            else {
                canMove = false;
            }
        }
        if (cursors.y < 0) {
            if (mapMatrix[this.getTilePosition().x][this.getTilePosition().y - 1] == TileTypeEnum.Passable
                || mapMatrix[this.getTilePosition().x][this.getTilePosition().y - 1] == TileTypeEnum.Enemy) {
                this.y -= Global.TILE_SIZE;
                canMove = true;
            }
            else {
                canMove = false;
            }
        }
        return canMove;
    };
    PlayerObject.prototype.setWeapon = function (newWeapon) {
        this.playerWeapon = newWeapon;
    };
    PlayerObject.prototype.getWeapon = function () {
        return this.playerWeapon;
    };
    PlayerObject.prototype.takeDamage = function (damage) {
        if (this.playerHealth > 0) {
            this.playerHealth = this.playerHealth - damage;
        }
        else {
            this.isAlive = false;
        }
    };
    PlayerObject.prototype.isPlayerAlive = function () {
        return this.isAlive;
    };
    return PlayerObject;
}(BaseGameObject));
var RoomInfoObject = (function () {
    function RoomInfoObject(difficulty) {
        this.difficulty = difficulty;
        this.cleared = false;
        this.connections = 0;
        this.constMatrix();
    }
    RoomInfoObject.prototype.constMatrix = function () {
        this.tileMatrix = [];
        for (var x = 0; x < Global.ROOM_WIDTH; x++) {
            this.tileMatrix.push([]);
            for (var y = 0; y < Global.ROOM_HEIGHT; y++) {
                this.tileMatrix[x].push(TileTypeEnum.Passable);
            }
        }
        for (var x = 0; x < Global.ROOM_WIDTH; x++) {
            this.tileMatrix[x][0] = TileTypeEnum.Wall;
            this.tileMatrix[x][Global.ROOM_HEIGHT - 1] = TileTypeEnum.Wall;
        }
        for (var y = 0; y < Global.ROOM_HEIGHT; y++) {
            this.tileMatrix[0][y] = TileTypeEnum.Wall;
            this.tileMatrix[Global.ROOM_WIDTH - 1][y] = TileTypeEnum.Wall;
        }
    };
    RoomInfoObject.prototype.getMatrix = function (enemyList) {
        var returnMatrix = [];
        for (var x = 0; x < Global.ROOM_WIDTH; x++) {
            returnMatrix.push([]);
            for (var y = 0; y < Global.ROOM_HEIGHT; y++) {
                returnMatrix[x].push(this.tileMatrix[x][y]);
            }
        }
        for (var i = 0; i < enemyList.length; i++) {
            var enemyPosition = enemyList[i].getTilePosition();
            returnMatrix[enemyPosition.x][enemyPosition.y] = TileTypeEnum.Enemy;
        }
        if (this.cleared || this.difficulty == DifficultyEnum.None) {
            if (this.checkDoor(new Phaser.Point(-1, 0))) {
                returnMatrix[0][Math.floor(Global.ROOM_HEIGHT / 2)] = TileTypeEnum.Passable;
            }
            if (this.checkDoor(new Phaser.Point(1, 0))) {
                returnMatrix[Global.ROOM_WIDTH - 1][Math.floor(Global.ROOM_HEIGHT / 2)] = TileTypeEnum.Passable;
            }
            if (this.checkDoor(new Phaser.Point(0, -1))) {
                returnMatrix[Math.floor(Global.ROOM_WIDTH / 2)][0] = TileTypeEnum.Passable;
            }
            if (this.checkDoor(new Phaser.Point(0, 1))) {
                returnMatrix[Math.floor(Global.ROOM_WIDTH / 2)][Global.ROOM_HEIGHT - 1] = TileTypeEnum.Passable;
            }
        }
        return returnMatrix;
    };
    RoomInfoObject.prototype.setDoor = function (direction) {
        if (direction.x < 0) {
            this.connections |= 0x1;
        }
        if (direction.x > 0) {
            this.connections |= 0x2;
        }
        if (direction.y < 0) {
            this.connections |= 0x4;
        }
        if (direction.y > 0) {
            this.connections |= 0x8;
        }
        this.tileMatrix[Math.floor((direction.x + 1) * Global.ROOM_WIDTH / 2) - Math.floor((direction.x + 1) / 2)][Math.floor((direction.y + 1) * Global.ROOM_HEIGHT / 2) - Math.floor((direction.y + 1) / 2)] = TileTypeEnum.Door;
    };
    RoomInfoObject.prototype.checkDoor = function (direction) {
        if (direction.x < 0) {
            return (this.connections & 0x1) > 0;
        }
        if (direction.x > 0) {
            return (this.connections & 0x2) > 0;
        }
        if (direction.y < 0) {
            return (this.connections & 0x4) > 0;
        }
        if (direction.y > 0) {
            return (this.connections & 0x8) > 0;
        }
        return false;
    };
    return RoomInfoObject;
}());
var TileTypeEnum;
(function (TileTypeEnum) {
    TileTypeEnum[TileTypeEnum["Passable"] = 0] = "Passable";
    TileTypeEnum[TileTypeEnum["Hole"] = 1] = "Hole";
    TileTypeEnum[TileTypeEnum["Wall"] = 2] = "Wall";
    TileTypeEnum[TileTypeEnum["Door"] = 3] = "Door";
    TileTypeEnum[TileTypeEnum["Enemy"] = 4] = "Enemy";
})(TileTypeEnum || (TileTypeEnum = {}));
var BaseTile = (function (_super) {
    __extends(BaseTile, _super);
    function BaseTile(game, xTile, yTile) {
        _super.call(this, game, xTile * Global.TILE_SIZE, yTile * Global.TILE_SIZE);
    }
    return BaseTile;
}(BaseGameObject));
var DirHighlightTile = (function (_super) {
    __extends(DirHighlightTile, _super);
    function DirHighlightTile(game) {
        _super.call(this, game, 0, 0);
        this.sprites = [];
        for (var i = 0; i < 4; i++) {
            var tempSprite = this.game.add.sprite((i % 2 == 0 ? 1 : 0) * (Math.floor(i / 2) * 2 - 1) * Global.TILE_SIZE / 2, (i % 2 == 1 ? 1 : 0) * (Math.floor(i / 2) * 2 - 1) * Global.TILE_SIZE / 2, "graphics");
            tempSprite.animations.add("normal", [7]);
            tempSprite.animations.play("normal");
            tempSprite.tint = 0x86b7c0;
            tempSprite.alpha = 0;
            tempSprite.angle = ((i + 2) % 4) * 90;
            tempSprite.anchor.set(0.5, 0.5);
            this.sprites.push(tempSprite);
            this.add(tempSprite);
        }
    }
    DirHighlightTile.prototype.hide = function () {
        for (var i = 0; i < this.sprites.length; i++) {
            this.sprites[i].alpha = 0;
        }
    };
    DirHighlightTile.prototype.show = function (playerPosition, direction) {
        this.hide();
        this.x = (playerPosition.x + 0.5) * Global.TILE_SIZE;
        this.y = (playerPosition.y + 0.5) * Global.TILE_SIZE;
        var index = Math.abs(direction.x) + Math.abs(direction.y) * 2 +
            Phaser.Math.sign(direction.x + direction.y);
        this.sprites[index].alpha = 1;
    };
    DirHighlightTile.prototype.isAppearing = function () {
        for (var i = 0; i < this.sprites.length; i++) {
            if (this.sprites[i].alpha > 0) {
                return true;
            }
        }
        return false;
    };
    return DirHighlightTile;
}(BaseTile));
var DoorTile = (function (_super) {
    __extends(DoorTile, _super);
    function DoorTile(game, direction) {
        _super.call(this, game, Math.floor((direction.x + 1) * Global.ROOM_WIDTH / 2) - Math.floor((direction.x + 1) / 2), Math.floor((direction.y + 1) * Global.ROOM_HEIGHT / 2) - Math.floor((direction.y + 1) / 2));
        this.direction = direction;
        this.floorSprite = new EmptyTile(game, Math.floor(this.x / Global.TILE_SIZE), Math.floor(this.y / Global.TILE_SIZE));
        this.game.add.existing(this.floorSprite);
        this.sprite = this.game.add.sprite(0, 0, "graphics");
        this.sprite.animations.add("normal", [2]);
        this.sprite.animations.play("normal");
        this.sprite.tint = 0xffcc66;
        this.add(this.sprite);
    }
    DoorTile.prototype.lock = function () {
        this.floorSprite.alpha = 0;
        this.sprite.alpha = 1;
    };
    DoorTile.prototype.unlock = function () {
        this.floorSprite.alpha = 1;
        this.sprite.alpha = 0;
    };
    return DoorTile;
}(BaseTile));
var EmptyTile = (function (_super) {
    __extends(EmptyTile, _super);
    function EmptyTile(game, xTile, yTile) {
        _super.call(this, game, xTile, yTile);
        this.sprite = this.game.add.sprite(0, 0, "graphics");
        this.sprite.animations.add("normal", [1]);
        this.sprite.animations.play("normal");
        this.sprite.tint = 0x252525;
        this.add(this.sprite);
    }
    return EmptyTile;
}(BaseTile));
var HighlightTile = (function (_super) {
    __extends(HighlightTile, _super);
    function HighlightTile(game) {
        _super.call(this, game, 0, 0);
        this.sprite = this.game.add.sprite(0, 0, "graphics");
        this.sprite.animations.add("normal", [5]);
        this.sprite.animations.play("normal");
        this.sprite.tint = 0x86b7c0;
        this.add(this.sprite);
        this.alpha = 0;
    }
    HighlightTile.prototype.hide = function () {
        this.alpha = 0;
    };
    HighlightTile.prototype.show = function () {
        this.alpha = 1;
    };
    return HighlightTile;
}(BaseTile));
var WallTile = (function (_super) {
    __extends(WallTile, _super);
    function WallTile(game, xTile, yTile) {
        _super.call(this, game, xTile, yTile);
        this.sprite = this.game.add.sprite(0, 0, "graphics");
        this.sprite.animations.add("normal", [0]);
        this.sprite.animations.play("normal");
        this.sprite.tint = 0x664729;
        this.add(this.sprite);
    }
    return WallTile;
}(BaseTile));
//import WeaponShape = require('WeaponShape'); 
var WeaponShape;
(function (WeaponShape) {
    WeaponShape[WeaponShape["AREA"] = 0] = "AREA";
    WeaponShape[WeaponShape["LINE_1"] = 1] = "LINE_1";
    WeaponShape[WeaponShape["LINE_2"] = 2] = "LINE_2";
    WeaponShape[WeaponShape["LINE_3"] = 3] = "LINE_3";
    WeaponShape[WeaponShape["LINE_INF"] = 4] = "LINE_INF"; /*,
    CONE_2,
    CONE_3,
    CONE_4*/
})(WeaponShape || (WeaponShape = {}));
var WeaponOnColision;
(function (WeaponOnColision) {
    WeaponOnColision[WeaponOnColision["PENETRATE"] = 0] = "PENETRATE";
    WeaponOnColision[WeaponOnColision["EXPLODE"] = 1] = "EXPLODE";
})(WeaponOnColision || (WeaponOnColision = {}));
var ColidedEndingType;
(function (ColidedEndingType) {
    //Comment
    ColidedEndingType[ColidedEndingType["NOTHING"] = 0] = "NOTHING";
    ColidedEndingType[ColidedEndingType["EXPLODE"] = 1] = "EXPLODE";
})(ColidedEndingType || (ColidedEndingType = {}));
var ShotType;
(function (ShotType) {
    ShotType[ShotType["NORMAL"] = 0] = "NORMAL";
    ShotType[ShotType["LEAVE_OBJECT"] = 1] = "LEAVE_OBJECT";
})(ShotType || (ShotType = {}));
var TypeColidedObject;
(function (TypeColidedObject) {
    TypeColidedObject[TypeColidedObject["DIE_WITH_TIME"] = 0] = "DIE_WITH_TIME";
    TypeColidedObject[TypeColidedObject["DIE_ON_COLISION"] = 1] = "DIE_ON_COLISION";
})(TypeColidedObject || (TypeColidedObject = {}));
var Weapon = (function () {
    function Weapon() {
        this.name = "";
        this.damage = 1;
        this.cooldown = 1;
        this.curCooldown = 0;
        this.startPointShif = 1;
        /**The way the shooting area is presented */
        this.shape = WeaponShape.LINE_1;
        this.shotType = ShotType.NORMAL;
        this.wOnColision = WeaponOnColision.PENETRATE;
        this.typeColidedObj = TypeColidedObject.DIE_ON_COLISION;
        this.endingType = ColidedEndingType.NOTHING;
        this.shape = WeaponShape.LINE_1;
    }
    Weapon.prototype.attackInLine = function (result, intAttPosX, intAttPosY, playerPos, faceDirection, valueMatrix, quantSpaces) {
        if (intAttPosX == playerPos.x && intAttPosY == playerPos.y) {
            intAttPosX += 1 * faceDirection.x;
            intAttPosY += 1 * faceDirection.y;
        }
        if (faceDirection.x > 0) {
            for (var i = intAttPosX; (i < intAttPosX + quantSpaces || quantSpaces == -1)
                && i < result[0].length &&
                valueMatrix[intAttPosY][i] != TileTypeEnum.Wall; i++) {
                result[intAttPosY][i] = this.damage;
            }
        }
        else if (faceDirection.x < 0) {
            for (var i = intAttPosX; (i > intAttPosX - quantSpaces || quantSpaces == -1)
                && i >= 0 && valueMatrix[intAttPosY][i] != TileTypeEnum.Wall; i--) {
                result[intAttPosY][i] = this.damage;
            }
        }
        else {
            if (faceDirection.y > 0) {
                for (var i = intAttPosY; (i < intAttPosY + quantSpaces || quantSpaces == -1) && i < result.length &&
                    valueMatrix[i][intAttPosX] != TileTypeEnum.Wall; i++) {
                    result[i][intAttPosX] = this.damage;
                }
            }
            else if (faceDirection.y < 0) {
                for (var i = intAttPosY; (i > intAttPosY - quantSpaces || quantSpaces == -1)
                    && i >= 0 && valueMatrix[i][intAttPosX] != TileTypeEnum.Wall; i--) {
                    result[i][intAttPosX] = this.damage;
                }
            }
        }
        return result;
    };
    Weapon.prototype.attackInArea = function (result, intAttPosX, intAttPosY, playerPos, faceDirection, valueMatrix) {
        var topx = (intAttPosX - 1 < 0 ? 0 : intAttPosX - 1);
        var topy = (intAttPosY - 1 < 0 ? 0 : intAttPosY - 1);
        var bottomx = (valueMatrix[0].length < intAttPosX + 2 ? valueMatrix[0].length : intAttPosX + 2);
        var bottomy = (valueMatrix.length < intAttPosY + 2 ? valueMatrix.length : intAttPosY + 2);
        var s = "";
        for (var j = topy; j < bottomy; j++) {
            for (var i = topx; i < bottomx; i++) {
                result[j][i] = this.damage;
                s += result[j][i] + "";
            }
            s += "\n";
        }
        console.log(s);
        return result;
    };
    Weapon.prototype.getWeaponPositions = function (playerPos, faceDirection, valueMatrix) {
        var result = new Array(valueMatrix.length);
        for (var i = 0; i < valueMatrix.length; i++) {
            result[i] = new Array(valueMatrix[0].length);
            for (var j = 0; j < valueMatrix[0].length; j++) {
                result[i][j] = 0;
            }
        }
        //
        var inAttPosX = playerPos.x + (this.startPointShif * faceDirection.x);
        var inAttPosY = playerPos.y + (this.startPointShif * faceDirection.y);
        if (this.shape == WeaponShape.LINE_1) {
            return this.attackInLine(result, inAttPosX, inAttPosY, playerPos, faceDirection, valueMatrix, 1);
        }
        else if (this.shape == WeaponShape.LINE_2) {
            return this.attackInLine(result, inAttPosX, inAttPosY, playerPos, faceDirection, valueMatrix, 2);
        }
        else if (this.shape == WeaponShape.LINE_3) {
            return this.attackInLine(result, inAttPosX, inAttPosY, playerPos, faceDirection, valueMatrix, 3);
        }
        else if (this.shape == WeaponShape.LINE_INF) {
            return this.attackInLine(result, inAttPosX, inAttPosY, playerPos, faceDirection, valueMatrix, -1);
        }
        else if (this.shape == WeaponShape.AREA) {
            return this.attackInArea(result, inAttPosX, inAttPosY, playerPos, faceDirection, valueMatrix);
        }
        return result;
    };
    Weapon.prototype.getWeaponName = function () {
        return null;
    };
    Weapon.prototype.getCurrentCoolDown = function () {
        return this.curCooldown;
    };
    //LeftOnFloor():List of FloorObject{}	
    Weapon.prototype.updateCoolDown = function () {
        if (this.curCooldown > -5) {
            this.curCooldown--;
        }
    };
    Weapon.prototype.isWeaponReady = function () {
        return (this.curCooldown <= 0 ? true : false);
    };
    Weapon.prototype.fireWeapon = function () {
        this.curCooldown = this.cooldown;
    };
    Weapon.prototype.toString = function () {
        var text = "";
        text += "Damage: " + this.damage + ", Cooldown: " + this.cooldown + " , Shift: " + this.startPointShif + ", "
            + this.endingType + ",";
        return text;
    };
    /**Damage that weapon gives: 1 <= damage <= 3 */
    Weapon.MIN_DAMAGE = 1;
    Weapon.MAX_DAMAGE = 3;
    Weapon.DAMAGE_INTERVAL = 1;
    /** Time of shot cooldown: 1, 3, 5 */
    Weapon.MIN_COOLDOWN = 1;
    Weapon.MAX_COOLDOWN = 5;
    Weapon.COOLDOWN_INTERVAL = 2;
    /** Where the weapon attack start: 0, 1, 2, 3 (squares ahead the player) */
    Weapon.MIN_SHIFT = 0;
    Weapon.MAX_SHIFT = 2;
    Weapon.SHIFT_INTERVAL = 1;
    Weapon.WEAPON_SHAPE = [WeaponShape.LINE_1, WeaponShape.LINE_2, WeaponShape.LINE_3, WeaponShape.LINE_INF,
        WeaponShape.AREA /*, WeaponShape.CONE_2, WeaponShape.CONE_3, WeaponShape.CONE_4*/];
    /** Type of the shot: normal or leave_behind (e.g. mine) */
    Weapon.SHOT_TYPE = [ShotType.NORMAL, ShotType.LEAVE_OBJECT];
    /** What happen when bullet collide with enemy  */
    Weapon.WEAPON_ON_COLISION = [WeaponOnColision.EXPLODE, WeaponOnColision.PENETRATE];
    /** What happen when the left object do on collosion  */
    Weapon.TYPE_COLIDED_OBJECT = [TypeColidedObject.DIE_ON_COLISION, TypeColidedObject.DIE_WITH_TIME];
    /** What happen when time is out from LeaveObj */
    Weapon.ENDING_TYPES = [ColidedEndingType.NOTHING, ColidedEndingType.EXPLODE];
    return Weapon;
}());
var WeaponGenerator = (function () {
    function WeaponGenerator() {
    }
    WeaponGenerator.GenerateWeapon = function (paramSet, random) {
        var weapon = new Weapon();
        var previousRandom = random;
        weapon.damage = random.integerInRange(0, Weapon.MAX_DAMAGE - Weapon.MIN_DAMAGE) + Weapon.MIN_DAMAGE;
        var i = Math.floor(Weapon.MAX_COOLDOWN - Weapon.MIN_COOLDOWN / Weapon.COOLDOWN_INTERVAL) + 1;
        weapon.cooldown = random.integerInRange(0, i) * Weapon.COOLDOWN_INTERVAL + Weapon.MIN_COOLDOWN;
        weapon.curCooldown = 0;
        i = Math.floor(Weapon.MAX_SHIFT - Weapon.MIN_SHIFT / Weapon.SHIFT_INTERVAL) + 1;
        weapon.startPointShif = random.integerInRange(0, i) * Weapon.SHIFT_INTERVAL + Weapon.MIN_SHIFT;
        weapon.endingType = Weapon.ENDING_TYPES[random.integerInRange(0, Weapon.ENDING_TYPES.length)];
        weapon.shape = Weapon.WEAPON_SHAPE[random.integerInRange(0, Weapon.WEAPON_SHAPE.length - 1)];
        weapon.shotType = Weapon.SHOT_TYPE[random.integerInRange(0, Weapon.SHOT_TYPE.length - 1)];
        weapon.typeColidedObj = Weapon.TYPE_COLIDED_OBJECT[random.integerInRange(0, Weapon.TYPE_COLIDED_OBJECT.length - 1)];
        weapon.wOnColision = Weapon.WEAPON_ON_COLISION[random.integerInRange(0, Weapon.WEAPON_ON_COLISION.length - 1)];
        random = previousRandom;
        return weapon;
    };
    return WeaponGenerator;
}());
var BaseGameState = (function (_super) {
    __extends(BaseGameState, _super);
    function BaseGameState() {
        _super.call(this);
    }
    return BaseGameState;
}(Phaser.State));
var GameplayState = (function (_super) {
    __extends(GameplayState, _super);
    function GameplayState() {
        _super.call(this);
    }
    GameplayState.prototype.preload = function () {
        this.game.load.spritesheet("graphics", "assets/graphics/gameGraphics.png", 32, 32);
    };
    GameplayState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.createCurrentRoom(Global.getCurrentRoom());
        this.lastDirection = new Phaser.Point(0, 1);
    };
    GameplayState.prototype.addDoor = function (direction, cleared) {
        var tempDoor = new DoorTile(this.game, direction);
        tempDoor.lock();
        if (cleared) {
            tempDoor.unlock();
        }
        this.game.add.existing(tempDoor);
        this.currentDoors.push(tempDoor);
    };
    GameplayState.prototype.createCurrentRoom = function (room) {
        this.currentDoors = [];
        for (var x = 0; x < Global.ROOM_WIDTH; x++) {
            for (var y = 0; y < Global.ROOM_HEIGHT; y++) {
                switch (room.tileMatrix[x][y]) {
                    case TileTypeEnum.Passable:
                        this.game.add.existing(new EmptyTile(this.game, x, y));
                        break;
                    case TileTypeEnum.Wall:
                        this.game.add.existing(new WallTile(this.game, x, y));
                        break;
                    case TileTypeEnum.Door:
                        if (x == 0) {
                            this.addDoor(new Phaser.Point(-1, 0), room.cleared || room.difficulty == DifficultyEnum.None);
                        }
                        if (x == Global.ROOM_WIDTH - 1) {
                            this.addDoor(new Phaser.Point(1, 0), room.cleared || room.difficulty == DifficultyEnum.None);
                        }
                        if (y == 0) {
                            this.addDoor(new Phaser.Point(0, -1), room.cleared || room.difficulty == DifficultyEnum.None);
                        }
                        if (y == Global.ROOM_HEIGHT - 1) {
                            this.addDoor(new Phaser.Point(0, 1), room.cleared || room.difficulty == DifficultyEnum.None);
                        }
                        break;
                }
            }
        }
        this.highlightTiles = [];
        for (var i = 0; i < 2 * (Global.ROOM_WIDTH + Global.ROOM_HEIGHT); i++) {
            var tempTile = new HighlightTile(this.game);
            this.highlightTiles.push(tempTile);
            this.game.add.existing(tempTile);
        }
        this.arrowHighlight = new DirHighlightTile(this.game);
        this.game.add.existing(this.arrowHighlight);
        if (Global.currentWeapon == null) {
            Global.currentWeapon = WeaponGenerator.GenerateWeapon(null, this.game.rnd);
        }
        this.boxObject = new BoxObject(this.game);
        this.game.add.existing(this.boxObject);
        this.enemyObjects = [];
        var numOfEnemies = room.difficulty * 2;
        if (room.cleared) {
            numOfEnemies = 0;
        }
        var tiles = room.getMatrix(this.enemyObjects);
        tiles[Math.floor(Global.ROOM_WIDTH / 2)][0] = TileTypeEnum.Wall;
        tiles[Math.floor(Global.ROOM_WIDTH / 2)][Global.ROOM_HEIGHT - 1] = TileTypeEnum.Wall;
        tiles[0][Math.floor(Global.ROOM_HEIGHT / 2)] = TileTypeEnum.Wall;
        tiles[Global.ROOM_WIDTH - 1][Math.floor(Global.ROOM_HEIGHT / 2)] = TileTypeEnum.Wall;
        for (var i = 0; i < numOfEnemies; i++) {
            var list = this.getEmptyTiles(tiles);
            var point = list[this.game.rnd.integerInRange(0, list.length - 1)];
            tiles[point.x][point.y] = TileTypeEnum.Enemy;
            var tempEnemy = new EnemyObject(this.game, point.x, point.y, 1);
            this.enemyObjects.push(tempEnemy);
            this.game.add.existing(tempEnemy);
        }
        this.playerObject = new PlayerObject(this.game, Math.floor(Global.ROOM_WIDTH / 2) +
            Global.previousDirection.x * (Math.floor(Global.ROOM_WIDTH / 2) - 1), Math.floor(Global.ROOM_HEIGHT / 2) +
            Global.previousDirection.y * (Math.floor(Global.ROOM_HEIGHT / 2) - 1), Global.currentWeapon);
        this.game.add.existing(this.playerObject);
        if (room.difficulty == DifficultyEnum.None && !room.cleared) {
            this.showBoxObject();
        }
    };
    GameplayState.prototype.highlight = function (damageMatrix) {
        this.unhighlight();
        var index = 0;
        for (var y = 0; y < Global.ROOM_HEIGHT; y++) {
            for (var x = 0; x < Global.ROOM_WIDTH; x++) {
                if (damageMatrix[y][x] > 0) {
                    this.highlightTiles[index].x = x * Global.TILE_SIZE;
                    this.highlightTiles[index].y = y * Global.TILE_SIZE;
                    this.highlightTiles[index].show();
                    index++;
                }
            }
        }
    };
    GameplayState.prototype.unhighlight = function () {
        for (var i = 0; i < this.highlightTiles.length; i++) {
            this.highlightTiles[i].hide();
        }
    };
    GameplayState.prototype.isHighlighted = function () {
        return this.highlightTiles[0].alpha == 1;
    };
    GameplayState.prototype.getEmptyTiles = function (tiles) {
        var result = [];
        for (var x = 0; x < tiles.length; x++) {
            for (var y = 0; y < tiles[x].length; y++) {
                if (tiles[x][y] == TileTypeEnum.Passable) {
                    result.push(new Phaser.Point(x, y));
                }
            }
        }
        return result;
    };
    GameplayState.prototype.handleAttack = function (damage) {
        var lastEnemyDied = false;
        var listOfIndeces = [];
        for (var i = 0; i < this.enemyObjects.length; i++) {
            var eP = this.enemyObjects[i].getTilePosition();
            if (this.enemyObjects[i].takeDamage(damage[eP.y][eP.x])) {
                listOfIndeces.push(i);
            }
        }
        for (var i = listOfIndeces.length - 1; i >= 0; i--) {
            this.enemyObjects.splice(listOfIndeces[i], 1);
            lastEnemyDied = true;
        }
        if (lastEnemyDied && this.enemyObjects.length <= 0) {
            this.showBoxObject();
        }
    };
    GameplayState.prototype.showBoxObject = function () {
        var matrix = Global.getCurrentRoom().getMatrix(this.enemyObjects);
        var freePositions = this.getEmptyTiles(matrix);
        matrix[this.playerObject.getTilePosition().x][this.playerObject.getTilePosition().y] = TileTypeEnum.Wall;
        this.boxObject.show(freePositions[this.game.rnd.integerInRange(0, freePositions.length - 1)], matrix);
    };
    GameplayState.prototype.handleCollision = function () {
        var playerPosition = this.playerObject.getTilePosition();
        for (var i = 0; i < this.currentDoors.length; i++) {
            if (this.currentDoors[i].checkCollision(playerPosition.x, playerPosition.y)) {
                Global.currentX += this.currentDoors[i].direction.x;
                Global.currentY += this.currentDoors[i].direction.y;
                Global.previousDirection.set(-this.currentDoors[i].direction.x, -this.currentDoors[i].direction.y);
                this.game.state.start("gameplay", true);
                break;
            }
        }
        for (var i = 0; i < this.enemyObjects.length; i++) {
            if (this.enemyObjects[i].checkCollision(playerPosition.x, playerPosition.y)) {
                this.playerObject.killObject();
                this.playerObject = null;
                return true;
            }
        }
        if (!Global.getCurrentRoom().cleared && this.enemyObjects.length <= 0) {
            if (this.boxObject.checkCollision(playerPosition.x, playerPosition.y)) {
                Global.currentWeapon = WeaponGenerator.GenerateWeapon(null, this.game.rnd);
                this.playerObject.setWeapon(Global.currentWeapon);
                this.boxObject.destroy();
                for (var i = 0; i < this.currentDoors.length; i++) {
                    this.currentDoors[i].unlock();
                }
                Global.getCurrentRoom().cleared = true;
                Global.crateNumber += 1;
            }
        }
        return false;
    };
    GameplayState.prototype.handleEnemyCollision = function () {
        var playerPosition = this.playerObject.getTilePosition();
        for (var i = 0; i < this.enemyObjects.length; i++) {
            if (this.enemyObjects[i].checkCollision(playerPosition.x, playerPosition.y)) {
                this.playerObject.killObject();
                this.playerObject = null;
                return true;
            }
        }
        return false;
    };
    GameplayState.prototype.stepUpdate = function () {
        if (this.handleCollision()) {
            return;
        }
        for (var i = 0; i < this.enemyObjects.length; i++) {
            this.enemyObjects[i].moveEnemy(this.playerObject.getTilePosition(), Global.getCurrentRoom().getMatrix(this.enemyObjects));
        }
        if (this.handleEnemyCollision()) {
            return;
        }
        this.playerObject.getWeapon().updateCoolDown();
        console.log(this.playerObject.getWeapon().getCurrentCoolDown());
    };
    GameplayState.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            console.log(this.playerObject.getWeapon().toString());
        }
        if (this.playerObject == null) {
            return;
        }
        var direction = new Phaser.Point();
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
                this.highlight(this.playerObject.getWeapon().getWeaponPositions(this.playerObject.getTilePosition(), this.lastDirection, Global.getCurrentRoom().getMatrix(this.enemyObjects)));
                this.game.input.keyboard.reset();
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.X)) {
                this.arrowHighlight.hide();
                this.unhighlight();
                this.playerObject.getWeapon().fireWeapon();
                this.handleAttack(this.playerObject.getWeapon().getWeaponPositions(this.playerObject.getTilePosition(), this.lastDirection, Global.getCurrentRoom().getMatrix(this.enemyObjects)));
                this.stepUpdate();
                this.game.input.keyboard.reset();
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.Z)) {
                this.arrowHighlight.hide();
                this.unhighlight();
                this.game.input.keyboard.reset();
            }
        }
        else {
            if (direction.x != 0 || direction.y != 0) {
                this.lastDirection = direction;
                this.playerObject.move(direction, Global.getCurrentRoom().getMatrix(this.enemyObjects));
                this.stepUpdate();
                this.game.input.keyboard.reset();
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.X)) {
                this.arrowHighlight.show(this.playerObject.getTilePosition(), this.lastDirection);
                this.highlight(this.playerObject.getWeapon().getWeaponPositions(this.playerObject.getTilePosition(), this.lastDirection, Global.getCurrentRoom().getMatrix(this.enemyObjects)));
                this.game.input.keyboard.reset();
            }
        }
    };
    return GameplayState;
}(BaseGameState));
