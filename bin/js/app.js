var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(372, 480, Phaser.AUTO, 'content', null, false, false);
        this.game.state.add("loading", LoadingState, false);
        this.game.state.add("adventurename", AdventureNameState, false);
        this.game.state.add("gameplay", GameplayState, false);
        this.game.state.add("playerselect", PlayerSelectState, false);
        this.game.state.add("mainmenu", MainMenuState, false);
        this.game.state.start("loading", false, false);
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
    Global.initialize = function (text1, text2, text3, random) {
        Global.levelNumber = 0;
        Global.crateNumber = 0;
        Global.currentWeapon = null;
        Global.currentPlayer = null;
        Global.itemUsage = 0;
        switch (Global.currentGameMode) {
            case GameplayModes.adventure:
                Global.constructLevelName(text1, text2, text3, random);
                Global.constructLevel(random);
                break;
            case GameplayModes.arcade:
                Global.constructSingleLevel(random);
                break;
            case GameplayModes.endless:
                Global.constructSingleLevel(random);
                break;
        }
    };
    Global.constructLevelName = function (inputText1, inputText2, inputText3, random) {
        Global.MAX_LVL_CATEGORY = inputText1.split("\n").length;
        Global.levelCategory = random.integerInRange(0, Global.MAX_LVL_CATEGORY - 1);
        var sizeChoice = Math.floor(AudioManager.AMOUNT_OF_MUSIC / Global.MAX_LVL_CATEGORY);
        Global.levelMusic = random.integerInRange(0, sizeChoice - 1);
        var i1 = random.integerInRange(0, inputText1.split("\n")[Global.levelCategory].split(",").length - 1);
        var i2 = random.integerInRange(0, inputText2.split(",").length - 1);
        var i3 = random.integerInRange(0, inputText3.split(",").length - 1);
        var f1 = inputText1.split("\n")[Global.levelCategory].split(",")[i1].trim();
        var f2 = inputText2.split(",")[i2].trim();
        var f3 = inputText3.split(",")[i3].trim();
        Global.levelName = "The " + f1 + " of the " + f2 + " " + f3;
    };
    Global.getCurrentCost = function () {
        if (Global.itemUsage == 0) {
            return 1;
        }
        return Math.pow(2, Global.itemUsage - 1) * Global.currentPlayer.specialAbility.specialCost;
    };
    Global.matrixTranspose = function (matrix) {
        var result = [];
        for (var y = 0; y < matrix[0].length; y++) {
            result.push([]);
            for (var x = 0; x < matrix.length; x++) {
                result[y].push(matrix[x][y]);
            }
        }
        return result;
    };
    Global.constructSingleLevel = function (random) {
        Global.previousDirection = new Phaser.Point(0, 1);
        Global.mapWidth = 1;
        Global.mapHeight = 1;
        Global.levelRooms = [[new RoomInfoObject(RoomTypeEnum.Boss, random)]];
        Global.currentX = 0;
        Global.currentY = 0;
    };
    Global.constructLevel = function (random) {
        Global.previousDirection = new Phaser.Point(0, 0);
        var probabilityOfEmptyPlace = 0.08;
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
                var roomType = RoomTypeEnum.Enemy;
                if (Math.random() < probabilityOfEmptyPlace) {
                    roomType = RoomTypeEnum.None;
                }
                Global.levelRooms[p.x][p.y] = new RoomInfoObject(roomType, random);
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
        Global.levelRooms[Global.currentX][Global.currentY].roomType = RoomTypeEnum.None;
        if (Global.levelNumber > 0) {
            Global.levelRooms[Global.currentX][Global.currentY].cleared = true;
        }
        while (sets.length > 1) {
            var firstIndex = random.integerInRange(0, sets.length - 1);
            var secondIndex = (firstIndex + random.integerInRange(1, sets.length - 1)) % sets.length;
            var connections = sets[firstIndex].getListOfConnections(sets[secondIndex]);
            if (connections.length > 0) {
                sets[firstIndex].combine(sets[secondIndex]);
                sets.splice(secondIndex, 1);
                var numConn = random.integerInRange(1, connections.length / 2);
                for (var i = 0; i < numConn; i++) {
                    var randomIndex = random.integerInRange(0, connections.length / 2 - 1);
                    var fRoom = connections.splice(2 * randomIndex + 1, 1)[0];
                    var sRoom = connections.splice(2 * randomIndex, 1)[0];
                    Global.levelRooms[fRoom.x][fRoom.y].setDoor(new Phaser.Point(sRoom.x - fRoom.x, sRoom.y - fRoom.y));
                    Global.levelRooms[sRoom.x][sRoom.y].setDoor(new Phaser.Point(fRoom.x - sRoom.x, fRoom.y - sRoom.y));
                }
            }
        }
        for (var x = 0; x < Global.mapWidth; x++) {
            for (var y = 0; y < Global.mapHeight; y++) {
                if (Global.levelRooms[x][y] != null &&
                    Global.levelRooms[x][y].roomType == RoomTypeEnum.None &&
                    Global.levelRooms[x][y].getNumberOfConnection() <= 1 &&
                    !(x == Global.currentX && y == Global.currentY)) {
                    Global.levelRooms[x][y].roomType = RoomTypeEnum.Enemy;
                }
            }
        }
    };
    Global.getCurrentRoom = function () {
        return Global.levelRooms[Global.currentX][Global.currentY];
    };
    Global.isDungeonFinished = function () {
        for (var x = 0; x < Global.mapWidth; x++) {
            for (var y = 0; y < Global.mapHeight; y++) {
                if (Global.levelRooms[x][y] != null && !(Global.currentX == x && Global.currentY == y) &&
                    (!Global.levelRooms[x][y].cleared &&
                        Global.levelRooms[x][y].roomType != RoomTypeEnum.None)) {
                    return false;
                }
            }
        }
        return true;
    };
    Global.TILE_SIZE = 32;
    Global.MAP_SIZE = 10;
    Global.ROOM_WIDTH = 11;
    Global.ROOM_HEIGHT = 11;
    Global.MAX_LVL_CATEGORY = 1;
    Global.levelNumber = 0;
    Global.levelName = "";
    Global.levelCategory = 0;
    Global.levelMusic = 0;
    Global.crateNumber = 0;
    Global.itemUsage = 0;
    Global.currentWeapon = null;
    Global.currentPlayer = null;
    Global.currentX = 0;
    Global.currentY = 0;
    Global.mapWidth = 0;
    Global.mapHeight = 0;
    return Global;
}());
var AudioManager = (function () {
    function AudioManager() {
        this.power_up = null;
        this.enemies = null;
        this.attacks = null;
        this.hurt = null;
        this.menuSelection = null;
        this.menuSelected = null;
        this.pickupCrate = null;
        this.walk = null;
        this.specials = null;
        this.pickNPC = null;
        this.completeLevelMusic = null;
        this.lastWalk = 0;
    }
    AudioManager.prototype.preload = function (game) {
        this.lastWalk = 0;
        this.attacks = new Array(AudioManager.AMOUNT_OF_ATTACKS);
        //audio
        game.load.audio("powerup", "assets/audio/powerup2-low.mp3");
        game.load.audio("sbbuller", "assets/audio/Super Box/sndBullet.wav");
        game.load.audio("sbburn", "assets/audio/Super Box/sndBurn.wav");
        game.load.audio("sbdisc", "assets/audio/Super Box/sndDisc.wav");
        game.load.audio("sbexplode", "assets/audio/Super Box/sndExplode.wav");
        game.load.audio("sbflame", "assets/audio/Super Box/sndFlame.wav");
        game.load.audio("sbkatana", "assets/audio/Super Box/sndKatana.wav");
        game.load.audio("sblaserfire", "assets/audio/Super Box/sndLaserFire.wav");
        game.load.audio("sbminigun", "assets/audio/Super Box/sndMinigun.wav");
        game.load.audio("sbnapalm", "assets/audio/Super Box/sndNapalm.wav");
        game.load.audio("sbrevolver", "assets/audio/Super Box/sndRevolver.wav");
        game.load.audio("sbrocket", "assets/audio/Super Box/sndRocket.wav");
        game.load.audio("sbsar", "assets/audio/Super Box/sndSaw.wav");
        game.load.audio("sbshotgun", "assets/audio/Super Box/sndShotgun.wav");
        for (var i = 13; i < 19; i++) {
            game.load.audio("attack" + (i - 12), "assets/audio/Original/attack" + (i - 12) + ".wav");
        }
        this.hurt = new Array(AudioManager.AMOUNT_OF_HURT);
        for (var i = 0; i < AudioManager.AMOUNT_OF_HURT; i++) {
            game.load.audio("hurt" + (i + 1), "assets/audio/Original/hurt" + (i + 1) + ".wav");
        }
        game.load.audio("pickup", "assets/audio/Original/pickup1.wav");
        game.load.audio("menuselection", "assets/audio/Original/menuselection.wav");
        game.load.audio("menuselected", "assets/audio/Original/selected.wav");
        this.enemies = new Array(AudioManager.AMOUNT_OF_ENEMIES);
        for (var i = 0; i < AudioManager.AMOUNT_OF_ENEMIES; i++) {
            game.load.audio("enemy" + (i + 1), "assets/audio/Original/enemy" + (i + 1) + ".wav");
        }
        this.walk = new Array(AudioManager.AMOUNT_OF_WALK);
        for (var i = 0; i < AudioManager.AMOUNT_OF_WALK; i++) {
            game.load.audio("walk" + (i + 1), "assets/audio/Original/walk" + (i + 1) + ".wav");
        }
        this.specials = new Array(3);
        game.load.audio("special0", "assets/audio/Original/changeweapon.wav");
        game.load.audio("special1", "assets/audio/Original/attackeveryone.wav");
        game.load.audio("special2", "assets/audio/Original/teleport.wav");
        game.load.audio("pickNPC", "assets/audio/Original/pickperson.wav");
        //music
        game.load.audio("musicTitle", "assets/music/gameMusicTitle.mp3");
        game.load.audio("music1", "assets/music/sacrificial.mp3");
        game.load.audio("music2", "assets/music/Super Crate Box/LEV0.mp3");
        game.load.audio("music3", "assets/music/Super Crate Box/LEV1.mp3");
        game.load.audio("music4", "assets/music/Super Crate Box/LEV2.mp3");
        game.load.audio("music5", "assets/music/Super Crate Box/LEV3.mp3");
        game.load.audio("music6", "assets/music/gameMusic.mp3");
        game.load.audio("music7", "assets/music/gameMusic2.mp3");
        game.load.audio("music8", "assets/music/gameMusic3.mp3");
        game.load.audio("music9", "assets/music/Spelunky/mCave.mp3");
        game.load.audio("music10", "assets/music/Spelunky/mIce.mp3");
        game.load.audio("music11", "assets/music/Spelunky/mTemple.mp3");
        game.load.audio("music12", "assets/music/Spelunky/mLush.mp3");
        AudioManager.musics = new Array(AudioManager.AMOUNT_OF_MUSIC);
        AudioManager.isMusicPlaying = new Array(AudioManager.AMOUNT_OF_MUSIC);
        for (var i = 0; i < AudioManager.AMOUNT_OF_MUSIC; i++)
            AudioManager.isMusicPlaying[i] = false;
        game.load.audio("musiccompletelvl", "assets/music/Spelunky/mVictory.mp3");
    };
    AudioManager.prototype.addSounds = function (game) {
        this.lastWalk = 0;
        //audio
        this.power_up = game.add.audio("powerup");
        this.attacks[0] = game.add.audio("sbbuller");
        this.attacks[1] = game.add.audio("sbburn");
        this.attacks[2] = game.add.audio("sbdisc");
        this.attacks[3] = game.add.audio("sbexplode");
        this.attacks[4] = game.add.audio("sbflame");
        this.attacks[5] = game.add.audio("sbkatana");
        this.attacks[6] = game.add.audio("sblaserfire");
        this.attacks[7] = game.add.audio("sbminigun");
        this.attacks[8] = game.add.audio("sbnapalm");
        this.attacks[9] = game.add.audio("sbrevolver");
        this.attacks[10] = game.add.audio("sbrocket");
        this.attacks[11] = game.add.audio("sbsar");
        this.attacks[12] = game.add.audio("sbshotgun");
        for (var i = 13; i < 19; i++) {
            this.attacks[i] = game.add.audio("attack" + (i - 12));
        }
        for (var i = 0; i < AudioManager.AMOUNT_OF_HURT; i++) {
            this.hurt[i] = game.add.audio("hurt" + (i + 1));
        }
        this.pickupCrate = game.add.audio("pickup");
        this.menuSelection = game.add.audio("menuselection");
        this.menuSelected = game.add.audio("menuselected");
        for (var i = 0; i < AudioManager.AMOUNT_OF_ENEMIES; i++) {
            this.enemies[i] = game.add.audio("enemy" + (i + 1));
        }
        for (var i = 0; i < AudioManager.AMOUNT_OF_WALK; i++) {
            this.walk[i] = game.add.audio("walk" + (i + 1));
        }
        this.specials[0] = game.add.audio("special0");
        this.specials[1] = game.add.audio("special1");
        this.specials[2] = game.add.audio("special2");
        this.pickNPC = game.add.audio("pickNPC");
        //music
        AudioManager.musicTitle = game.add.audio("musicTitle");
        AudioManager.musicTitle.loop = true;
        for (var i = 0; i < AudioManager.AMOUNT_OF_MUSIC; i++) {
            AudioManager.musics[i] = game.add.audio("music" + (i + 1));
            AudioManager.musics[i].loop = true;
        }
        this.pickNPC = game.add.audio("musiccompletelvl");
    };
    AudioManager.prototype.playPowerUp = function () {
        this.power_up.play();
    };
    /**
     * Play the game's title music.
     */
    AudioManager.prototype.playTitleMusic = function () {
        AudioManager.musicTitle.play();
        AudioManager.musicTitle.volume = 0.6;
    };
    AudioManager.prototype.stopTitleMusic = function () {
        AudioManager.musicTitle.stop();
    };
    /**
     * Play the selected music
     * @param id: id of the music in this.musics. 0 <= id < AudioManager.AMOUNT_OF_MUSIC
     */
    AudioManager.prototype.playMusic = function (id) {
        if (!AudioManager.musics[id].isPlaying)
            AudioManager.musics[id].play();
        AudioManager.musics[id].volume = 0.5;
    };
    AudioManager.prototype.stopMusic = function () {
        for (var i = 0; i < AudioManager.musics.length; i++)
            AudioManager.musics[i].stop();
    };
    AudioManager.prototype.playMenuSelection = function () {
        this.menuSelection.play();
    };
    AudioManager.prototype.playMenuSelected = function () {
        this.menuSelected.play();
    };
    AudioManager.prototype.playTakeDamage = function (random) {
        this.hurt[random.between(0, this.hurt.length - 1)].play();
    };
    AudioManager.prototype.playAttack = function (id) {
        this.attacks[id].play();
    };
    AudioManager.prototype.playWalk = function () {
        this.walk[this.lastWalk].play();
        this.lastWalk++;
        if (this.lastWalk >= AudioManager.AMOUNT_OF_WALK)
            this.lastWalk = 0;
    };
    AudioManager.prototype.playPickUpCrate = function () {
        this.pickupCrate.play();
    };
    AudioManager.prototype.playEnemyDead = function (random) {
        this.enemies[random.between(0, this.enemies.length - 1)].play();
    };
    AudioManager.prototype.playFinishLevel = function () {
        this.completeLevelMusic.play();
    };
    AudioManager.prototype.stopFinishLevel = function () {
        this.completeLevelMusic.stop();
    };
    AudioManager.prototype.playSpecial = function (person) {
        this.specials[person].play();
    };
    AudioManager.prototype.playPickNPC = function () {
        this.pickNPC.play();
    };
    AudioManager.musics = null;
    AudioManager.isMusicPlaying = null;
    AudioManager.musicTitle = null;
    AudioManager.AMOUNT_OF_MUSIC = 12;
    AudioManager.AMOUNT_OF_ATTACKS = 19;
    AudioManager.AMOUNT_OF_HURT = 3;
    AudioManager.AMOUNT_OF_WALK = 5;
    AudioManager.AMOUNT_OF_ENEMIES = 8;
    AudioManager.AMOUNT_OF_SPECIALS = 3;
    AudioManager.SPECIAL_AAT = 0;
    AudioManager.SPECIAL_GAT = 1;
    AudioManager.SPECIAL_TAT = 2;
    return AudioManager;
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
    function BaseUIObject(game) {
        _super.call(this, game);
        this.fixedToCamera = true;
    }
    return BaseUIObject;
}(Phaser.Group));
/// <reference path="BaseGameObject.ts"/>
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
    BoxObject.prototype.show = function (tilePosition) {
        this.sprite.alpha = 1;
        this.x = tilePosition.x * Global.TILE_SIZE;
        this.y = tilePosition.y * Global.TILE_SIZE;
    };
    BoxObject.prototype.collectCrate = function () {
        this.game.add.existing(new WeaponName(this.game, this.getTilePosition().x, this.getTilePosition().y, Global.currentWeapon.getWeaponName()));
        Global.audioManager.playPickUpCrate();
        this.killObject();
    };
    return BoxObject;
}(BaseGameObject));
var PlayerObject = (function (_super) {
    __extends(PlayerObject, _super);
    function PlayerObject(game, x, y, weapon) {
        _super.call(this, game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
        this.playerSprite = this.game.add.sprite(0, 0, 'graphics');
        this.playerSprite.animations.add("normal", [Global.currentPlayer.graphicsIndex]);
        this.add(this.playerSprite);
        this.playerWeapon = weapon;
        this.playerSprite.animations.play("normal");
        this.playerHealth = 1;
        this.isAlive = true;
        var cd = 0;
        if (this.getWeapon() != null) {
            cd = this.getWeapon().getCurrentCoolDown();
        }
        var style = { font: "10px pixelFont", fill: "#86b7c0", align: "left" };
        this.coolDownText = this.game.add.text(Global.TILE_SIZE - 3, Global.TILE_SIZE - 10, cd.toString(), style, this);
        this.coolDownText.anchor.set(0, 0);
        this.add(this.coolDownText);
        if (cd > 0) {
            this.coolDownText.alpha = 1;
        }
        else {
            this.coolDownText.alpha = 0;
        }
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
        if (canMove) {
            Global.audioManager.playWalk();
        }
        return canMove;
    };
    PlayerObject.prototype.setWeapon = function (newWeapon) {
        this.playerWeapon = newWeapon;
    };
    PlayerObject.prototype.getWeapon = function () {
        return this.playerWeapon;
    };
    PlayerObject.prototype.fireWeapon = function () {
        Global.audioManager.playAttack(this.getWeapon().idSound);
        this.getWeapon().fireWeapon();
    };
    PlayerObject.prototype.takeDamage = function () {
        this.playerHealth = this.playerHealth - 1;
        if (this.playerHealth <= 0) {
            Global.audioManager.playTakeDamage(this.game.rnd);
            this.killObject();
        }
    };
    PlayerObject.prototype.updateCoolDown = function () {
        if (this.getWeapon() != null) {
            this.getWeapon().updateCoolDown();
        }
    };
    PlayerObject.prototype.isPlayerAlive = function () {
        return this.isAlive;
    };
    PlayerObject.prototype.update = function () {
        _super.prototype.update.call(this);
        this.coolDownText.alpha = 0;
        var cd = 0;
        if (this.getWeapon() != null) {
            cd = this.getWeapon().getCurrentCoolDown();
        }
        if (cd > 0) {
            this.coolDownText.alpha = 1;
            this.coolDownText.text = cd.toString();
            this.coolDownText.anchor.set(0, 0);
        }
    };
    return PlayerObject;
}(BaseGameObject));
/// <reference path="BaseGameObject.ts"/>
var PortalObject = (function (_super) {
    __extends(PortalObject, _super);
    function PortalObject(game) {
        _super.call(this, game, 0, 0);
        this.sprite = this.game.add.sprite(0, 0, "graphics");
        this.sprite.animations.add("normal", [0]);
        this.sprite.animations.play("normal");
        this.sprite.tint = 0xffcc66;
        this.sprite.alpha = 0;
        this.add(this.sprite);
    }
    PortalObject.prototype.showPortal = function (x, y) {
        this.sprite.alpha = 1;
        this.x = x * Global.TILE_SIZE;
        this.y = y * Global.TILE_SIZE;
    };
    PortalObject.prototype.enterPortal = function () {
        Global.levelNumber += 1;
        Global.constructLevel(this.game.rnd);
        this.game.state.start("gameplay");
    };
    return PortalObject;
}(BaseGameObject));
var RoomTypeEnum;
(function (RoomTypeEnum) {
    RoomTypeEnum[RoomTypeEnum["None"] = 0] = "None";
    RoomTypeEnum[RoomTypeEnum["Enemy"] = 1] = "Enemy";
    RoomTypeEnum[RoomTypeEnum["Spawning"] = 2] = "Spawning";
    RoomTypeEnum[RoomTypeEnum["Boss"] = 3] = "Boss";
})(RoomTypeEnum || (RoomTypeEnum = {}));
var TileTypeEnum;
(function (TileTypeEnum) {
    TileTypeEnum[TileTypeEnum["Passable"] = 0] = "Passable";
    TileTypeEnum[TileTypeEnum["Hole"] = 1] = "Hole";
    TileTypeEnum[TileTypeEnum["Wall"] = 2] = "Wall";
    TileTypeEnum[TileTypeEnum["Door"] = 3] = "Door";
    TileTypeEnum[TileTypeEnum["Enemy"] = 4] = "Enemy";
    TileTypeEnum[TileTypeEnum["Box"] = 5] = "Box";
})(TileTypeEnum || (TileTypeEnum = {}));
/// <reference path="RoomTypeEnum.ts"/>
/// <reference path="TileTypeEnum.ts"/>
var RoomInfoObject = (function () {
    function RoomInfoObject(type, random) {
        this.roomType = type;
        this.cleared = false;
        this.visited = false;
        this.connections = 0;
        this.constMatrix(random);
    }
    RoomInfoObject.prototype.constMatrix = function (random) {
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
        var shapeSize = random.integerInRange(1, 4);
        var numberOfShapes = random.integerInRange(0, 3);
        if (numberOfShapes == 3) {
            shapeSize = random.integerInRange(1, 3);
        }
        for (var s = 0; s < numberOfShapes; s++) {
            var pattern = [];
            var direction = new Phaser.Point();
            var tileType = TileTypeEnum.Wall;
            var tempX = random.integerInRange(1, Math.floor(Global.ROOM_WIDTH / 2) - 1);
            var tempY = random.integerInRange(1, Math.floor(Global.ROOM_HEIGHT / 2) - 1);
            for (var i = 0; i < shapeSize; i++) {
                pattern.push(new Phaser.Point(tempX + direction.x, tempY + direction.y));
                if (Math.random() < 0.5) {
                    direction.x = random.integerInRange(0, 1) * 2 - 1;
                    if (x <= 1) {
                        direction.x = 1;
                    }
                    if (x >= Global.ROOM_WIDTH / 2 - 1) {
                        direction.x = -1;
                    }
                }
                else {
                    direction.y = random.integerInRange(0, 1) * 2 - 1;
                    if (y <= 1) {
                        direction.y = 1;
                    }
                    if (y >= Global.ROOM_HEIGHT / 2 - 1) {
                        direction.y = -1;
                    }
                }
            }
            var coverP = random.integerInRange(0, 3);
            for (var i = 0; i < pattern.length; i++) {
                var p = pattern[i];
                if (coverP == 0 || coverP == 1) {
                    this.tileMatrix[p.x][p.y] = tileType;
                    this.tileMatrix[Global.ROOM_WIDTH - p.x - 1][p.y] = tileType;
                    this.tileMatrix[p.x][Global.ROOM_HEIGHT - p.y - 1] = tileType;
                    this.tileMatrix[Global.ROOM_WIDTH - p.x - 1][Global.ROOM_HEIGHT - p.y - 1] = tileType;
                }
                else if (coverP == 2) {
                    this.tileMatrix[p.x][p.y] = tileType;
                    this.tileMatrix[Global.ROOM_WIDTH - p.x - 1][Global.ROOM_HEIGHT - p.y - 1] = tileType;
                }
                else if (coverP == 3) {
                    this.tileMatrix[Global.ROOM_WIDTH - p.x - 1][p.y] = tileType;
                    this.tileMatrix[p.x][Global.ROOM_HEIGHT - p.y - 1] = tileType;
                }
            }
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
        if (this.cleared || (this.roomType == RoomTypeEnum.None &&
            !(Global.previousDirection.getMagnitude() == 0 && Global.levelNumber == 0))) {
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
        if (direction.x < 0 && direction.y == 0) {
            return (this.connections & 0x1) > 0;
        }
        if (direction.x > 0 && direction.y == 0) {
            return (this.connections & 0x2) > 0;
        }
        if (direction.y < 0 && direction.x == 0) {
            return (this.connections & 0x4) > 0;
        }
        if (direction.y > 0 && direction.x == 0) {
            return (this.connections & 0x8) > 0;
        }
        return false;
    };
    RoomInfoObject.prototype.getNumberOfConnection = function () {
        var value = 0;
        for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
                if (this.checkDoor(new Phaser.Point(x, y))) {
                    value += 1;
                }
            }
        }
        return value;
    };
    return RoomInfoObject;
}());
/// <reference path="../BaseGameObject.ts"/>
/*
- Boss Fights:
    - Movement: pick only one
    - Attack Pattern: pick two of the known patterns for example:
        - random Explosives marked on the ground
        - Laser Attack
        - Leaving Trail
        - Teleport to some place
        - …etc
    - Spawn Enemies: Identify which enemies he will spawn from the list of enemies
 and always spawn around him and I think he need to stop one turn from movement before spawning

I call each step a function called

stepUpdate(playerPosition:Phaser.Point, map:TileTypeEnum[][])

this function should update and do everything and the class should extends BaseGameObject

this is for now :) If the enemy want access to summon stuff I should send the level:GameplayState too

and tell u the functions that will make it work but I need to know what are the stuff u want to do
 so I can modularize the code and have the correct functions :


types of pattern:
1 move randomly
2 chase player
3 spawn enemies
4 shoot at player
5 teleport to a diffferent location
6 damage floor (for a boss that doesn't move as much)
7 charging player (charge for a while, then sprint towards the player)
8 heal itself
9 stun player
10 jumper > gives a noise, jump, shows where it will fall (aiming on the player).
11 rotate around a point
*/
var BossMovementType;
(function (BossMovementType) {
    BossMovementType[BossMovementType["RANDOM"] = 0] = "RANDOM";
    BossMovementType[BossMovementType["CHASE"] = 1] = "CHASE";
    BossMovementType[BossMovementType["SPAWN"] = 2] = "SPAWN";
    BossMovementType[BossMovementType["SHOOT"] = 3] = "SHOOT";
    BossMovementType[BossMovementType["TELEPORT"] = 4] = "TELEPORT";
    BossMovementType[BossMovementType["JUMP"] = 5] = "JUMP";
    BossMovementType[BossMovementType["DAMAGE_FLOOR"] = 6] = "DAMAGE_FLOOR";
    BossMovementType[BossMovementType["HEAL"] = 7] = "HEAL";
    BossMovementType[BossMovementType["STUN"] = 8] = "STUN";
    BossMovementType[BossMovementType["ROTATE"] = 9] = "ROTATE";
})(BossMovementType || (BossMovementType = {}));
var Boss = (function (_super) {
    __extends(Boss, _super);
    function Boss(game, xTile, yTile) {
        _super.call(this, game, xTile * Global.TILE_SIZE, yTile * Global.TILE_SIZE);
        this.movements = null;
        this.curMovementType = -1;
        this.stepsSinceLastMoveChange = 0;
        this.stepsToChangeMove = 0;
        this.health = 0;
        this.damage = 0;
        //
        this.attackCooldown = 0;
        this.movementCooldown = 0;
        this.movementSpeed = 0;
        this.dashSpeed = 0;
        this.spawnEnemy = EnemyTypeEnum.Random;
    }
    Boss.prototype.stepUpdate = function (playerPosition, map) {
        // you can get the random object using this.game.rnd
    };
    /**
     * Handle the damage taken by the player shot
     * Return true if the boss is dead and false otherwise
     */
    Boss.prototype.takeDamage = function (damage) {
    };
    Boss.BOSS_MOVEMENTS = [BossMovementType.RANDOM, BossMovementType.CHASE, BossMovementType.SPAWN, BossMovementType.SHOOT,
        BossMovementType.TELEPORT, BossMovementType.JUMP, BossMovementType.DAMAGE_FLOOR, BossMovementType.HEAL,
        BossMovementType.STUN, BossMovementType.ROTATE];
    return Boss;
}(BaseGameObject));
var LaserEffect = (function (_super) {
    __extends(LaserEffect, _super);
    function LaserEffect(game, x, y, destX, destY) {
        _super.call(this, game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
        this.scaleDownSpeed = 0.05;
        this.direction = new Phaser.Point(destX - x, destY - y);
        this.direction = this.direction.normalize();
        this.x += (this.direction.x + 1) * Global.TILE_SIZE / 2;
        this.y += (this.direction.y + 1) * Global.TILE_SIZE / 2;
        this.graphics = this.game.add.graphics(0, 0, this);
        this.graphics.beginFill(0xcc6668, 1);
        this.graphics.drawRect(Math.abs(this.direction.y) * -2, Math.abs(this.direction.x) * -2, (destX - x) * Global.TILE_SIZE - this.direction.x * Global.TILE_SIZE / 2 + Math.abs(this.direction.y) * 4, (destY - y) * Global.TILE_SIZE - this.direction.y * Global.TILE_SIZE / 2 + Math.abs(this.direction.x) * 4);
        this.graphics.endFill();
        this.add(this.graphics);
    }
    LaserEffect.prototype.update = function () {
        _super.prototype.update.call(this);
        this.scale.x -= Math.abs(this.direction.y) * this.scaleDownSpeed;
        this.scale.y -= Math.abs(this.direction.x) * this.scaleDownSpeed;
        if (this.scale.x <= 0 || this.scale.y <= 0) {
            this.killObject();
        }
    };
    return LaserEffect;
}(BaseGameObject));
var WhiteLayer = (function (_super) {
    __extends(WhiteLayer, _super);
    function WhiteLayer(game, x, y, fadeOutSpeed) {
        _super.call(this, game, x, y);
        this.fadeOutSpeed = fadeOutSpeed;
        this.graphics = this.game.add.graphics(0, 0, this);
        this.graphics.beginFill(0xdddddd, 1);
        this.graphics.drawRect(0, 0, Global.ROOM_WIDTH * Global.TILE_SIZE, Global.ROOM_HEIGHT * Global.TILE_SIZE);
        this.graphics.endFill();
        this.add(this.graphics);
    }
    WhiteLayer.prototype.update = function () {
        _super.prototype.update.call(this);
        this.alpha -= this.fadeOutSpeed;
        if (this.alpha <= 0) {
            this.killObject();
        }
    };
    return WhiteLayer;
}(BaseGameObject));
var EnemyObject = (function (_super) {
    __extends(EnemyObject, _super);
    function EnemyObject(game, x, y, health, numberOfCannons, cannonDirection1) {
        _super.call(this, game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
        this.setDirections();
        if (health < 0 || health > 3) {
            this.enemyHealth = 1;
        }
        else {
            this.enemyHealth = health;
        }
        this.cannons = this.initializeCannons(numberOfCannons, new Phaser.Point(x, y), cannonDirection1);
        this.enemySpeed = 1;
        this.isAlive = true;
        this.keepDirection = 0;
        this.factorDirectionChange = 2;
        this.hitWall = false;
        var style = { font: "10px pixelFont", fill: "#cc6668", align: "right" };
        this.healthText = this.game.add.text(Global.TILE_SIZE - 3, Global.TILE_SIZE + 4, this.enemyHealth.toString(), style, this);
        this.healthText.anchor.set(1, 1);
        this.add(this.healthText);
        if (numberOfCannons > 0) {
            console.log("attack: " + cannonDirection1);
            var tempSprite = this.game.add.sprite((cannonDirection1.x + 1) * Global.TILE_SIZE / 2 - cannonDirection1.x * 4, (cannonDirection1.y + 1) * Global.TILE_SIZE / 2 - cannonDirection1.y * 4, "graphics");
            tempSprite.animations.add("normal", [12]);
            tempSprite.animations.play("normal");
            tempSprite.tint = 0xcc6668;
            tempSprite.angle = cannonDirection1.angle(new Phaser.Point(), true) + 180;
            tempSprite.anchor.set(0.5, 0.5);
            this.add(tempSprite);
        }
    }
    EnemyObject.prototype.initializeCannons = function (numberOfCannons, cannonPos1, cannonDir1) {
        var cannons;
        if (numberOfCannons == 0) {
            cannons = [];
        }
        else {
            cannons = [new CannonObject(this.game, cannonPos1.x, cannonPos1.y, cannonDir1)];
        }
        return cannons;
    };
    EnemyObject.prototype.setDirections = function () {
        this.directions = [new Phaser.Point(1, 0),
            new Phaser.Point(0, 1),
            new Phaser.Point(-1, 0),
            new Phaser.Point(0, -1)];
    };
    EnemyObject.prototype.pickDirection = function () {
        var dir;
        var choose = (Math.floor(Math.random() * 4) + 1) - 1;
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
        var choose = ((Math.floor(Math.random() * 4) + 1) - 1) % constraint;
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
    EnemyObject.prototype.goEnemy = function (enemyDirection, tileMap) {
        if (enemyDirection.x > 0) {
            if (tileMap[this.getTilePosition().x + 1][this.getTilePosition().y] == TileTypeEnum.Passable) {
                this.x += Global.TILE_SIZE * this.enemySpeed;
                if (this.cannons.length > 0) {
                    this.cannons[0].x = this.x / 32;
                }
            }
        }
        if (enemyDirection.x < 0) {
            if (tileMap[this.getTilePosition().x - 1][this.getTilePosition().y] == TileTypeEnum.Passable) {
                this.x -= Global.TILE_SIZE * this.enemySpeed;
                if (this.cannons.length > 0) {
                    this.cannons[0].x = this.x / 32;
                }
            }
        }
        if (enemyDirection.y > 0) {
            if (tileMap[this.getTilePosition().x][this.getTilePosition().y + 1] == TileTypeEnum.Passable) {
                this.y += Global.TILE_SIZE * this.enemySpeed;
                if (this.cannons.length > 0) {
                    this.cannons[0].x = this.x / 32;
                }
            }
        }
        if (enemyDirection.y < 0) {
            if (tileMap[this.getTilePosition().x][this.getTilePosition().y - 1] == TileTypeEnum.Passable) {
                this.y -= Global.TILE_SIZE * this.enemySpeed;
                if (this.cannons.length > 0) {
                    this.cannons[0].x = this.x / 32;
                }
            }
        }
    };
    EnemyObject.prototype.reverseDirection = function (dir) {
        dir.x = dir.x * (-1);
        dir.y = dir.y * (-1);
        return dir;
    };
    EnemyObject.prototype.revertAxis = function (direction) {
        if (direction.x != 0) {
            return new Phaser.Point(0, 1);
        }
        if (direction.y != 0) {
            return new Phaser.Point(1, 0);
        }
    };
    EnemyObject.prototype.enemyMove = function (playerPosition, tileMatrix) {
    };
    EnemyObject.prototype.enemyShot = function (playerPosition, tileMap) {
        if (typeof this.cannons == 'undefined') {
            return null;
        }
        if (this.cannons.length == 1) {
            return this.cannons[0].shoot(playerPosition, this, tileMap);
        }
    };
    EnemyObject.prototype.updateEnemy = function (enemyDirection, tileMap) {
        var canMove = false;
        if (enemyDirection.x > 0) {
            if ((this.getTilePosition().x + this.enemySpeed) < 10 &&
                tileMap[this.getTilePosition().x + this.enemySpeed][this.getTilePosition().y] == TileTypeEnum.Passable) {
                //this.x += Global.TILE_SIZE * this.enemySpeed;
                canMove = true;
            }
        }
        if (enemyDirection.x < 0) {
            if ((this.getTilePosition().x - this.enemySpeed) > 0 &&
                tileMap[this.getTilePosition().x - this.enemySpeed][this.getTilePosition().y] == TileTypeEnum.Passable) {
                //this.x -= Global.TILE_SIZE * this.enemySpeed;
                canMove = true;
            }
        }
        if (enemyDirection.y > 0) {
            if ((this.getTilePosition().y + this.enemySpeed) < 10 &&
                tileMap[this.getTilePosition().x][this.getTilePosition().y + this.enemySpeed] == TileTypeEnum.Passable) {
                //this.y += Global.TILE_SIZE * this.enemySpeed;
                canMove = true;
            }
        }
        if (enemyDirection.y < 0) {
            if ((this.getTilePosition().y - this.enemySpeed) > 0 &&
                tileMap[this.getTilePosition().x][this.getTilePosition().y - this.enemySpeed] == TileTypeEnum.Passable) {
                //this.y -= Global.TILE_SIZE * this.enemySpeed;
                canMove = true;
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
    EnemyObject.prototype.selectParameters = function (selector) {
        var value;
        if (selector == -4) {
            var prob = Math.random();
            if (prob >= 0.2) {
                value = 1;
            }
            else if (prob > 0.1 && prob < 0.2) {
                value = 2;
            }
            else {
                value = 3;
            }
        }
        if (selector == -3) {
            var prob = Math.random();
            if (prob >= 0.3) {
                value = 1;
            }
            else if (prob > 0.1 && prob < 0.3) {
                value = 2;
            }
            else {
                value = 3;
            }
        }
        if (selector == -2) {
            var prob = Math.random();
            if (prob >= 0.5) {
                value = 1;
            }
            else if (prob > 0.2 && prob < 0.3) {
                value = 2;
            }
            else {
                value = 3;
            }
        }
        if (selector == -1) {
            var prob = Math.random();
            if (prob >= 0.6) {
                value = 1;
            }
            else if (prob > 0.2 && prob < 0.6) {
                value = 2;
            }
            else {
                value = 3;
            }
        }
        if (selector == 0) {
            var prob = Math.random();
            if (prob >= 0.7) {
                value = 1;
            }
            else if (prob > 0.4 && prob < 0.7) {
                value = 2;
            }
            else {
                value = 3;
            }
        }
        if (selector == 1) {
            var prob = Math.random();
            if (prob >= 0.8) {
                value = 1;
            }
            else if (prob > 0.3 && prob < 0.5) {
                value = 2;
            }
            else {
                value = 3;
            }
        }
        if (selector == 2) {
            var prob = Math.random();
            if (prob >= 0.9) {
                value = 1;
            }
            else if (prob > 0.3 && prob < 0.9) {
                value = 2;
            }
            else {
                value = 3;
            }
        }
        if (selector == 3) {
            var prob = Math.random();
            if (prob >= 0.9) {
                value = 1;
            }
            else if (prob > 0.3 && prob < 0.6) {
                value = 2;
            }
            else {
                value = 3;
            }
        }
        if (selector == 4) {
            var prob = Math.random();
            if (prob >= 0.8) {
                value = 1;
            }
            else if (prob > 0.7 && prob < 0.8) {
                value = 2;
            }
            else {
                value = 3;
            }
        }
        return value;
    };
    EnemyObject.prototype.getFirstFreeDirection = function (enemyDirection, tileMap) {
        var dir = new Phaser.Point(0, 0);
        for (var i = 1; i < this.directions.length; i++) {
            if (this.updateEnemy(this.directions[i], tileMap) == true) {
                dir = this.directions[i];
            }
        }
        return dir;
    };
    EnemyObject.prototype.getNearDirectionToPlayer = function (enemyDir, playerPosition, tileMap) {
        var dir = new Phaser.Point(0, 0);
        var dist = 9999;
        var directionsRedux = [];
        if (enemyDir.x == 1) {
            directionsRedux.push(new Phaser.Point(0, 1));
            directionsRedux.push(new Phaser.Point(0, -1));
            directionsRedux.push(new Phaser.Point(-1, 0));
        }
        if (enemyDir.x == -1) {
            directionsRedux.push(new Phaser.Point(0, 1));
            directionsRedux.push(new Phaser.Point(0, -1));
            directionsRedux.push(new Phaser.Point(1, 0));
            directionsRedux.push(new Phaser.Point(0, 0));
        }
        if (enemyDir.y == 1) {
            directionsRedux.push(new Phaser.Point(1, 0));
            directionsRedux.push(new Phaser.Point(-1, 0));
            directionsRedux.push(new Phaser.Point(0, -1));
            directionsRedux.push(new Phaser.Point(0, 0));
        }
        if (enemyDir.y == -1) {
            directionsRedux.push(new Phaser.Point(1, 0));
            directionsRedux.push(new Phaser.Point(-1, 0));
            directionsRedux.push(new Phaser.Point(0, 1));
            directionsRedux.push(new Phaser.Point(0, 0));
        }
        for (var i = 0; i < directionsRedux.length; i++) {
            if (this.updateEnemy(directionsRedux[i], tileMap) == true) {
                var distX = Math.abs(playerPosition.x - (this.getTilePosition().x + directionsRedux[i].x));
                var distY = Math.abs(playerPosition.y - (this.getTilePosition().y + directionsRedux[i].y));
                var newdist = Math.sqrt((distX * distX) + (distY * distY));
                console.log("newdist : " + newdist);
                if (newdist < dist) {
                    dist = newdist;
                    dir = directionsRedux[i];
                }
            }
        }
        return dir;
    };
    EnemyObject.prototype.update = function () {
        _super.prototype.update.call(this);
        this.healthText.text = this.enemyHealth.toString();
        this.healthText.anchor.set(1, 1);
        this.healthText.alpha = 1;
        if (this.enemyHealth < 1) {
            this.healthText.alpha = 0;
        }
    };
    return EnemyObject;
}(BaseGameObject));
/// <reference path="../Enemy/EnemyObject.ts"/>
var BackAndForthEnemyObject = (function (_super) {
    __extends(BackAndForthEnemyObject, _super);
    function BackAndForthEnemyObject(game, x, y, health, numberOfcannons, cannonDirection1, movementDirection) {
        _super.call(this, game, x, y, health, numberOfcannons, cannonDirection1);
        console.log("movement: " + movementDirection);
        this.enemyDirection = movementDirection;
        this.enemySprite = this.game.add.sprite(0, 0, "graphics");
        this.enemySprite.animations.add("normal", [6]);
        this.enemySprite.animations.play("normal");
        this.enemySprite.tint = 0xcc6668;
        this.add(this.enemySprite);
    }
    BackAndForthEnemyObject.prototype.enemyMove = function (enemyDirection, tileMatrix) {
        if (!this.updateEnemy(this.enemyDirection, tileMatrix) &&
            !this.updateEnemy(this.reverseDirection(this.enemyDirection), tileMatrix)) {
            this.goEnemy(new Phaser.Point(0, 0), tileMatrix);
        }
        if (!this.updateEnemy(this.enemyDirection, tileMatrix)) {
            this.goEnemy(this.reverseDirection(this.enemyDirection), tileMatrix);
        }
        else {
            this.goEnemy(this.enemyDirection, tileMatrix);
        }
    };
    return BackAndForthEnemyObject;
}(EnemyObject));
var CannonObject = (function (_super) {
    __extends(CannonObject, _super);
    function CannonObject(game, x, y, cannonDirection) {
        _super.call(this, game, x, y);
        this.cannonDirection = cannonDirection;
    }
    CannonObject.prototype.blockShot = function (playerPosition, enemy, tileMap, checkType) {
        if (enemy.getTilePosition().y == playerPosition.y
            && enemy.getTilePosition().x > playerPosition.x
            && this.cannonDirection.equals(new Phaser.Point(-1, 0))) {
            for (var i = enemy.getTilePosition().x - 1; i >= playerPosition.x; i--) {
                if (tileMap[i][playerPosition.y] == checkType) {
                    return new Phaser.Point(i, playerPosition.y);
                }
            }
        }
        if (enemy.getTilePosition().y == playerPosition.y
            && enemy.getTilePosition().x < playerPosition.x
            && this.cannonDirection.equals(new Phaser.Point(1, 0))) {
            for (var i = enemy.getTilePosition().x + 1; i <= playerPosition.x; i++) {
                if (tileMap[i][playerPosition.y] == checkType) {
                    return new Phaser.Point(i, playerPosition.y);
                }
            }
        }
        if (enemy.getTilePosition().x == playerPosition.x
            && enemy.getTilePosition().y > playerPosition.y
            && this.cannonDirection.equals(new Phaser.Point(0, -1))) {
            for (var i = enemy.getTilePosition().y - 1; i >= playerPosition.y; i--) {
                if (tileMap[playerPosition.x][i] == checkType) {
                    return new Phaser.Point(playerPosition.x, i);
                }
            }
        }
        if (enemy.getTilePosition().x == playerPosition.x
            && enemy.getTilePosition().y < playerPosition.y
            && this.cannonDirection.equals(new Phaser.Point(0, 1))) {
            for (var i = enemy.getTilePosition().y + 1; i <= playerPosition.y; i++) {
                if (tileMap[playerPosition.x][i] == checkType) {
                    return new Phaser.Point(playerPosition.x, i);
                }
            }
        }
        return null;
    };
    CannonObject.prototype.shoot = function (playerPosition, enemy, tileMap) {
        var colPoint = null;
        console.log("player.x: " + playerPosition.x);
        console.log("player.y: " + playerPosition.y);
        console.log("e.x: " + enemy.getTilePosition().x);
        console.log("e.y: " + enemy.getTilePosition().y);
        console.log("c.x: " + this.x);
        console.log("c.y: " + this.y);
        console.log("cannon.x : " + this.cannonDirection.x);
        console.log("cannon.y : " + this.cannonDirection.y);
        if (enemy.getTilePosition().y == playerPosition.y
            && enemy.getTilePosition().x > playerPosition.x
            && this.cannonDirection.equals(new Phaser.Point(-1, 0))
            && this.blockShot(playerPosition, enemy, tileMap, TileTypeEnum.Wall) == null) {
            colPoint = this.blockShot(playerPosition, enemy, tileMap, TileTypeEnum.Enemy);
            if (colPoint == null) {
                colPoint = playerPosition;
            }
        }
        if (enemy.getTilePosition().y == playerPosition.y
            && enemy.getTilePosition().x < playerPosition.x
            && this.cannonDirection.equals(new Phaser.Point(1, 0))
            && this.blockShot(playerPosition, enemy, tileMap, TileTypeEnum.Wall) == null) {
            colPoint = this.blockShot(playerPosition, enemy, tileMap, TileTypeEnum.Enemy);
            if (colPoint == null) {
                colPoint = playerPosition;
            }
        }
        if (enemy.getTilePosition().x == playerPosition.x
            && enemy.getTilePosition().y < playerPosition.y
            && this.cannonDirection.equals(new Phaser.Point(0, 1))
            && this.blockShot(playerPosition, enemy, tileMap, TileTypeEnum.Wall) == null) {
            colPoint = this.blockShot(playerPosition, enemy, tileMap, TileTypeEnum.Enemy);
            if (colPoint == null) {
                colPoint = playerPosition;
            }
        }
        if (enemy.getTilePosition().x == playerPosition.x
            && enemy.getTilePosition().y > playerPosition.y
            && this.cannonDirection.equals(new Phaser.Point(0, -1))
            && this.blockShot(playerPosition, enemy, tileMap, TileTypeEnum.Wall) == null) {
            colPoint = this.blockShot(playerPosition, enemy, tileMap, TileTypeEnum.Enemy);
            if (colPoint == null) {
                colPoint = playerPosition;
            }
        }
        return colPoint;
    };
    CannonObject.prototype.getCannonDirection = function () {
        return this.cannonDirection;
    };
    return CannonObject;
}(BaseGameObject));
/// <reference path="../Enemy/EnemyObject.ts"/>
var ChaserEnemyObject = (function (_super) {
    __extends(ChaserEnemyObject, _super);
    function ChaserEnemyObject(game, x, y, health, numberOfcannons, cannonDirection1) {
        _super.call(this, game, x, y, health, numberOfcannons, cannonDirection1);
        this.enemyDirection = this.pickDirection();
        this.enemySprite = this.game.add.sprite(0, 0, "graphics");
        this.enemySprite.animations.add("normal", [9]);
        this.enemySprite.animations.play("normal");
        this.enemySprite.tint = 0xcc6668;
        this.add(this.enemySprite);
    }
    ChaserEnemyObject.prototype.chaser = function (playerPosition) {
        var enemyDirection = new Phaser.Point(0, 0);
        if ((this.getTilePosition().x < playerPosition.x)
            && (this.getTilePosition().y < playerPosition.y)) {
            var difX = playerPosition.x - this.getTilePosition().x;
            var difY = playerPosition.y - this.getTilePosition().y;
            console.log("difX: " + difX);
            console.log("difY: " + difX);
            if (difX >= difY) {
                //this.x += Global.TILE_SIZE * this.enemySpeed;
                enemyDirection = new Phaser.Point(1, 0);
            }
            else {
                //this.y += Global.TILE_SIZE * this.enemySpeed;
                enemyDirection = new Phaser.Point(0, 1);
            }
        }
        if ((this.getTilePosition().x < playerPosition.x)
            && (this.getTilePosition().y > playerPosition.y)) {
            var difX = playerPosition.x - this.getTilePosition().x;
            var difY = this.getTilePosition().y - playerPosition.y;
            console.log("difX: " + difX);
            console.log("difY: " + difX);
            if (difX >= difY) {
                //this.x += Global.TILE_SIZE * this.enemySpeed;
                enemyDirection = new Phaser.Point(1, 0);
            }
            else {
                //this.y -= Global.TILE_SIZE * this.enemySpeed;
                enemyDirection = new Phaser.Point(0, -1);
            }
        }
        if ((this.getTilePosition().x > playerPosition.x)
            && (this.getTilePosition().y < playerPosition.y)) {
            var difX = this.getTilePosition().x - playerPosition.x;
            var difY = playerPosition.y - this.getTilePosition().y;
            console.log("difX: " + difX);
            console.log("difY: " + difX);
            if (difX >= difY) {
                //this.x -= Global.TILE_SIZE * this.enemySpeed;
                enemyDirection = new Phaser.Point(-1, 0);
            }
            else {
                //this.y += Global.TILE_SIZE * this.enemySpeed;
                enemyDirection = new Phaser.Point(0, 1);
            }
        }
        if ((this.getTilePosition().x > playerPosition.x)
            && (this.getTilePosition().y > playerPosition.y)) {
            var difX = playerPosition.x - this.getTilePosition().x;
            var difY = playerPosition.y - this.getTilePosition().y;
            console.log("difX: " + difX);
            console.log("difY: " + difX);
            if (difX >= difY) {
                //this.x -= Global.TILE_SIZE * this.enemySpeed;
                enemyDirection = new Phaser.Point(-1, 0);
            }
            else {
                //this.y -= Global.TILE_SIZE * this.enemySpeed;
                enemyDirection = new Phaser.Point(0, -1);
            }
        }
        if (this.getTilePosition().x == playerPosition.x
            && this.getTilePosition().y > playerPosition.y) {
            enemyDirection = new Phaser.Point(0, -1);
        }
        if (this.getTilePosition().x == playerPosition.x
            && this.getTilePosition().y < playerPosition.y) {
            enemyDirection = new Phaser.Point(0, 1);
        }
        if (this.getTilePosition().x > playerPosition.x
            && this.getTilePosition().y == playerPosition.y) {
            enemyDirection = new Phaser.Point(-1, 0);
        }
        if (this.getTilePosition().x < playerPosition.x
            && this.getTilePosition().y == playerPosition.y) {
            enemyDirection = new Phaser.Point(1, 0);
        }
        return enemyDirection;
    };
    ChaserEnemyObject.prototype.enemyMove = function (enemyDirection, tileMatrix) {
        var direction = this.chaser(enemyDirection);
        if (!this.updateEnemy(direction, tileMatrix)) {
            var newDir = this.getNearDirectionToPlayer(direction, enemyDirection, tileMatrix); //this.pickDirectionWithThisConstraint(this.findDirectionIndex(enemyDirection));
            this.goEnemy(newDir, tileMatrix);
        }
        else {
            this.goEnemy(direction, tileMatrix);
        }
    };
    return ChaserEnemyObject;
}(EnemyObject));
var EnemyFactory = (function () {
    function EnemyFactory() {
    }
    EnemyFactory.getEnemey = function (game, x, y, random) {
        var enemyObject;
        var randomType = random.integerInRange(0, 2);
        if (randomType == 0) {
            enemyObject = new RandomEnemyObject(game, x, y, random.integerInRange(1, 3), 0, new Phaser.Point());
        }
        else if (randomType == 1) {
            enemyObject = new ChaserEnemyObject(game, x, y, random.integerInRange(1, 3), 0, new Phaser.Point());
        }
        else if (randomType == 2) {
            var direction = new Phaser.Point();
            var cannonDirection = new Phaser.Point();
            if (Math.random() < 0.5) {
                direction.x = 2 * random.integerInRange(0, 1) - 1;
                cannonDirection.y = 2 * random.integerInRange(0, 1) - 1;
            }
            else {
                direction.y = 2 * random.integerInRange(0, 1) - 1;
                cannonDirection.x = 2 * random.integerInRange(0, 1) - 1;
            }
            enemyObject = new BackAndForthEnemyObject(game, x, y, random.integerInRange(1, 3), 1, cannonDirection, direction);
        }
        return enemyObject;
    };
    EnemyFactory.defineEnemyType = function (choose) {
        if (choose == 2) {
            return EnemyTypeEnum.BackAndForth;
        }
        if (choose == 3) {
            return EnemyTypeEnum.Chaser;
        }
        if (choose == 1) {
            return EnemyTypeEnum.Random;
        }
    };
    return EnemyFactory;
}());
var EnemyTypeEnum;
(function (EnemyTypeEnum) {
    EnemyTypeEnum[EnemyTypeEnum["Chaser"] = 0] = "Chaser";
    EnemyTypeEnum[EnemyTypeEnum["Random"] = 1] = "Random";
    EnemyTypeEnum[EnemyTypeEnum["BackAndForth"] = 2] = "BackAndForth";
})(EnemyTypeEnum || (EnemyTypeEnum = {}));
var ExplosiveEnemyObject = (function (_super) {
    __extends(ExplosiveEnemyObject, _super);
    function ExplosiveEnemyObject(game, x, y, health, numberOfCannons, cannonDirection1) {
        _super.call(this, game, x, y, health, numberOfCannons, cannonDirection1);
        this.exploded = false;
        this.enemyDirection = this.pickDirection();
        this.enemySprite = this.game.add.sprite(0, 0, "graphics");
        this.enemySprite.animations.add("normal", [8]);
        this.enemySprite.animations.play("normal");
        this.enemySprite.tint = 0xcc6668;
        this.add(this.enemySprite);
    }
    ExplosiveEnemyObject.prototype.getRandomFreeDirection = function (enemyDirection, tileMap) {
        var dir = new Phaser.Point(0, 0);
        var dirs = [];
        for (var i = 1; i < this.directions.length; i++) {
            if (this.updateEnemy(this.directions[i], tileMap) == true) {
                dirs.push(this.directions[i]);
            }
        }
        if (dirs.length > 0) {
            dir = dirs[(Math.floor(Math.random() * dirs.length) + 1) - 1];
        }
        return dir;
    };
    ExplosiveEnemyObject.prototype.playerInSameDirection = function (playerPosition, tileMap) {
        if (this.getTilePosition().y == playerPosition.y
            && this.getTilePosition().x > playerPosition.x) {
            for (var i = this.getTilePosition().x - 1; i >= playerPosition.x; i--) {
                if (tileMap[i][playerPosition.y] == TileTypeEnum.Wall
                    || tileMap[i][playerPosition.y] == TileTypeEnum.Enemy) {
                    return new Phaser.Point(-1, 0);
                }
            }
        }
        if (this.getTilePosition().y == playerPosition.y
            && this.getTilePosition().x < playerPosition.x) {
            for (var i = this.getTilePosition().x + 1; i <= playerPosition.x; i++) {
                if (tileMap[i][playerPosition.y] == TileTypeEnum.Wall
                    || tileMap[i][playerPosition.y] == TileTypeEnum.Enemy) {
                    return new Phaser.Point(1, 0);
                }
            }
        }
    };
    ExplosiveEnemyObject.prototype.enemyMove = function (enemyDirection, tileMatrix) {
        this.enemyDirection = this.playerInSameDirection(enemyDirection, tileMatrix);
        if (this.updateEnemy(this.enemyDirection, tileMatrix)) {
            this.goEnemy(this.enemyDirection, tileMatrix);
        }
        else {
            this.exploded = true;
        }
    };
    ExplosiveEnemyObject.prototype.getExploded = function () {
        return this.exploded;
    };
    return ExplosiveEnemyObject;
}(EnemyObject));
var RandomEnemyObject = (function (_super) {
    __extends(RandomEnemyObject, _super);
    function RandomEnemyObject(game, x, y, health, numberOfCannons, cannonDirection1) {
        _super.call(this, game, x, y, health, numberOfCannons, cannonDirection1);
        this.enemyDirection = this.pickDirection();
        this.enemySprite = this.game.add.sprite(0, 0, "graphics");
        this.enemySprite.animations.add("normal", [8]);
        this.enemySprite.animations.play("normal");
        this.enemySprite.tint = 0xcc6668;
        this.add(this.enemySprite);
    }
    RandomEnemyObject.prototype.getRandomFreeDirection = function (enemyDirection, tileMap) {
        var dir = new Phaser.Point(0, 0);
        var dirs = [];
        for (var i = 1; i < this.directions.length; i++) {
            if (this.updateEnemy(this.directions[i], tileMap) == true) {
                dirs.push(this.directions[i]);
            }
        }
        if (dirs.length > 0) {
            dir = dirs[(Math.floor(Math.random() * dirs.length) + 1) - 1];
        }
        return dir;
    };
    RandomEnemyObject.prototype.enemyMove = function (enemyDirection, tileMatrix) {
        if (!this.updateEnemy(this.enemyDirection, tileMatrix)) {
            this.enemyDirection = this.getRandomFreeDirection(this.enemyDirection, tileMatrix); //this.pickDirectionWithThisConstraint(this.findDirectionIndex(this.enemyDirection));
            this.goEnemy(this.enemyDirection, tileMatrix);
        }
        else {
            this.goEnemy(this.enemyDirection, tileMatrix);
        }
    };
    return RandomEnemyObject;
}(EnemyObject));
var StaticShooterEnemyObject = (function (_super) {
    __extends(StaticShooterEnemyObject, _super);
    function StaticShooterEnemyObject(game, x, y, health, numberOfcannons, cannonDirection1) {
        _super.call(this, game, x, y, health, numberOfcannons, cannonDirection1);
        this.enemySprite = this.game.add.sprite(0, 0, "graphics");
        this.enemySprite.animations.add("normal", [6]);
        this.enemySprite.animations.play("normal");
        this.enemySprite.tint = 0xcc6668;
        this.add(this.enemySprite);
    }
    StaticShooterEnemyObject.prototype.changeCannonDirection = function () {
        var index = this.findDirectionIndex(this.cannons[0].cannonDirection);
        this.cannons[0].cannonDirection = this.pickDirection();
    };
    StaticShooterEnemyObject.prototype.enemyMove = function (enemyDirection, tileMatrix) {
        console.log("C: " + this.cannons[0].cannonDirection);
        this.changeCannonDirection();
    };
    return StaticShooterEnemyObject;
}(EnemyObject));
var BaseTile = (function (_super) {
    __extends(BaseTile, _super);
    function BaseTile(game, xTile, yTile) {
        _super.call(this, game, xTile * Global.TILE_SIZE, yTile * Global.TILE_SIZE);
    }
    return BaseTile;
}(BaseGameObject));
/// <reference path="BaseTile.ts"/>
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
/// <reference path="BaseTile.ts"/>
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
/// <reference path="BaseTile.ts"/>
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
var FloorColors = (function () {
    function FloorColors() {
    }
    FloorColors.getWallColors = function (category) {
        var tint = 0x664729;
        switch (category) {
            case 0:
                tint = 0x664729;
                break;
            case 1:
                tint = 0x808080;
                break;
            case 2:
                tint = 0x3d2966;
                break;
            case 3:
                tint = 0xb3b336;
                break;
            case 4:
                tint = 0x294766;
                break;
            case 5:
                tint = 0x3b6629;
                break;
            default:
                tint = 0x664729;
                break;
        }
        return tint;
    };
    return FloorColors;
}());
/// <reference path="BaseTile.ts"/>
var HighlightTile = (function (_super) {
    __extends(HighlightTile, _super);
    function HighlightTile(game) {
        _super.call(this, game, 0, 0);
        this.sprite = this.game.add.sprite(0, 0, "graphics");
        this.sprite.animations.add("normal", [5]);
        this.sprite.animations.play("normal");
        this.sprite.tint = 0x86b7c0;
        this.add(this.sprite);
        var style = { font: "10px pixelFont", fill: "#86b7c0", align: "left" };
        this.damage = this.game.add.text(Global.TILE_SIZE / 2 + 1, Global.TILE_SIZE - 5, "0", style, this);
        this.damage.anchor.set(0.5, 0);
        this.add(this.damage);
        this.damage.alpha = 0;
        this.alpha = 0;
    }
    HighlightTile.prototype.hide = function () {
        this.alpha = 0;
    };
    HighlightTile.prototype.show = function (value) {
        this.alpha = 1;
        this.damage.text = value.toString();
        this.damage.anchor.set(0.5, 0);
    };
    return HighlightTile;
}(BaseTile));
/// <reference path="BaseTile.ts"/>
var WallTile = (function (_super) {
    __extends(WallTile, _super);
    function WallTile(game, xTile, yTile) {
        _super.call(this, game, xTile, yTile);
        this.sprite = this.game.add.sprite(0, 0, "graphics");
        this.sprite.animations.add("normal", [0]);
        this.sprite.animations.play("normal");
        this.sprite.tint = FloorColors.getWallColors(Global.levelCategory);
        this.add(this.sprite);
    }
    return WallTile;
}(BaseTile));
var AdventureName = (function (_super) {
    __extends(AdventureName, _super);
    function AdventureName(game, x, y, name, alphaSpeed) {
        if (alphaSpeed === void 0) { alphaSpeed = 0.05; }
        _super.call(this, game);
        this.alphaSpeed = alphaSpeed;
        var style = { font: "20px pixelFont", fill: "#ffffff", align: "center" };
        var text = this.game.add.text(x, y, name, style, this);
        text.anchor.set(0.5, 0.5);
        text.wordWrap = true;
        text.wordWrapWidth = game.width - 4 * Global.TILE_SIZE;
        this.add(text);
        var mainPoint = new Phaser.Point(x - text.width / 2 - Global.TILE_SIZE - 5, y - text.height / 2 - Global.TILE_SIZE / 2);
        var sprite = this.game.add.sprite(mainPoint.x, mainPoint.y, "graphics");
        sprite.animations.add("normal", [0]);
        sprite.animations.play("normal");
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(0.5, 0.5);
        sprite.tint = FloorColors.getWallColors(Global.levelCategory);
        this.add(sprite);
        sprite = this.game.add.sprite(mainPoint.x + Global.TILE_SIZE / 2, mainPoint.y, "graphics");
        sprite.animations.add("normal", [0]);
        sprite.animations.play("normal");
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(0.5, 0.5);
        sprite.tint = FloorColors.getWallColors(Global.levelCategory);
        this.add(sprite);
        sprite = this.game.add.sprite(mainPoint.x, mainPoint.y + Global.TILE_SIZE / 2, "graphics");
        sprite.animations.add("normal", [0]);
        sprite.animations.play("normal");
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(0.5, 0.5);
        sprite.tint = FloorColors.getWallColors(Global.levelCategory);
        this.add(sprite);
        mainPoint = new Phaser.Point(x + text.width / 2 + Global.TILE_SIZE, y + text.height / 2 + Global.TILE_SIZE / 2 - 5);
        var sprite = this.game.add.sprite(mainPoint.x, mainPoint.y, "graphics");
        sprite.animations.add("normal", [0]);
        sprite.animations.play("normal");
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(0.5, 0.5);
        sprite.tint = FloorColors.getWallColors(Global.levelCategory);
        this.add(sprite);
        sprite = this.game.add.sprite(mainPoint.x - Global.TILE_SIZE / 2, mainPoint.y, "graphics");
        sprite.animations.add("normal", [0]);
        sprite.animations.play("normal");
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(0.5, 0.5);
        sprite.tint = FloorColors.getWallColors(Global.levelCategory);
        this.add(sprite);
        sprite = this.game.add.sprite(mainPoint.x, mainPoint.y - Global.TILE_SIZE / 2, "graphics");
        sprite.animations.add("normal", [0]);
        sprite.animations.play("normal");
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(0.5, 0.5);
        sprite.tint = FloorColors.getWallColors(Global.levelCategory);
        this.add(sprite);
        this.alpha = 0;
    }
    AdventureName.prototype.fadeOut = function (speed) {
        this.alphaSpeed = speed;
    };
    AdventureName.prototype.update = function () {
        _super.prototype.update.call(this);
        this.alpha += this.alphaSpeed;
        if (this.alpha <= 0) {
            this.game.state.start("gameplay", true);
            this.alpha = 0;
        }
        if (this.alpha >= 1) {
            this.alpha = 1;
        }
    };
    return AdventureName;
}(BaseUIObject));
var ButtonTutorial = (function (_super) {
    __extends(ButtonTutorial, _super);
    function ButtonTutorial(game, x, y) {
        _super.call(this, game);
        var style = { font: "15px pixelFont", fill: "#ffffff", align: "left" };
        this.xText = this.game.add.text(x + 2, y, "(x) aim", style, this);
        this.xText.anchor.set(0, 1);
        this.add(this.xText);
        style = { font: "15px pixelFont", fill: "#ffffff", align: "right" };
        this.zText = this.game.add.text(this.game.width - x, y, "[" + Global.getCurrentCost() + "] special (z)", style, this);
        this.zText.anchor.set(1, 1);
        this.add(this.zText);
    }
    ButtonTutorial.prototype.aimMode = function () {
        this.xText.text = "(x) shoot";
        this.xText.anchor.set(0, 1);
        this.zText.text = "cancel (z)";
        this.zText.anchor.set(1, 1);
    };
    ButtonTutorial.prototype.normalMode = function () {
        this.xText.text = "(x) aim";
        this.xText.anchor.set(0, 1);
        this.zText.text = "[" + Global.getCurrentCost() + "] special (z)";
        this.zText.anchor.set(1, 1);
    };
    return ButtonTutorial;
}(BaseUIObject));
var CrateText = (function (_super) {
    __extends(CrateText, _super);
    function CrateText(game, x, y) {
        _super.call(this, game);
        var style = { font: "15px pixelFont", fill: "#ffffff", align: "center" };
        var text = this.game.add.text(x, y, "crate", style, this);
        text.anchor.set(0.5, 0);
        this.add(text);
        style = { font: "60px pixelFont", fill: "#ffffff", align: "center" };
        this.crateText = this.game.add.text(x, y + 8, "0", style, this);
        this.crateText.anchor.set(0.5, 0);
        this.add(this.crateText);
    }
    CrateText.prototype.update = function () {
        _super.prototype.update.call(this);
        this.crateText.text = Global.crateNumber.toString();
        this.crateText.anchor.set(0.5, 0);
    };
    return CrateText;
}(BaseUIObject));
var FlyingText = (function (_super) {
    __extends(FlyingText, _super);
    function FlyingText(game, x, y, initialString, speed, fontSize) {
        if (fontSize === void 0) { fontSize = 20; }
        _super.call(this, game);
        var style = { font: fontSize + "px pixelFont", fill: "#ffffff", align: "center" };
        this.text = new Phaser.Text(game, x, y, initialString, style);
        this.text.anchor.set(0.5, 0);
        this.add(this.text);
        this.upcomingText = initialString;
        this.speed = speed;
        this.selectText(false);
    }
    FlyingText.prototype.changeText = function (newText) {
        var numberOfSpaces = Math.abs(this.text.text.length - newText.length) / 2;
        this.upcomingText = "";
        for (var i = 0; i < numberOfSpaces; i++) {
            this.upcomingText += " ";
        }
        this.upcomingText += newText;
        for (var i = 0; i < numberOfSpaces; i++) {
            this.upcomingText += " ";
        }
    };
    FlyingText.prototype.selectText = function (select) {
        if (select) {
            this.text.tint = 0xffffff;
        }
        else {
            this.text.tint = 0x777777;
        }
    };
    FlyingText.prototype.update = function () {
        for (var i = 0; i < this.upcomingText.length; i++) {
            var newChar = this.upcomingText.charCodeAt(i);
            if (this.upcomingText.charAt(i) == " ") {
                newChar = "z".charCodeAt(0) + 1;
            }
            var oldChar = this.text.text.charCodeAt(i);
            if (this.text.text.charAt(i) == " ") {
                oldChar = "z".charCodeAt(0) + 1;
            }
            var change = Phaser.Math.sign(newChar - oldChar) * this.speed;
            if (this.speed > Math.abs(newChar - oldChar)) {
                change = (newChar - oldChar);
            }
            oldChar += change;
            if (oldChar == newChar && oldChar == "z".charCodeAt(0) + 1) {
                oldChar = " ".charCodeAt(0);
            }
            this.text.text = this.text.text.substr(0, i) + String.fromCharCode(oldChar) + this.text.text.substr(i + 1);
        }
        this.text.anchor.set(0.5, 0);
    };
    return FlyingText;
}(BaseUIObject));
var GameNameText = (function (_super) {
    __extends(GameNameText, _super);
    function GameNameText(game, x, y) {
        _super.call(this, game);
        var style = { font: "120px pixelFont", fill: "#555555", align: "center" };
        this.wText = new Phaser.Text(game, x, y, "w", style);
        this.wText.anchor.set(0.5, 0.5);
        this.add(this.wText);
        style = { font: "40px pixelFont", fill: "#ffffff", align: "center" };
        this.superHackText = new Phaser.Text(game, x - 12, y, "super  hack!", style);
        this.superHackText.anchor.set(0.5, 0.5);
        this.add(this.superHackText);
    }
    return GameNameText;
}(BaseUIObject));
var HandObjects;
(function (HandObjects) {
    HandObjects[HandObjects["Empty"] = 0] = "Empty";
    HandObjects[HandObjects["Weapon"] = 1] = "Weapon";
    HandObjects[HandObjects["Person"] = 2] = "Person";
})(HandObjects || (HandObjects = {}));
var HandUI = (function (_super) {
    __extends(HandUI, _super);
    function HandUI(game, x, y) {
        _super.call(this, game);
        this.outline = this.game.add.graphics(x - Global.MAP_SIZE / 2, y - Global.MAP_SIZE / 2, this);
        this.outline.lineStyle(2, 0xffffff, 1);
        this.outline.drawRect(0, 0, 6 * Global.MAP_SIZE, 4.5 * Global.MAP_SIZE);
        this.add(this.outline);
        var style = { font: "14px pixelFont", fill: "#ffffff", align: "center" };
        this.text = this.game.add.text(x +
            5 * Global.MAP_SIZE / 2, y - Global.MAP_SIZE / 2 + 2, "hand", style, this);
        this.text.anchor.set(0.5, 1);
        this.add(this.text);
        var centerPoint = new Phaser.Point(x + 2.5 * Global.MAP_SIZE, y + 2 * Global.MAP_SIZE);
        style = { font: "10px pixelFont", fill: "#ffffff", align: "center" };
        this.emptyText = this.game.add.text(centerPoint.x, centerPoint.y, "-empty-", style, this);
        this.emptyText.anchor.set(0.5, 0.5);
        this.add(this.emptyText);
        style = { font: "10px pixelFont", fill: "#ffffff", align: "right" };
        this.damageText = this.game.add.text(centerPoint.x + 12, centerPoint.y, "", style, this);
        this.damageText.anchor.set(1, 0.5);
        this.add(this.damageText);
        this.damageSprite = this.game.add.sprite(centerPoint.x + 1, centerPoint.y - 2, "graphics");
        this.damageSprite.animations.add("normal", [14]);
        this.damageSprite.animations.play("normal");
        this.damageSprite.anchor.set(1, 0.5);
        this.add(this.damageSprite);
        this.cooldownText = this.game.add.text(centerPoint.x + 12, centerPoint.y + 12, "", style, this);
        this.cooldownText.anchor.set(1, 0.5);
        this.add(this.cooldownText);
        this.cooldownSprite = this.game.add.sprite(centerPoint.x + 1, centerPoint.y + 10, "graphics");
        this.cooldownSprite.animations.add("normal", [15]);
        this.cooldownSprite.animations.play("normal");
        this.cooldownSprite.anchor.set(1, 0.5);
        this.add(this.cooldownSprite);
        this.patternText = this.game.add.text(centerPoint.x + 12, centerPoint.y - 12, "", style, this);
        this.patternText.anchor.set(1, 0.5);
        this.add(this.patternText);
        this.patternSprite = this.game.add.sprite(centerPoint.x + 1, centerPoint.y - 14, "graphics");
        this.patternSprite.animations.add("normal", [13]);
        this.patternSprite.animations.play("normal");
        this.patternSprite.anchor.set(1, 0.5);
        this.add(this.patternSprite);
        this.showHide(HandObjects.Empty);
    }
    HandUI.prototype.updateDamage = function (damage, extraValue) {
        var added = "";
        if (extraValue > 0) {
            added = "(+1)";
        }
        this.damageText.text = damage.toString() + " " + added;
        this.damageText.anchor.set(0, 0.5);
    };
    HandUI.prototype.updateCooldown = function (cooldown, extraValue) {
        var added = "";
        if (extraValue > 0) {
            added = "(-1)";
        }
        this.cooldownText.text = cooldown.toString() + " " + added;
        this.cooldownText.anchor.set(0, 0.5);
    };
    HandUI.prototype.updatePatternValue = function (patternSize) {
        this.patternText.text = patternSize.toString();
        this.patternText.anchor.set(0, 0.5);
    };
    HandUI.prototype.updateTraits = function (traits) {
    };
    HandUI.prototype.showHide = function (hand) {
        this.damageText.alpha = 0;
        this.cooldownText.alpha = 0;
        this.patternText.alpha = 0;
        this.emptyText.alpha = 0;
        this.damageSprite.alpha = 0;
        this.cooldownSprite.alpha = 0;
        this.patternSprite.alpha = 0;
        switch (hand) {
            case HandObjects.Empty:
                this.emptyText.alpha = 1;
                break;
            case HandObjects.Weapon:
                this.patternText.alpha = 1;
                this.damageText.alpha = 1;
                this.cooldownText.alpha = 1;
                this.damageSprite.alpha = 1;
                this.cooldownSprite.alpha = 1;
                this.patternSprite.alpha = 1;
                break;
            case HandObjects.Person:
                break;
        }
    };
    return HandUI;
}(BaseUIObject));
var HintText = (function (_super) {
    __extends(HintText, _super);
    function HintText(game, x, y, text) {
        _super.call(this, game);
        var style = { font: "15px pixelFont", fill: "#ffffff", align: "center" };
        var hintText = this.game.add.text(x, y, text, style);
        hintText.anchor.set(0.5, 1);
        this.add(hintText);
    }
    return HintText;
}(BaseUIObject));
var LevelName = (function (_super) {
    __extends(LevelName, _super);
    function LevelName(game, x, y) {
        _super.call(this, game);
        var style = { font: "14px pixelFont", fill: "#ffffff", align: "center" };
        this.text = new Phaser.Text(this.game, x, y, "Level " + (Global.levelNumber + 1).toString(), style);
        this.text.anchor.set(0.5, 0);
        this.add(this.text);
        var style = { font: "16px pixelFont", fill: "#ffffff", align: "center" };
        this.nameText = new Phaser.Text(this.game, x, y + 12, Global.levelName, style);
        this.nameText.anchor.set(0.5, 0);
        //this.add(this.nameText);
    }
    return LevelName;
}(BaseUIObject));
/// <reference path="../BaseUIObject.ts"/>
var MiniMap = (function (_super) {
    __extends(MiniMap, _super);
    function MiniMap(game, x, y) {
        _super.call(this, game);
        this.outline = this.game.add.graphics(x - Global.MAP_SIZE / 2, y - Global.MAP_SIZE / 2, this);
        this.outline.lineStyle(2, 0xffffff, 1);
        this.outline.drawRect(0, 0, (Global.mapWidth + 1) * Global.MAP_SIZE, (Global.mapHeight + 1) * Global.MAP_SIZE);
        this.add(this.outline);
        var style = { font: "14px pixelFont", fill: "#ffffff", align: "center" };
        this.text = this.game.add.text(x - Global.MAP_SIZE / 2 +
            (Global.mapWidth + 1) * Global.MAP_SIZE / 2, y - Global.MAP_SIZE / 2 + 2, "map", style, this);
        this.text.anchor.set(0.5, 1);
        this.add(this.text);
        this.graphics = this.game.add.graphics(x, y, this);
        this.updateGraphics();
        this.player = this.game.add.graphics(0, 0, this);
        this.player.beginFill(0x111111, 1);
        this.player.drawRect(-2, -2, 4, 4);
        this.player.endFill();
        this.add(this.player);
    }
    MiniMap.prototype.updateGraphics = function () {
        for (var x = 0; x < Global.mapWidth; x++) {
            for (var y = 0; y < Global.mapHeight; y++) {
                var mapX = x * Global.MAP_SIZE;
                var mapY = y * Global.MAP_SIZE;
                if (Global.levelRooms[x][y] != null &&
                    Global.levelRooms[x][y].visited) {
                    this.graphics.beginFill(0xFFFFFF, 1);
                    this.graphics.drawRect(mapX + 1, mapY + 1, Global.MAP_SIZE - 2, Global.MAP_SIZE - 2);
                    this.graphics.endFill();
                }
                for (var dx = -1; dx <= 1; dx++) {
                    for (var dy = -1; dy <= 1; dy++) {
                        if (Global.levelRooms[x][y] != null &&
                            Global.levelRooms[x][y].visited &&
                            Global.levelRooms[x][y].checkDoor(new Phaser.Point(dx, dy))) {
                            mapX = x * Global.MAP_SIZE + (1 + dx) * Global.MAP_SIZE / 2;
                            mapY = y * Global.MAP_SIZE + (1 + dy) * Global.MAP_SIZE / 2;
                            this.graphics.beginFill(0xFFFFFF, 1);
                            this.graphics.drawRect(mapX - Math.abs(dy) - Math.floor((dx + 1) / 2), mapY - Math.abs(dx) - Math.floor((dy + 1) / 2), 1 + Math.abs(dy), 1 + Math.abs(dx));
                            this.graphics.endFill();
                        }
                    }
                }
            }
        }
    };
    MiniMap.prototype.update = function () {
        _super.prototype.update.call(this);
        this.player.x = this.graphics.x + (Global.currentX + 0.5) * Global.MAP_SIZE;
        this.player.y = this.graphics.y + (Global.currentY + 0.5) * Global.MAP_SIZE;
    };
    return MiniMap;
}(BaseUIObject));
var PlayerInfoText = (function (_super) {
    __extends(PlayerInfoText, _super);
    function PlayerInfoText(game, x, y) {
        _super.call(this, game);
        this.heroSprite = game.add.sprite(x - 12, y - 70, "graphics");
        this.heroSprite.animations.add("3", [3]);
        this.heroSprite.animations.add("11", [11]);
        this.heroSprite.animations.add("10", [10]);
        this.heroSprite.scale.set(3, 3);
        this.heroSprite.anchor.set(0.5, 0.5);
        this.playerName = new FlyingText(game, x, y + 20, "", 2, 15);
        this.playerName.selectText(true);
        var style = { font: "20px pixelFont", fill: "#aaaaaa", align: "center" };
        this.playerDescription = this.game.add.text(x, y + 20, "", style, this);
        this.playerDescription.wordWrap = true;
        this.playerDescription.wordWrapWidth = this.game.width - 40;
        this.playerSpecial = new FlyingText(game, x + 12, y + 110, "", 2, 15);
        this.playerSpecial.selectText(true);
        this.add(this.heroSprite);
        this.add(this.playerName);
        this.add(this.playerDescription);
        this.add(this.playerSpecial);
    }
    PlayerInfoText.prototype.updateText = function (playerData) {
        this.playerName.changeText(playerData.getPlayerName());
        this.heroSprite.animations.play(playerData.graphicsIndex.toString());
        this.playerDescription.text = playerData.getDescription();
        this.playerDescription.anchor.set(0.5, 0);
        this.playerSpecial.changeText(playerData.getSpecialText());
    };
    PlayerInfoText.prototype.update = function () {
        _super.prototype.update.call(this);
        this.playerName.update();
        this.playerSpecial.update();
    };
    return PlayerInfoText;
}(BaseUIObject));
var WhiteLayout = (function (_super) {
    __extends(WhiteLayout, _super);
    function WhiteLayout(game, x, y, width, height) {
        _super.call(this, game);
        this.graphics = this.game.add.graphics(x, y, this);
        this.graphics.lineStyle(3, 0x444444, 1);
        this.graphics.drawRect(-3, -3, width + 6, height + 6);
        this.add(this.graphics);
    }
    return WhiteLayout;
}(BaseUIObject));
var BaseSpecial = (function () {
    function BaseSpecial(specialCost) {
        this.specialCost = specialCost;
    }
    BaseSpecial.prototype.useSpecial = function (level) {
    };
    return BaseSpecial;
}());
/// <reference path="BaseSpecial.ts"/>
var AllScreenSpecial = (function (_super) {
    __extends(AllScreenSpecial, _super);
    function AllScreenSpecial() {
        _super.call(this, 2);
    }
    AllScreenSpecial.prototype.useSpecial = function (level) {
        _super.prototype.useSpecial.call(this, level);
        var damage = [];
        for (var x = 0; x < Global.ROOM_WIDTH; x++) {
            damage.push([]);
            for (var y = 0; y < Global.ROOM_HEIGHT; y++) {
                damage[x].push(1);
            }
        }
        level.handleAttack(damage);
        level.add.existing(new WhiteLayer(level.game, 0, 0, 0.03));
        Global.audioManager.playSpecial(AudioManager.SPECIAL_GAT);
    };
    return AllScreenSpecial;
}(BaseSpecial));
/// <reference path="BaseSpecial.ts"/>
var ChangeWeaponSpecial = (function (_super) {
    __extends(ChangeWeaponSpecial, _super);
    function ChangeWeaponSpecial() {
        _super.call(this, 2);
    }
    ChangeWeaponSpecial.prototype.useSpecial = function (level) {
        _super.prototype.useSpecial.call(this, level);
        Global.currentWeapon = WeaponGenerator.GenerateWeapon(null, level.rnd, level.playerObject.getWeapon(), Global.weaponNameGenerator, 3);
        level.game.add.existing(new WeaponName(level.game, level.playerObject.getTilePosition().x, level.playerObject.getTilePosition().y, Global.currentWeapon.getWeaponName()));
        level.playerObject.setWeapon(Global.currentWeapon);
        level.add.existing(new WhiteLayer(level.game, 0, 0, 0.03));
        level.updateHandUI();
        Global.audioManager.playSpecial(AudioManager.SPECIAL_AAT);
    };
    return ChangeWeaponSpecial;
}(BaseSpecial));
/// <reference path="BaseSpecial.ts"/>
var TeleportSpecial = (function (_super) {
    __extends(TeleportSpecial, _super);
    function TeleportSpecial() {
        _super.call(this, 2);
    }
    TeleportSpecial.prototype.useSpecial = function (level) {
        _super.prototype.useSpecial.call(this, level);
        var levelValues = Global.getCurrentRoom().getMatrix(level.enemyObjects);
        var playerPos = level.playerObject.getTilePosition();
        levelValues[playerPos.x][playerPos.y] = TileTypeEnum.Wall;
        var values = [];
        for (var x = 0; x < Global.ROOM_WIDTH; x++) {
            for (var y = 0; y < Global.ROOM_HEIGHT; y++) {
                var currentValue = 0;
                if (levelValues[x][y] == TileTypeEnum.Passable) {
                    for (var dx = -3; dx <= 3; dx++) {
                        for (var dy = -3; dy <= 3; dy++) {
                            if (x + dx >= 0 && y + dy >= 0 && x + dx < Global.ROOM_WIDTH && y + dy < Global.ROOM_HEIGHT) {
                                if (levelValues[dx + x][dy + y] == TileTypeEnum.Enemy) {
                                    currentValue += Math.abs(dx + dy);
                                }
                                else {
                                    currentValue += 15;
                                }
                            }
                            else {
                                currentValue += 15;
                            }
                        }
                    }
                }
                values.push(currentValue);
            }
        }
        var maxValue = values[0];
        var maxIndex = [];
        for (var i = 1; i < values.length; i++) {
            var currentValue = values[i];
            if (currentValue > maxValue) {
                maxIndex = [i];
                maxValue = currentValue;
            }
            else if (currentValue == maxValue) {
                maxIndex.push(i);
            }
        }
        var index = Phaser.ArrayUtils.getRandomItem(maxIndex);
        level.playerObject.x = Math.floor(index / Global.ROOM_WIDTH) * Global.TILE_SIZE;
        level.playerObject.y = Math.floor(index % Global.ROOM_WIDTH) * Global.TILE_SIZE;
        level.add.existing(new WhiteLayer(level.game, 0, 0, 0.03));
        Global.audioManager.playSpecial(AudioManager.SPECIAL_TAT);
    };
    return TeleportSpecial;
}(BaseSpecial));
var BasePlayerData = (function () {
    function BasePlayerData(text, baseIndex, graphicsIndex, specialAbility) {
        this.text = text;
        this.baseIndex = baseIndex;
        this.graphicsIndex = graphicsIndex;
        this.specialAbility = specialAbility;
    }
    BasePlayerData.prototype.getPlayerName = function () {
        return this.text.split("\n")[this.baseIndex];
    };
    BasePlayerData.prototype.getDescription = function () {
        return this.text.split("\n")[this.baseIndex + 1];
    };
    BasePlayerData.prototype.getSpecialText = function () {
        return this.text.split("\n")[this.baseIndex + 2];
    };
    return BasePlayerData;
}());
/// <reference path="BasePlayerData.ts"/>
var AatPlayerData = (function (_super) {
    __extends(AatPlayerData, _super);
    function AatPlayerData(text) {
        _super.call(this, text, 0, 3, new ChangeWeaponSpecial());
    }
    return AatPlayerData;
}(BasePlayerData));
/// <reference path="BasePlayerData.ts"/>
var GatPlayerData = (function (_super) {
    __extends(GatPlayerData, _super);
    function GatPlayerData(text) {
        _super.call(this, text, 4, 11, new AllScreenSpecial());
    }
    return GatPlayerData;
}(BasePlayerData));
/// <reference path="BasePlayerData.ts"/>
var TatPlayerData = (function (_super) {
    __extends(TatPlayerData, _super);
    function TatPlayerData(text) {
        _super.call(this, text, 8, 10, new TeleportSpecial());
    }
    return TatPlayerData;
}(BasePlayerData));
//import WeaponShape = require('WeaponShape'); 
/// <reference path="../../Global.ts"/>
var WeaponCrazyEffects;
(function (WeaponCrazyEffects) {
    WeaponCrazyEffects[WeaponCrazyEffects["NOTHING"] = 0] = "NOTHING";
    WeaponCrazyEffects[WeaponCrazyEffects["TELEPORT"] = 1] = "TELEPORT";
    WeaponCrazyEffects[WeaponCrazyEffects["KNOCKBACK_ENEMY_1"] = 2] = "KNOCKBACK_ENEMY_1";
    WeaponCrazyEffects[WeaponCrazyEffects["KNOCKBACK_ENEMY_2"] = 3] = "KNOCKBACK_ENEMY_2";
    WeaponCrazyEffects[WeaponCrazyEffects["KNOCKBACK_PLAYER_1"] = 4] = "KNOCKBACK_PLAYER_1";
    WeaponCrazyEffects[WeaponCrazyEffects["KNOCKBACK_PLAYER2"] = 5] = "KNOCKBACK_PLAYER2";
    WeaponCrazyEffects[WeaponCrazyEffects["CONVERT_CONTROL"] = 6] = "CONVERT_CONTROL";
})(WeaponCrazyEffects || (WeaponCrazyEffects = {}));
var Weapon = (function () {
    function Weapon() {
        this.damage = 1;
        this.cooldown = 1;
        this.curCooldown = 0;
        this.name = "";
        this.lingering = false;
        this.amountOfLingeringLive = 0;
        this.poison = false;
        this.centered = false;
        this.repeat = false;
        this.weaponPower = 0;
        this.areaLevel = 0;
        this.objectExplode = false;
        this.objectFade = false;
        this.crazyEffect = WeaponCrazyEffects.NOTHING;
        this.weaponPower = -1;
    }
    Weapon.prototype.getLingeringObjectPositions = function (objectPos, valueMatrix) {
        var result = new Array(valueMatrix.length);
        for (var i = 0; i < valueMatrix.length; i++) {
            result[i] = new Array(valueMatrix[0].length);
            for (var j = 0; j < valueMatrix[0].length; j++) {
                result[i][j] = 0;
            }
        }
        for (var i = (objectPos.y - 1 < 0 ? 0 : objectPos.y - 1); i < (objectPos.y + 1 > result.length - 1 ? result.length - 1 : objectPos.y + 1); i++) {
            for (var j = (objectPos.x - 1 < 0 ? 0 : objectPos.x - 1); j < (objectPos.x + 1 > result[0].length - 1 ? result[0].length - 1 : objectPos.x + 1); j++) {
                result[i][j] = this.damage;
            }
        }
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
        /*
        var inAttPosX:number = playerPos.x + (this.startPointShif*faceDirection.x);
        var inAttPosY:number = playerPos.y + (this.startPointShif*faceDirection.y);
        
        if (this.shape == WeaponShape.LINE_1) {
            return this.attackInLine(result, inAttPosX, inAttPosY, playerPos, faceDirection, valueMatrix, 1);
        } else if (this.shape == WeaponShape.LINE_2) {
            return this.attackInLine(result, inAttPosX, inAttPosY, playerPos, faceDirection, valueMatrix, 2);
        } else if (this.shape == WeaponShape.LINE_3) {
            return this.attackInLine(result, inAttPosX, inAttPosY, playerPos, faceDirection, valueMatrix, 3);
        } else if (this.shape == WeaponShape.LINE_INF) {
            return this.attackInLine(result, inAttPosX, inAttPosY, playerPos, faceDirection, valueMatrix, -1);
        } else if (this.shape == WeaponShape.AREA) {
            return this.attackInArea(result, inAttPosX, inAttPosY, playerPos, faceDirection, valueMatrix);
        }
        */
        var w = (faceDirection.x == 1 || faceDirection.x == -1) ? this.pattern.length : this.pattern[0].length;
        var h = (faceDirection.x == 1 || faceDirection.x == -1) ? this.pattern[0].length : this.pattern.length;
        var pathRightDir = new Array(h);
        for (var i = 0; i < h; i++) {
            pathRightDir[i] = new Array(w);
            for (var j = 0; j < w; j++) {
                pathRightDir[i][j] = 0;
            }
        }
        if (faceDirection.x == -1) {
            pathRightDir = Weapon.invertColumn(Weapon.transpose(pathRightDir, w, h, this.pattern));
        }
        else if (faceDirection.x == 1) {
            pathRightDir = Weapon.invertRow(Weapon.transpose(pathRightDir, w, h, this.pattern));
        }
        else if (faceDirection.y == 1) {
            pathRightDir = Weapon.invertRow(Weapon.invertColumn(this.pattern));
        }
        else {
            pathRightDir = this.pattern;
        }
        var topLeft = new Phaser.Point(0, 0);
        if (this.centered) {
            if (faceDirection.x == 1) {
                topLeft.x = playerPos.x - Math.floor(pathRightDir[0].length / 2);
                topLeft.y = playerPos.y - Math.floor(pathRightDir.length / 2);
            }
            else if (faceDirection.x == -1) {
                topLeft.x = playerPos.x - Math.floor(pathRightDir[0].length / 2);
                topLeft.y = playerPos.y - Math.floor(pathRightDir.length / 2);
            }
            else if (faceDirection.y == 1) {
                topLeft.x = playerPos.x - Math.floor(pathRightDir[0].length / 2);
                topLeft.y = playerPos.y - Math.floor(pathRightDir.length / 2);
            }
            else if (faceDirection.y == -1) {
                topLeft.x = playerPos.x - Math.floor(pathRightDir[0].length / 2);
                topLeft.y = playerPos.y - Math.floor(pathRightDir.length / 2);
            }
        }
        else {
            if (faceDirection.x == 1) {
                topLeft.x = playerPos.x + 1;
                topLeft.y = playerPos.y - Math.floor(pathRightDir.length / 2);
            }
            else if (faceDirection.x == -1) {
                topLeft.x = playerPos.x - pathRightDir[0].length;
                topLeft.y = playerPos.y - Math.floor(pathRightDir.length / 2);
            }
            else if (faceDirection.y == 1) {
                topLeft.x = playerPos.x - Math.floor(pathRightDir[0].length / 2);
                topLeft.y = playerPos.y + 1;
            }
            else if (faceDirection.y == -1) {
                topLeft.x = playerPos.x - Math.floor(pathRightDir[0].length / 2);
                topLeft.y = playerPos.y - pathRightDir.length;
            }
        }
        var t = "";
        for (var i = 0; i < pathRightDir.length; i++) {
            for (var j = 0; j < pathRightDir[0].length; j++) {
                t += pathRightDir[i][j];
            }
            t += "\n";
        }
        console.log("dir: " + faceDirection.x + "x" + faceDirection.y + " " + topLeft.x + "x" + topLeft.y + "\n" + t);
        console.log("WHT");
        //USE resto??? %
        if (this.repeat) {
            if (faceDirection.x == 1) {
                for (var i = (topLeft.y < 0 ? 0 : topLeft.y); i - topLeft.y < pathRightDir.length; i++) {
                    for (var j = topLeft.x; j < result.length; j++) {
                        if (pathRightDir[(i - topLeft.y)][(j - topLeft.x) % pathRightDir[0].length] == 1) {
                            result[i][j] = this.damage;
                        }
                    }
                }
            }
            else if (faceDirection.x == -1) {
                for (var i = (topLeft.y < 0 ? 0 : topLeft.y); i - topLeft.y < pathRightDir.length; i++) {
                    for (var j = playerPos.x - 1; j >= 0; j--) {
                        var x = (j - (playerPos.x % pathRightDir[0].length) + pathRightDir[0].length) % pathRightDir[0].length, aux = 2;
                        console.log(i + "," + j + " " + playerPos.x + " " + pathRightDir[0].length + " " + x);
                        if (pathRightDir[i - topLeft.y][x] == 1) {
                            result[i][j] = this.damage;
                        }
                    }
                }
            }
            else if (faceDirection.y == 1) {
                var auxi = 0;
                for (var i = topLeft.y; i < result.length; i++) {
                    for (var j = (topLeft.x < 0 ? 0 : topLeft.x); j - topLeft.x < pathRightDir[0].length && j < result[0].length; j++) {
                        if (pathRightDir[auxi][j - topLeft.x] == 1) {
                            //if (pathRightDir[(i + topLeft.y) % pathRightDir.length][j - topLeft.x] == 1) {
                            result[i][j] = this.damage;
                        }
                    }
                    auxi++;
                    if (auxi >= pathRightDir.length)
                        auxi = 0;
                }
            }
            else {
                for (var i = playerPos.y - 1; i >= 0; i--) {
                    for (var j = (topLeft.x < 0 ? 0 : topLeft.x); j - topLeft.x < pathRightDir[0].length && j < result[0].length; j++) {
                        var y = (i - (playerPos.y % pathRightDir.length) + pathRightDir.length) % pathRightDir.length, aux = 2;
                        if (pathRightDir[y][j - topLeft.x] == 1) {
                            result[i][j] = this.damage;
                        }
                    }
                }
            }
        }
        else {
            for (var i = (topLeft.y < 0 ? 0 : topLeft.y); i - topLeft.y < pathRightDir.length && i < result.length; i++) {
                for (var j = (topLeft.x < 0 ? 0 : topLeft.x); j - topLeft.x < pathRightDir[0].length && j < result[0].length; j++) {
                    if (pathRightDir[i - topLeft.y][j - topLeft.x] == 1) {
                        result[i][j] = this.damage;
                    }
                }
            }
        }
        return result;
    };
    Weapon.invertRow = function (matrix) {
        var aux = new Array(matrix.length);
        for (var i = 0; i < matrix.length; i++) {
            aux[i] = new Array(matrix[0].length);
            for (var j = 0; j < matrix[0].length; j++) {
                aux[i][j] = 0;
            }
        }
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[0].length; j++) {
                aux[i][j] = matrix[i][matrix[0].length - j - 1];
            }
        }
        return aux;
    };
    Weapon.invertColumn = function (matrix) {
        var aux = new Array(matrix.length);
        for (var i = 0; i < matrix.length; i++) {
            aux[i] = new Array(matrix[0].length);
        }
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[0].length; j++) {
                aux[i][j] = matrix[matrix.length - i - 1][j];
            }
        }
        return aux;
    };
    Weapon.transpose = function (pathRightDir, w, h, pattern) {
        for (var i = 0; i < h; i++) {
            for (var j = 0; j < w; j++) {
                pathRightDir[i][j] = pattern[j][i];
            }
        }
        return pathRightDir;
    };
    Weapon.prototype.getWeaponName = function () {
        return this.name;
    };
    Weapon.prototype.getCurrentCoolDown = function () {
        return this.curCooldown;
    };
    Weapon.prototype.getDamage = function () {
        return this.damage;
    };
    Weapon.prototype.getAreaLevel = function () {
        return this.areaLevel;
    };
    Weapon.prototype.updateCoolDown = function () {
        if (this.curCooldown > -5) {
            this.curCooldown--;
        }
    };
    Weapon.prototype.isWeaponReady = function () {
        return (this.curCooldown <= 0 ? true : false);
    };
    Weapon.prototype.isWeaponPoisoned = function () {
        return this.poison;
    };
    /**
     * Returns wheter this weapon stays in the ground (such as a mine)
     */
    Weapon.prototype.isWeaponLingering = function () {
        return this.poison;
    };
    Weapon.prototype.getLingeringLife = function () {
        return this.amountOfLingeringLive;
    };
    Weapon.prototype.fireWeapon = function () {
        this.curCooldown = this.cooldown;
    };
    Weapon.prototype.getSpecialEffect = function () {
        return this.crazyEffect;
    };
    Weapon.prototype.isObjectFadeWithTimeType = function () {
        return this.objectFade;
    };
    Weapon.prototype.isObjectExplodeType = function () {
        return this.objectExplode;
    };
    Weapon.prototype.toString = function () {
        var text = "";
        text += this.name + ": Damage: " + this.damage + ", Cooldown: " + this.cooldown + ", "
            + ", Size pattern: " + this.pattern.length + "x" + this.pattern[0].length + ", centered: " +
            this.centered + ", repeat?" + this.repeat + " power:" + this.weaponPower + "\n";
        for (var i = 0; i < this.pattern.length; i++) {
            for (var j = 0; j < this.pattern[0].length; j++) {
                text += this.pattern[i][j];
            }
            text += "\n";
        }
        text += "---\n";
        return text;
    };
    Weapon.prototype.calculateAreaLevel = function () {
        this.areaLevel = 0;
        var black = 0, div = 1;
        for (var i = 0; i < this.pattern.length; i++) {
            for (var j = 0; j < this.pattern[0].length; j++) {
                if (this.pattern[i][j] == 1) {
                    black++;
                }
            }
        }
        if (!this.centered && this.repeat) {
            div = (Global.ROOM_HEIGHT - 1) * Weapon.MAX_AREA_SIZE_FRONT_W;
            var repetitions = 0;
            if (this.pattern.length > this.pattern[0].length) {
                repetitions = (Global.ROOM_HEIGHT - 1) / this.pattern.length;
            }
            else {
                repetitions = (Global.ROOM_WIDTH - 1) / this.pattern[0].length;
            }
            black = black * repetitions;
        }
        else {
            var maxW = Weapon.MAX_AREA_SIZE_FRONT_W;
            var maxH = Weapon.MAX_AREA_SIZE_FRONT_H;
            div = (Weapon.MAX_AREA_SIZE_FRONT_W * Weapon.MAX_AREA_SIZE_FRONT_H);
        }
        this.areaLevel += black / div;
        console.log("calc:" + this.areaLevel + " black:" + black + " div:" + div + " max:" +
            Weapon.MAX_AREA_SIZE_FRONT_W + "x" + Weapon.MAX_AREA_SIZE_FRONT_H + " global:" +
            Global.ROOM_WIDTH + "x" + Global.ROOM_HEIGHT + " pat:" + this.pattern[0].length + "x" + this.pattern.length);
    };
    Weapon.prototype.howPowerful = function () {
        var amount = 0;
        var aux = 0;
        var MAX = 0;
        var surrouding = 0;
        if (this.centered) {
            if (this.pattern[Math.floor(this.pattern.length / 2) - 1][Math.floor(this.pattern[0].length / 2)] == 1)
                aux++;
            if (this.pattern[Math.floor(this.pattern.length / 2) + 1][Math.floor(this.pattern[0].length / 2)] == 1)
                aux++;
            if (this.pattern[Math.floor(this.pattern.length / 2)][Math.floor(this.pattern[0].length / 2) - 1] == 1)
                aux++;
            if (this.pattern[Math.floor(this.pattern.length / 2)][Math.floor(this.pattern[0].length / 2) + 1] == 1)
                aux++;
            surrouding = aux / 4;
        }
        else {
            if (this.pattern[this.pattern.length - 1][Math.floor(this.pattern[0].length / 2)] == 1)
                surrouding++;
        }
        MAX++;
        var cooldown = 0;
        if (this.cooldown < Math.ceil(Weapon.MAX_COOLDOWN / 3))
            cooldown = (2 / 2);
        else if (this.cooldown < (Math.ceil(Weapon.MAX_COOLDOWN / 3) * 2)) {
            cooldown = (1 / 2);
        }
        MAX++;
        var damage = 0;
        if (this.damage == Weapon.MAX_DAMAGE)
            damage = (2 / 2);
        else if (this.damage > Math.floor(Weapon.MAX_DAMAGE / 2)) {
            damage = (1 / 2);
        }
        MAX++;
        var area = this.areaLevel;
        MAX++;
        var ling = this.lingering ? (this.amountOfLingeringLive > 0 ? this.amountOfLingeringLive / 3 : 4) : 0;
        /*if (this.centered) {
            aux = (this.pattern.length * this.pattern[0].length)
                / (Math.ceil(Global.ROOM_HEIGHT / 2) * Math.ceil(Global.ROOM_WIDTH / 2));
            amount += aux;
        }
        MAX++;
        if (this.repeat)
            amount++;
        MAX++;*/
        this.weaponPower = ((surrouding * 2) + (area * 1) + (cooldown * 2) + (damage * 2) + (ling * 1)) / 8;
        return this.weaponPower;
    };
    /**Damage that weapon gives: 1 <= damage <= 3 */
    Weapon.MIN_DAMAGE = 1;
    Weapon.MAX_DAMAGE = 3;
    Weapon.DAMAGE_INTERVAL = 1;
    /** Time of shot cooldown: 1, 3, 5 */
    Weapon.MIN_COOLDOWN = 1;
    Weapon.MAX_COOLDOWN = 5;
    Weapon.COOLDOWN_INTERVAL = 2;
    Weapon.CHANCE_CENTERED = 0.4;
    Weapon.CHANCE_REPEAT = 0.3;
    Weapon.MAX_AREA_SIZE_CENTER_W = (Math.ceil(Global.ROOM_WIDTH / 2) > 3 ? Math.ceil(Global.ROOM_WIDTH / 2) : 3);
    Weapon.MAX_AREA_SIZE_CENTER_H = (Math.ceil(Global.ROOM_HEIGHT / 2) > 3 ? Math.ceil(Global.ROOM_HEIGHT / 2) : 3);
    Weapon.MAX_AREA_SIZE_FRONT_W = (Math.ceil(Global.ROOM_WIDTH / 2) > 3 ? Math.ceil(Global.ROOM_WIDTH / 2) : 3); //Math.ceil(Global.ROOM_WIDTH / 3);
    Weapon.MAX_AREA_SIZE_FRONT_H = (Math.ceil(Global.ROOM_HEIGHT / 2) > 3 ? Math.ceil(Global.ROOM_HEIGHT / 2) : 3); //Math.ceil(Global.ROOM_HEIGHT / 3);
    Weapon.EFFECTS = [WeaponCrazyEffects.NOTHING, WeaponCrazyEffects.TELEPORT, WeaponCrazyEffects.KNOCKBACK_ENEMY_1,
        WeaponCrazyEffects.KNOCKBACK_ENEMY_2, WeaponCrazyEffects.KNOCKBACK_PLAYER2,
        WeaponCrazyEffects.KNOCKBACK_PLAYER_1, WeaponCrazyEffects.CONVERT_CONTROL];
    return Weapon;
}());
/// <reference path="Weapon.ts"/>
var WeaponGenerator = (function () {
    function WeaponGenerator() {
    }
    WeaponGenerator.GenerateWeapon = function (paramSet, random, oldWeapon, nameGenerator, minDamage) {
        if (minDamage > 0) {
            return WeaponGenerator.GenerateAWeapon(paramSet, random, oldWeapon, nameGenerator, minDamage);
        }
        if (WeaponGenerator.weapons == null) {
            WeaponGenerator.weapons = new Array(WeaponGenerator.AMOUNT_OF_WEAPONS);
            for (var i = 0; i < WeaponGenerator.AMOUNT_OF_WEAPONS; i++) {
                WeaponGenerator.weapons[i] = WeaponGenerator.GenerateAWeapon(paramSet, random, oldWeapon, nameGenerator, minDamage);
            }
            WeaponGenerator.weapons.sort(function (a, b) { return a.weaponPower - b.weaponPower; });
        }
        var prob = random.frac();
        var s = "";
        console.log("Preparing" + prob);
        for (var i = 0; i < WeaponGenerator.AMOUNT_OF_WEAPONS; i++) {
            s += WeaponGenerator.weapons[i].weaponPower + "\t";
        }
        console.log("Printing ");
        console.log(s);
        var selectedWeapon = WeaponGenerator.AMOUNT_OF_WEAPONS - 1;
        var w = null;
        for (var i = 0; i < WeaponGenerator.AMOUNT_OF_WEAPONS; i++)
            if (prob < WeaponGenerator.weapons[i].weaponPower) {
                console.log("chose one :" + WeaponGenerator.weapons[i].weaponPower + " " + prob);
                selectedWeapon = i;
                break;
            }
        w = WeaponGenerator.weapons[selectedWeapon];
        WeaponGenerator.weapons[selectedWeapon] =
            WeaponGenerator.GenerateAWeapon(paramSet, random, oldWeapon, nameGenerator, minDamage);
        WeaponGenerator.weapons.sort(function (a, b) { return a.weaponPower - b.weaponPower; });
        return w;
    };
    WeaponGenerator.GenerateAWeapon = function (paramSet, random, oldWeapon, nameGenerator, minDamage) {
        if (paramSet == null) {
            paramSet = new Array(4);
            for (var i = 0; i < paramSet.length; i++) {
                paramSet[i] = 0;
            }
        }
        var weapon = new Weapon();
        var previousRandom = random;
        var a = -1 % 5;
        do {
            var width = 1; //paramSet.get("width");
            var height = 1; //= paramSet.get("height");
            var aux = 3; //random.integerInRange(1, 4);
            switch (aux) {
                case 1:
                    weapon.direction = new Phaser.Point(1, 0);
                    break;
                case 2:
                    weapon.direction = new Phaser.Point(0, 1);
                    break;
                case 3:
                    weapon.direction = new Phaser.Point(-1, 0);
                    break;
                case 4:
                    weapon.direction = new Phaser.Point(0, -1);
                    break;
            }
            if (random.realInRange(0, 1) < Weapon.CHANCE_CENTERED) {
                weapon.centered = true;
                width = random.integerInRange(3, Weapon.MAX_AREA_SIZE_CENTER_W);
                height = random.integerInRange(3, Weapon.MAX_AREA_SIZE_CENTER_H);
                weapon.repeat = false;
                weapon.lingering = false;
            }
            else {
                weapon.centered = false;
                if (random.realInRange(0, 1) < Weapon.CHANCE_REPEAT)
                    weapon.repeat = true;
                else
                    weapon.repeat = false;
                if (random.frac() < 0.3) {
                    weapon.lingering = true;
                    if (random.frac() < 0.5) {
                        width = 1;
                        height = random.integerInRange(1, Weapon.MAX_AREA_SIZE_FRONT_H);
                    }
                    if (random.frac() < 0.15)
                        weapon.amountOfLingeringLive = -1;
                    else
                        weapon.amountOfLingeringLive = random.integerInRange(1, Weapon.MAX_AREA_SIZE_FRONT_W);
                    if (random.frac() < 0.35) {
                        weapon.objectExplode = true;
                    }
                    else {
                        weapon.objectExplode = false;
                    }
                    if (random.frac() < 0.40) {
                        weapon.objectFade = true;
                    }
                    else {
                        weapon.objectFade = false;
                    }
                }
                else {
                    width = random.integerInRange(1, Weapon.MAX_AREA_SIZE_FRONT_W);
                    height = random.integerInRange(1, Weapon.MAX_AREA_SIZE_FRONT_H);
                    weapon.lingering = false;
                }
            }
            if (width % 2 == 0) {
                if (width > 2)
                    width--;
                else
                    width++;
            }
            if (height % 2 == 0) {
                if (height > 2)
                    height--;
                else
                    height++;
            }
            //initialize variable
            var hasAnyFilled = false;
            var pattern = new Array(height);
            for (var i = 0; i < height; i++) {
                pattern[i] = new Array(width);
                for (var j = 0; j < width; j++) {
                    pattern[i][j] = 0;
                }
            }
            var s = "";
            for (var i = 0; i < height; i++) {
                for (var j = 0; j < width; j++) {
                    s += pattern[i][j];
                }
                s += "\n";
            }
            console.log("checking " + height + "x" + width + " " + pattern.length + "x" + pattern[0].length + "\n" + s);
            if (width == 1) {
                pattern = WeaponGenerator.createPatternWithOneWidth(pattern, height, random, weapon.centered, (minDamage > -1 ? true : false));
            }
            else if (height == 1) {
                pattern = WeaponGenerator.createPatternWithOneHeight(pattern, width, random, weapon.centered, (minDamage > -1 ? true : false));
            }
            else {
                pattern = WeaponGenerator.createPattern(pattern, width, height, random, weapon.centered, (minDamage > -1 ? true : false));
            }
            //clear player position
            if (weapon.centered) {
                var center = new Phaser.Point(Math.floor(width / 2), Math.floor(height / 2));
                pattern[center.y][center.x] = 0;
            }
            //printWeapon
            var t = "";
            for (var i = 0; i < height; i++) {
                //copy other half
                for (var j = 0; j < width; j++) {
                    t += pattern[i][j];
                }
                t += "\n";
            }
            //console.log("before " + t);
            weapon.pattern = pattern;
            if (minDamage > -1)
                weapon.damage = minDamage;
            else
                weapon.damage = random.integerInRange(Weapon.MIN_DAMAGE, Weapon.MAX_DAMAGE);
            weapon.cooldown = random.integerInRange(Weapon.MIN_COOLDOWN, Weapon.MAX_COOLDOWN);
            weapon.curCooldown = 0;
            console.log("LOGGING " + weapon.toString());
        } while (oldWeapon != null && WeaponGenerator.isSame(weapon, oldWeapon));
        weapon.idSound = random.between(0, AudioManager.AMOUNT_OF_ATTACKS - 1);
        //Generate name.
        weapon.name = WeaponGenerator.generateName(weapon, pattern, random, nameGenerator);
        weapon.calculateAreaLevel();
        weapon.howPowerful();
        random = previousRandom;
        return weapon;
    };
    WeaponGenerator.isSame = function (a, b) {
        if (a.pattern.length != b.pattern.length || a.pattern[0].length != b.pattern[0].length) {
            return false;
        }
        if (a.cooldown != b.cooldown || a.centered != b.centered ||
            a.poison != b.poison || a.lingering != b.lingering)
            return false;
        for (var i = 0; i < a.pattern.length; i++) {
            for (var j = 0; j < a.pattern[0].length; j++) {
                if (a.pattern[i][j] != b.pattern[i][j]) {
                    return false;
                }
            }
        }
        return true;
    };
    WeaponGenerator.createPatternWithOneWidth = function (pattern, height, random, centered, needToHaveAdj) {
        var hasAnyFilled = false;
        for (var i = 0; i < height; i++) {
            //randomize half
            if (random.frac() < 0.5) {
                pattern[i][0] = 1;
                hasAnyFilled = true;
            }
        }
        if (!hasAnyFilled) {
            if (height > 1)
                pattern[random.integerInRange(0, height - 1)][0] = 1;
            else
                pattern[0][0] = 1;
        }
        if (needToHaveAdj) {
            if (centered) {
                pattern[Math.floor(pattern.length / 2) - 1][0] = 1;
                pattern[Math.floor(pattern.length / 2) + 1][0] = 1;
            }
            else {
                pattern[pattern.length - 1][0] = 1;
            }
        }
        return pattern;
    };
    WeaponGenerator.createPatternWithOneHeight = function (pattern, width, random, centered, needToHaveAdj) {
        var hasAnyFilled = false;
        //randomize half
        for (var j = 0; j < Math.floor(width / 2); j++) {
            if (random.frac() < 0.5)
                pattern[0][j] = 0;
            else {
                pattern[0][j] = 1;
                hasAnyFilled = true;
            }
        }
        if (!hasAnyFilled) {
            if (width > 2) {
                var rand = random.integerInRange(0, (Math.floor(width / 2) - 1 < 1 ? 1 : Math.floor(width / 2) - 1));
                pattern[0][rand] = 1;
            }
            else
                pattern[0][0] = 1;
        }
        //if odd number, add one row with random
        if (needToHaveAdj) {
            pattern[0][Math.floor(width / 2)] = 1;
        }
        else {
            if (random.frac() < 0.5)
                pattern[0][Math.floor(width / 2)] = 0;
            else
                pattern[0][Math.floor(width / 2)] = 1;
        }
        //copy other half
        for (var j = width - 1; j > Math.floor(width / 2); j--) {
            pattern[0][j] = pattern[0][width - j - 1];
        }
        return pattern;
    };
    WeaponGenerator.createPattern = function (pattern, width, height, random, centered, needToHaveAdj) {
        var hasAnyFilled = false;
        var orientation = (centered ? random.frac() : random.between(0, 0.65));
        //console.log("Orientation: " + orientation);
        if (orientation < 2) {
            //copy horizontally and diagonally
            for (var i = 0; i < height; i++) {
                //randomize half
                for (var j = 0; j < Math.floor(width / 2); j++) {
                    if (random.frac() < 0.5)
                        pattern[i][j] = 0;
                    else {
                        pattern[i][j] = 1;
                        hasAnyFilled = true;
                    }
                }
            }
            if (!hasAnyFilled) {
                if (width > 2 && height > 1)
                    pattern[random.integerInRange(0, height - 1)][random.integerInRange(0, Math.floor(width / 2) - 1)] = 1;
                else
                    pattern[0][0] = 1;
            }
            for (var i = 0; i < height; i++) {
                //if odd number, add one row with random
                if (random.frac() < 0.5)
                    pattern[i][Math.floor(width / 2)] = 0;
                else
                    pattern[i][Math.floor(width / 2)] = 1;
            }
            if (needToHaveAdj) {
                if (centered) {
                    if (pattern[Math.floor(pattern.length / 2) - 1][Math.floor(pattern[0].length / 2)] == 0 &&
                        pattern[Math.floor(pattern.length / 2)][Math.floor(pattern[0].length / 2) - 1] == 0) {
                        if (random.frac() < 0.5) {
                            pattern[Math.floor(pattern.length / 2) - 1][Math.floor(pattern[0].length / 2)] = 1;
                        }
                        else {
                            pattern[Math.floor(pattern.length / 2)][Math.floor(pattern[0].length / 2) - 1] = 1;
                        }
                    }
                }
                else {
                    if (pattern[pattern.length - 1][Math.floor(pattern[0].length / 2)] == 0)
                        pattern[pattern.length - 1][Math.floor(pattern[0].length / 2)] = 1;
                }
            }
            if (orientation < 0.55) {
                //copy horizontally
                for (var i = 0; i < height; i++) {
                    //copy other half
                    var half = 2;
                    for (var j = width - 1; j > Math.floor(width / 2); j--) {
                        pattern[i][j] = pattern[i][width - j - 1];
                    }
                }
            }
            else {
                //copy diagonally
                var auxPattern = new Array(height);
                for (var i = 0; i < height; i++) {
                    auxPattern[i] = new Array(width);
                    for (var j = 0; j < width; j++) {
                        auxPattern[i][j] = pattern[i][j];
                    }
                }
                auxPattern = Weapon.invertColumn(Weapon.invertRow(auxPattern));
                for (var i = 0; i < height; i++) {
                    //copy other half
                    var half = 2;
                    for (var j = width - 1; j > Math.floor(width / 2); j--) {
                        pattern[i][j] = auxPattern[i][j];
                    }
                }
                if (width % 2 != 0) {
                    for (var i = 0; i < Math.floor(height / 2); i++) {
                        pattern[i][Math.floor(width / 2)] = pattern[height - i - 1][Math.floor(width / 2)];
                    }
                }
                //here
                if (needToHaveAdj) {
                    if (centered) {
                        if (pattern[Math.floor(pattern.length / 2) - 1][Math.floor(pattern[0].length / 2)] == 0 &&
                            pattern[Math.floor(pattern.length / 2)][Math.floor(pattern[0].length / 2) - 1] == 0 &&
                            pattern[Math.floor(pattern.length / 2) + 1][Math.floor(pattern[0].length / 2)] == 0 &&
                            pattern[Math.floor(pattern.length / 2)][Math.floor(pattern[0].length / 2) + 1] == 0) {
                            if (random.frac() < 0.5) {
                                pattern[Math.floor(pattern.length / 2) - 1][Math.floor(pattern[0].length / 2)] = 1;
                                pattern[Math.floor(pattern.length / 2) + 1][Math.floor(pattern[0].length / 2)] = 1;
                            }
                            else {
                                pattern[Math.floor(pattern.length / 2)][Math.floor(pattern[0].length / 2) - 1] = 1;
                                pattern[Math.floor(pattern.length / 2)][Math.floor(pattern[0].length / 2) + 1] = 1;
                            }
                        }
                    }
                    else {
                        if (pattern[pattern.length - 1][Math.floor(pattern[0].length / 2)] == 0)
                            pattern[pattern.length - 1][Math.floor(pattern[0].length / 2)] = 1;
                    }
                }
            }
        }
        else {
            //copy vertically
            for (var i = 0; i < width; i++) {
                //randomize half
                for (var j = 0; j < Math.floor(height / 2); j++) {
                    if (random.frac() < 0.5)
                        pattern[j][i] = 0;
                    else {
                        pattern[j][i] = 1;
                        hasAnyFilled = true;
                    }
                }
            }
            if (!hasAnyFilled) {
                if (height > 2 && width > 1)
                    pattern[random.integerInRange(0, Math.floor(height / 2) - 1)][random.integerInRange(0, width - 1)] = 1;
                else
                    pattern[0][0] = 1;
            }
            var t = "-\n";
            for (var i = 0; i < pattern.length; i++) {
                for (var j = 0; j < pattern[0].length; j++) {
                    t += (pattern[i][j]);
                }
                t += ("\n");
            }
            t += "" + (pattern[Math.floor(pattern.length / 2) - 1][Math.floor(pattern[0].length / 2)] == 0) + " " +
                (pattern[Math.floor(pattern.length / 2)][Math.floor(pattern[0].length / 2) - 1] == 0) + " " + centered;
            //console.log(t);
            for (var i = 0; i < width; i++) {
                //if odd number, add one line with random
                if (random.frac() < 0.5)
                    pattern[Math.floor(height / 2)][i] = 0;
                else
                    pattern[Math.floor(height / 2)][i] = 1;
            }
            for (var i = 0; i < width; i++) {
                //copy other half
                var half = 2;
                for (var j = height - 1; j > Math.floor(height / 2); j--) {
                    pattern[j][i] = pattern[height - j - 1][i];
                }
            }
            if (needToHaveAdj) {
                if (centered) {
                    if (pattern[Math.floor(pattern.length / 2) - 1][Math.floor(pattern[0].length / 2)] == 0 &&
                        pattern[Math.floor(pattern.length / 2)][Math.floor(pattern[0].length / 2) - 1] == 0) {
                        if (random.frac() < 0.5) {
                            pattern[Math.floor(pattern.length / 2) - 1][Math.floor(pattern[0].length / 2)] = 1;
                            pattern[Math.floor(pattern.length / 2) + 1][Math.floor(pattern[0].length / 2)] = 1;
                        }
                        else {
                            pattern[Math.floor(pattern.length / 2)][Math.floor(pattern[0].length / 2) - 1] = 1;
                            pattern[Math.floor(pattern.length / 2)][Math.floor(pattern[0].length / 2) + 1] = 1;
                        }
                    }
                }
                else {
                    if (pattern[pattern.length - 1][Math.floor(pattern[0].length / 2)] == 0) {
                        pattern[pattern.length - 1][Math.floor(pattern[0].length / 2)] = 1;
                        pattern[0][Math.floor(pattern[0].length / 2)] = 1;
                    }
                }
            }
        }
        return pattern;
    };
    WeaponGenerator.generateName = function (weapon, pattern, random, nameGenerator) {
        var seed = new Array(8);
        seed[0] = weapon.damage;
        seed[1] = weapon.cooldown;
        seed[2] = weapon.centered ? 1 : 0;
        seed[3] = weapon.objectExplode ? 1 : 0;
        seed[4] = weapon.repeat ? 1 : 0;
        seed[5] = weapon.lingering ? 1 : 0;
        var patternValue = 0, last = 0;
        for (var i = 0; i < pattern.length; i++) {
            for (var j = 0; j < pattern[0].length; j++) {
                patternValue += pattern[i][j] * (Math.pow(10, last));
                last++;
            }
        }
        seed[6] = patternValue;
        seed[7] = weapon.objectFade ? 1 : 0;
        random = new Phaser.RandomDataGenerator(seed);
        var quantAdj = 1, weaponValue = 0;
        ;
        /*if (weapon.damage > Weapon.MAX_DAMAGE / 2)
            quantAdj++;
        if (weapon.isWeaponPoisoned() || weapon.isWeaponLingering())
            quantAdj++;
        if (weapon.cooldown < Weapon.MAX_COOLDOWN / 2)
            quantAdj++;
        if (quantAdj < 3 && (weapon.pattern.length > 3 && weapon.pattern[0].length > 3))
            quantAdj++;*/
        if (weapon.weaponPower > 7) {
            quantAdj = 1;
            weaponValue = 3;
        }
        else if (weapon.weaponPower > 3) {
            quantAdj = 2;
            weaponValue = 2;
        }
        else {
            quantAdj = 3;
            weaponValue = 1;
        }
        return nameGenerator.generateAName(quantAdj, random, (weapon.weaponPower > 7 ? true : false), (weapon.weaponPower < 7 && weapon.weaponPower > 3 ? true : false));
    };
    WeaponGenerator.DAMAGE = 0;
    WeaponGenerator.SIZE = 1;
    WeaponGenerator.COOLDOWN = 2;
    WeaponGenerator.SPECIAL = 3;
    WeaponGenerator.PROB_POWEFUL_WEAPON = 0.3;
    WeaponGenerator.MAX_POWERFUL_WEAPON = 2 * 3;
    WeaponGenerator.AMOUNT_OF_WEAPONS = 100;
    WeaponGenerator.weapons = null;
    return WeaponGenerator;
}());
var WeaponName = (function (_super) {
    __extends(WeaponName, _super);
    function WeaponName(game, x, y, name, movingSpeed, fadingSpeed) {
        if (movingSpeed === void 0) { movingSpeed = 0.4; }
        if (fadingSpeed === void 0) { fadingSpeed = 0.004; }
        _super.call(this, game, (x + 0.5) * Global.TILE_SIZE, (y + 0.5) * Global.TILE_SIZE);
        this.movingSpeed = movingSpeed;
        this.fadingSpeed = fadingSpeed;
        this.fadeOut = false;
        var style = { font: "15px pixelFont", fill: "#ffffff", align: "center" };
        var text = this.game.add.text(0, 0, name.toString(), style, this);
        text.anchor.set(0.5, 0.5);
        text.wordWrap = true;
        text.wordWrapWidth = (Global.ROOM_WIDTH - 4) * Global.TILE_SIZE;
        this.add(text);
        this.alpha = 0;
    }
    WeaponName.prototype.update = function () {
        _super.prototype.update.call(this);
        this.y -= this.movingSpeed;
        this.movingSpeed *= 0.995;
        if (this.fadeOut) {
            this.alpha -= this.fadingSpeed;
            if (this.alpha <= 0) {
                this.destroy();
            }
        }
        else {
            this.alpha += 0.1;
            if (this.alpha > 1) {
                this.alpha = 1;
                this.fadeOut = true;
            }
        }
    };
    return WeaponName;
}(BaseGameObject));
var WeaponNameGenerator = (function () {
    function WeaponNameGenerator(adjectives, nouns) {
        this.nouns = nouns.split(",");
        var adj = new Array(2);
        var aux = adjectives.split("\n");
        var pos = 0, neg = 0, neut = 0;
        for (var i = 0; i < aux.length; i++) {
            adj = aux[i].split("\@");
            switch (adj[1].charAt(0)) {
                case '+':
                    pos++;
                    break;
                case '-':
                    neg++;
                    break;
                default:
                    neut++;
                    break;
            }
        }
        this.adjectivesPos = new Array(pos);
        this.adjectivesNeg = new Array(neg);
        this.adjectivesNeut = new Array(neut);
        pos = 0;
        neg = 0;
        neut = 0;
        for (var i = 0; i < aux.length; i++) {
            adj = aux[i].split("\@");
            switch (adj[1].charAt(0)) {
                case '+':
                    this.adjectivesPos[pos] = adj[0];
                    pos++;
                    break;
                case '-':
                    this.adjectivesNeg[neg] = adj[0];
                    neg++;
                    break;
                default:
                    this.adjectivesNeut[neut] = adj[0];
                    neut++;
                    break;
            }
        }
    }
    WeaponNameGenerator.prototype.generateAName = function (amountAdj, random, good, bad) {
        var prob = new Array(3);
        if (good) {
            prob = [5, 65, 30];
        }
        else if (bad) {
            prob = [65, 5, 30];
        }
        else {
            prob = [33, 33, 33];
        }
        var result = "The ";
        for (var i = 0; i < amountAdj; i++) {
            var p = random.integerInRange(0, 100);
            var selected = "";
            if (p < prob[0]) {
                selected = this.adjectivesPos[random.between(0, this.adjectivesPos.length - 1)];
            }
            else if (p < prob[0] + prob[1]) {
                selected = this.adjectivesNeg[random.between(0, this.adjectivesNeg.length - 1)];
            }
            else {
                selected = this.adjectivesNeut[random.between(0, this.adjectivesNeut.length - 1)];
            }
            result += selected + " ";
        }
        result += this.nouns[random.between(0, this.nouns.length - 1)];
        return result;
    };
    return WeaponNameGenerator;
}());
var BaseGameState = (function (_super) {
    __extends(BaseGameState, _super);
    function BaseGameState() {
        _super.call(this);
    }
    BaseGameState.prototype.create = function () {
        this.game.world.setBounds(-20, -35, this.game.width + 20, this.game.height + 35);
        this.game.camera.x = -10;
        this.game.camera.y = -30;
    };
    return BaseGameState;
}(Phaser.State));
/// <reference path="BaseGameState.ts"/>
var AdventureNameState = (function (_super) {
    __extends(AdventureNameState, _super);
    function AdventureNameState() {
        _super.call(this);
    }
    AdventureNameState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.adventureName = new AdventureName(this.game, this.game.width / 2, this.game.height / 2, Global.levelName);
        this.add.existing(this.adventureName);
        this.game.add.existing(new WhiteLayout(this.game, 10, 10, this.game.width - 20, this.game.height - 20));
        this.add.existing(new HintText(this.game, this.game.width / 2, this.game.height - 5, "(x) to continue"));
    };
    AdventureNameState.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.input.keyboard.isDown(Phaser.Keyboard.X)) {
            this.adventureName.fadeOut(-0.05);
            this.input.keyboard.reset();
        }
    };
    return AdventureNameState;
}(BaseGameState));
var GameplayModes;
(function (GameplayModes) {
    GameplayModes[GameplayModes["adventure"] = 0] = "adventure";
    GameplayModes[GameplayModes["arcade"] = 1] = "arcade";
    GameplayModes[GameplayModes["endless"] = 2] = "endless";
})(GameplayModes || (GameplayModes = {}));
/// <reference path="BaseGameState.ts"/>
/// <reference path="../GameObjects/FloorTiles/DoorTile.ts"/>
/// <reference path="../GameObjects/FloorTiles/HighlightTile.ts"/>
/// <reference path="../GameObjects/FloorTiles/DirHighlightTile.ts"/>
/// <reference path="../GameObjects/BoxObject.ts"/>
/// <reference path="../GameObjects/Enemy/EnemyObject.ts"/>
/// <reference path="../GameObjects/PlayerObject.ts"/>
/// <reference path="../GameObjects/HUDElements/MiniMap.ts"/>
/// <reference path="../GameObjects/Boss/Boss.ts"/>
var GameplayState = (function (_super) {
    __extends(GameplayState, _super);
    function GameplayState() {
        _super.call(this);
    }
    GameplayState.prototype.create = function () {
        _super.prototype.create.call(this);
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
    };
    GameplayState.prototype.createHUDElements = function () {
        this.miniMap = new MiniMap(this.game, this.game.width - (Global.mapWidth + 1.5) * Global.MAP_SIZE, this.game.height - (this.game.height - this.game.width) / 2 - Global.mapHeight * Global.MAP_SIZE / 2 + 5);
        this.game.add.existing(this.miniMap);
        this.handUI = new HandUI(this.game, 1.5 * Global.MAP_SIZE, this.game.height - (this.game.height - this.game.width) / 2 - 3 * Global.MAP_SIZE / 2 + 5);
        this.game.add.existing(this.handUI);
        if (Global.currentWeapon != null) {
            this.updateHandUI();
        }
        this.buttonText = new ButtonTutorial(this.game, 7, this.game.height);
        this.game.add.existing(this.buttonText);
        this.game.add.existing(new CrateText(this.game, this.game.width / 2, this.game.height -
            (this.game.height - this.game.width) + 25));
        this.game.add.existing(new LevelName(this.game, this.game.width / 2, 5));
        this.game.add.existing(new WhiteLayout(this.game, -this.game.camera.x, -this.game.camera.y, Global.ROOM_WIDTH * Global.TILE_SIZE, Global.ROOM_HEIGHT * Global.TILE_SIZE));
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
        for (var i = 0; i < 2 * (Global.ROOM_WIDTH + Global.ROOM_HEIGHT); i++) {
            var tempTile = new HighlightTile(this.game);
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
        var numOfEnemies = (Global.levelNumber + 1) + this.game.rnd.integerInRange(1 * (Global.levelNumber + 1), 2 * (Global.levelNumber + 1));
        if (room.cleared || room.roomType == RoomTypeEnum.None || room.roomType == RoomTypeEnum.Boss) {
            numOfEnemies = 0;
        }
        var tiles = room.getMatrix(this.enemyObjects);
        for (var dx = -2; dx <= 2; dx++) {
            for (var dy = -2; dy <= 2; dy++) {
                if (dy > -2) {
                    tiles[Math.floor(Global.ROOM_WIDTH / 2) + dx][1 + dy] = TileTypeEnum.Wall;
                }
                if (dy < 2) {
                    tiles[Math.floor(Global.ROOM_WIDTH / 2) + dx][Global.ROOM_HEIGHT - 2 + dy] = TileTypeEnum.Wall;
                }
                if (dx > -2) {
                    tiles[1 + dx][Math.floor(Global.ROOM_HEIGHT / 2) + dy] = TileTypeEnum.Wall;
                }
                if (dx < 2) {
                    tiles[Global.ROOM_WIDTH - 2 + dx][Math.floor(Global.ROOM_HEIGHT / 2) + dy] = TileTypeEnum.Wall;
                }
            }
        }
        for (var i = 0; i < numOfEnemies; i++) {
            var list = this.getEmptyTiles(tiles);
            var point = list[this.game.rnd.integerInRange(0, list.length - 1)];
            tiles[point.x][point.y] = TileTypeEnum.Enemy;
            var tempEnemy = EnemyFactory.getEnemey(this.game, point.x, point.y, this.game.rnd);
            this.enemyObjects.push(tempEnemy);
            this.game.add.existing(tempEnemy);
        }
        if (room.roomType == RoomTypeEnum.Boss) {
            this.bossObject = new Boss(this.game, Global.ROOM_WIDTH / 2 - Global.previousDirection.x * 2, Global.ROOM_HEIGHT / 2 - Global.previousDirection.y * 2);
            this.game.add.existing(this.bossObject);
        }
        this.playerObject = new PlayerObject(this.game, Math.floor(Global.ROOM_WIDTH / 2) +
            Global.previousDirection.x * (Math.floor(Global.ROOM_WIDTH / 2) - 1), Math.floor(Global.ROOM_HEIGHT / 2) +
            Global.previousDirection.y * (Math.floor(Global.ROOM_HEIGHT / 2) - 1), Global.currentWeapon);
        this.game.add.existing(this.playerObject);
        if (!room.cleared && room.roomType == RoomTypeEnum.None) {
            this.showBoxObject(new Phaser.Point(Math.floor(Global.ROOM_WIDTH / 2), Math.floor(Global.ROOM_HEIGHT / 2)));
        }
        if (Global.levelNumber == 0 && Global.previousDirection.getMagnitude() == 0) {
            this.playerObject.y += Global.TILE_SIZE;
            this.boxObject.y -= Global.TILE_SIZE;
            for (var i = 0; i < this.currentDoors.length; i++) {
                this.currentDoors[i].lock();
            }
        }
        this.lastPosition = this.playerObject.getTilePosition();
    };
    GameplayState.prototype.highlight = function (damageMatrix) {
        this.unhighlight();
        var index = 0;
        for (var y = 0; y < Global.ROOM_HEIGHT; y++) {
            for (var x = 0; x < Global.ROOM_WIDTH; x++) {
                if (damageMatrix[y][x] > 0) {
                    this.highlightTiles[index].x = x * Global.TILE_SIZE;
                    this.highlightTiles[index].y = y * Global.TILE_SIZE;
                    this.highlightTiles[index].show(damageMatrix[y][x]);
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
        var lastEnemyDied = null;
        var listOfIndeces = [];
        for (var i = 0; i < this.enemyObjects.length; i++) {
            var eP = this.enemyObjects[i].getTilePosition();
            if (this.enemyObjects[i].takeDamage(damage[eP.y][eP.x])) {
                listOfIndeces.push(i);
            }
        }
        for (var i = listOfIndeces.length - 1; i >= 0; i--) {
            lastEnemyDied = this.enemyObjects[i].getTilePosition();
            this.enemyObjects.splice(listOfIndeces[i], 1);
        }
        if (this.bossObject != null) {
            var bP = this.bossObject.getTilePosition();
            if (this.bossObject.takeDamage(damage[bP.y][bP.x])) {
                this.bossObject = null;
            }
        }
        if (lastEnemyDied != null && this.enemyObjects.length <= 0) {
            if (Global.isDungeonFinished()) {
                this.portalObject.showPortal(lastEnemyDied.x, lastEnemyDied.y);
            }
            else {
                this.showBoxObject(lastEnemyDied);
            }
        }
    };
    GameplayState.prototype.showBoxObject = function (position) {
        this.boxObject.show(position);
    };
    GameplayState.prototype.changeHandWeapon = function (minDamage) {
        Global.currentWeapon = WeaponGenerator.GenerateWeapon(null, this.game.rnd, this.playerObject.getWeapon(), Global.weaponNameGenerator, minDamage);
        this.playerObject.setWeapon(Global.currentWeapon);
        this.updateHandUI();
    };
    GameplayState.prototype.updateHandUI = function () {
        this.handUI.updateDamage(Global.currentWeapon.getDamage(), 0);
        this.handUI.updatePatternValue(Math.ceil(Global.currentWeapon.getAreaLevel() * 10));
        this.handUI.updateCooldown(Global.currentWeapon.cooldown - 1, 0);
        this.handUI.showHide(HandObjects.Weapon);
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
                this.playerObject.takeDamage();
                this.playerObject = null;
                return true;
            }
        }
        if (!Global.getCurrentRoom().cleared && this.enemyObjects.length <= 0) {
            if (this.boxObject.checkCollision(playerPosition.x, playerPosition.y)) {
                this.changeHandWeapon(-1);
                this.boxObject.collectCrate();
                for (var i = 0; i < this.currentDoors.length; i++) {
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
    };
    GameplayState.prototype.handleEnemyCollision = function () {
        var playerPosition = this.playerObject.getTilePosition();
        var enemyAttacked = [];
        for (var i = 0; i < this.enemyObjects.length; i++) {
            if (this.enemyObjects[i].checkCollision(playerPosition.x, playerPosition.y)) {
                this.playerObject.takeDamage();
                this.playerObject = null;
                return true;
            }
            var colPoint = this.enemyObjects[i].enemyShot(playerPosition, Global.getCurrentRoom().getMatrix(this.enemyObjects));
            console.log("laser attack:" + colPoint);
            if (colPoint != null) {
                var enemyPos = this.enemyObjects[i].getTilePosition();
                this.game.add.existing(new LaserEffect(this.game, enemyPos.x, enemyPos.y, colPoint.x, colPoint.y));
                if (colPoint.equals(playerPosition)) {
                    this.playerObject.takeDamage();
                    this.playerObject = null;
                    return true;
                }
                else {
                    enemyAttacked.push(colPoint);
                }
            }
        }
        if (this.bossObject != null &&
            this.bossObject.checkCollision(playerPosition.x, playerPosition.y)) {
            this.playerObject.takeDamage();
            this.playerObject = null;
            return true;
        }
        var damageMatrix = [];
        for (var y = 0; y < Global.ROOM_HEIGHT; y++) {
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
        this.handleAttack(damageMatrix);
        return false;
    };
    GameplayState.prototype.stepUpdate = function () {
        if (this.handleCollision()) {
            return;
        }
        for (var i = 0; i < this.enemyObjects.length; i++) {
            var tileMatrix = Global.getCurrentRoom().getMatrix(this.enemyObjects);
            this.enemyObjects[i].enemyMove(this.lastPosition, tileMatrix);
        }
        if (this.bossObject != null) {
            this.bossObject.stepUpdate(this.lastPosition, Global.getCurrentRoom().getMatrix(this.enemyObjects));
        }
        if (this.handleEnemyCollision()) {
            return;
        }
        this.playerObject.updateCoolDown();
    };
    GameplayState.prototype.update = function () {
        _super.prototype.update.call(this);
        this.buttonText.alpha = 1;
        if (Global.currentWeapon == null) {
            this.buttonText.alpha = 0;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.R)) {
            this.game.state.start("loading", true);
            Global.audioManager.stopMusic();
            this.game.input.keyboard.reset();
        }
        if (this.playerObject == null) {
            Global.audioManager.stopMusic();
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
                this.highlight(this.playerObject.getWeapon().getWeaponPositions(this.playerObject.getTilePosition(), this.lastDirection, Global.matrixTranspose(Global.getCurrentRoom().getMatrix(this.enemyObjects))));
                this.game.input.keyboard.reset();
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.X)) {
                this.lastPosition = this.playerObject.getTilePosition();
                this.arrowHighlight.hide();
                this.unhighlight();
                this.playerObject.fireWeapon();
                this.handleAttack(this.playerObject.getWeapon().getWeaponPositions(this.playerObject.getTilePosition(), this.lastDirection, Global.matrixTranspose(Global.getCurrentRoom().getMatrix(this.enemyObjects))));
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
                    this.highlight(this.playerObject.getWeapon().getWeaponPositions(this.playerObject.getTilePosition(), this.lastDirection, Global.matrixTranspose(Global.getCurrentRoom().getMatrix(this.enemyObjects))));
                    this.game.input.keyboard.reset();
                    this.buttonText.aimMode();
                }
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.Z) &&
                    Global.crateNumber >= Global.getCurrentCost()) {
                    Global.crateNumber -= Global.getCurrentCost();
                    Global.itemUsage += 1;
                    Global.currentPlayer.specialAbility.useSpecial(this);
                    this.buttonText.normalMode();
                    this.game.input.keyboard.reset();
                }
            }
        }
    };
    return GameplayState;
}(BaseGameState));
/// <reference path="BaseGameState.ts"/>
var LoadingState = (function (_super) {
    __extends(LoadingState, _super);
    function LoadingState() {
        _super.call(this);
    }
    LoadingState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.game.load.spritesheet("graphics", "assets/graphics/gameGraphics.png", 32, 32);
        this.game.load.text("dungeonNames_1", "assets/data/dungeonNames_1.txt");
        this.game.load.text("dungeonNames_2", "assets/data/dungeonNames_2.txt");
        this.game.load.text("dungeonNames_3", "assets/data/dungeonNames_3.txt");
        this.game.load.text("weaponAdjectives", "assets/data/weaponNamesAdj.txt");
        this.game.load.text("weaponNouns", "assets/data/weaponNamesNoun.txt");
        this.game.load.text("playerdata", "assets/data/playerData.txt");
        Global.audioManager = new AudioManager();
        Global.audioManager.preload(this.game);
    };
    LoadingState.prototype.create = function () {
        _super.prototype.create.call(this);
        Global.weaponNameGenerator = new WeaponNameGenerator(this.game.cache.getText("weaponAdjectives"), this.game.cache.getText("weaponNouns"));
        Global.audioManager.addSounds(this.game);
        this.game.state.start("mainmenu", true);
    };
    return LoadingState;
}(BaseGameState));
var MainMenuState = (function (_super) {
    __extends(MainMenuState, _super);
    function MainMenuState() {
        _super.call(this);
        this.unselectedValues = ["the binding of isaac", "super crate box", "steamspy", "igf awards"];
        this.selectedValues = ["adventure mode", "arcade mode", "stats", "credits"];
    }
    MainMenuState.prototype.create = function () {
        _super.prototype.create.call(this);
        Global.audioManager.playTitleMusic();
        this.game.add.existing(new GameNameText(this.game, this.game.width / 2 + 10, this.game.height / 2 - 60));
        this.index = 0;
        this.choices = [];
        for (var i = 0; i < this.unselectedValues.length; i++) {
            var temp = new FlyingText(this.game, this.game.width / 2, this.game.height / 2 + 20 * i + 30, this.unselectedValues[i], 2);
            this.choices.push(temp);
            this.game.add.existing(temp);
        }
        this.choices[this.index].changeText(this.selectedValues[this.index]);
        this.choices[this.index].selectText(true);
        this.game.add.existing(new WhiteLayout(this.game, 10, 10, this.game.width - 20, this.game.height - 20));
        this.game.add.existing(new HintText(this.game, this.game.width / 2, this.game.height - 5, "(up/down) to choose\n(x) to select"));
    };
    MainMenuState.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            this.choices[this.index].changeText(this.unselectedValues[this.index]);
            this.choices[this.index].selectText(false);
            this.index -= 1;
            if (this.index < 0) {
                this.index = this.selectedValues.length - 1;
            }
            this.choices[this.index].changeText(this.selectedValues[this.index]);
            this.choices[this.index].selectText(true);
            Global.audioManager.playMenuSelection();
            this.game.input.keyboard.reset();
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            this.choices[this.index].changeText(this.unselectedValues[this.index]);
            this.choices[this.index].selectText(false);
            this.index = (this.index + 1) % this.selectedValues.length;
            this.choices[this.index].changeText(this.selectedValues[this.index]);
            this.choices[this.index].selectText(true);
            Global.audioManager.playMenuSelection();
            this.game.input.keyboard.reset();
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.X)) {
            switch (this.index) {
                case 0:
                    Global.currentGameMode = GameplayModes.adventure;
                    break;
                case 1:
                    Global.currentGameMode = GameplayModes.arcade;
                    break;
                case 3:
                    break;
                case 4:
                    break;
                case 5:
                    break;
            }
            if (this.index >= 0 && this.index <= 1) {
                this.game.state.start("playerselect", true);
            }
            Global.audioManager.playMenuSelected();
            this.game.input.keyboard.reset();
        }
    };
    return MainMenuState;
}(BaseGameState));
var PlayerSelectState = (function (_super) {
    __extends(PlayerSelectState, _super);
    function PlayerSelectState() {
        _super.call(this);
    }
    PlayerSelectState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.selectedIndex = 0;
        var text = this.game.cache.getText("playerdata");
        this.characters = [new AatPlayerData(text), new GatPlayerData(text), new TatPlayerData(text)];
        this.playerText = new PlayerInfoText(this.game, this.game.width / 2, this.game.height / 2);
        this.game.add.existing(this.playerText);
        this.playerText.updateText(this.characters[this.selectedIndex]);
        this.game.add.existing(new WhiteLayout(this.game, 10, 10, this.game.width - 20, this.game.height - 20));
        this.game.add.existing(new HintText(this.game, this.game.width / 2, this.game.height - 5, "(left/right) to choose\n(x) to select"));
    };
    PlayerSelectState.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.selectedIndex -= 1;
            if (this.selectedIndex < 0) {
                this.selectedIndex = this.characters.length - 1;
            }
            this.playerText.updateText(this.characters[this.selectedIndex]);
            Global.audioManager.playMenuSelection();
            this.game.input.keyboard.reset();
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.selectedIndex = (this.selectedIndex + 1) % this.characters.length;
            this.playerText.updateText(this.characters[this.selectedIndex]);
            Global.audioManager.playMenuSelection();
            this.game.input.keyboard.reset();
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.X)) {
            Global.audioManager.stopTitleMusic();
            Global.initialize(this.game.cache.getText("dungeonNames_1"), this.game.cache.getText("dungeonNames_2"), this.game.cache.getText("dungeonNames_3"), this.game.rnd);
            Global.currentPlayer = this.characters[this.selectedIndex];
            if (Global.currentGameMode == GameplayModes.adventure) {
                this.game.state.start("adventurename", true);
            }
            else {
                this.game.state.start("gameplay", true);
            }
            Global.audioManager.playMenuSelected();
            this.game.input.keyboard.reset();
        }
    };
    return PlayerSelectState;
}(BaseGameState));
