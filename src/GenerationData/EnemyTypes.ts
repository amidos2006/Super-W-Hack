enum EnemyNames{
    Random,
    Chaser,
    Patrol,
    Shooter,
    Explosive,
    Blob,
    TotalEnemies
}

class EnemyTypes{
    typeProbabilities:number[][];
    healthProbabilites:number[][];
    patrols:Phaser.Point[];
    currentEnemyNumbers:number[];
    levelNumber:number;
    lastDirection:Phaser.Point;
    
    constructor(game:Phaser.Game){
        this.typeProbabilities = [];
        
        var probString:String[] = game.cache.getText("enemyTypes").split("\n");
        for (var i = 0; i < probString.length; i++) {
            this.typeProbabilities.push([]);
            var values:string[] = probString[i].split(",");
            for (var j = 0; j < values.length; j++) {
                this.typeProbabilities[i].push(parseInt(values[j]));
            }
        }
        
        this.healthProbabilites = [];
        
        probString = game.cache.getText("enemyHealth").split("\n");
        for (var i = 0; i < probString.length; i++) {
            this.healthProbabilites.push([]);
            var values:string[] = probString[i].split(",");
            for (var j = 0; j < values.length; j++) {
                this.healthProbabilites[i].push(parseInt(values[j]));
            }
        }
    }
    
    initNewRoom(levelNumber:number, lastDirection:Phaser.Point){
        this.levelNumber = levelNumber;
        this.currentEnemyNumbers = [];
        for (var i = 0; i < EnemyNames.TotalEnemies; i++) {
            this.currentEnemyNumbers.push(0);
        }
        this.patrols = [];
        this.lastDirection = lastDirection;
        for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
                if(Math.abs(x) != Math.abs(y) && !(x == -lastDirection.x && y == -lastDirection.y)){
                    this.patrols.push(new Phaser.Point(x, y));
                }
            }
        }
    }
    
    getIndex(random:Phaser.RandomDataGenerator, prob:number[][]){
        var cdf:number[] = [this.typeProbabilities[this.levelNumber][0]];
        var total:number = 0;
        for (var i = 1; i < this.typeProbabilities[this.levelNumber].length; i++) {
            cdf.push(cdf[i - 1] + this.typeProbabilities[this.levelNumber][i]);
            total = cdf[i];
        }
        for (var i = 0; i < this.typeProbabilities[this.levelNumber].length; i++) {
            cdf[i] /= total;
        }
        var value:number = random.realInRange(0, 1);
        for (var i = 0; i < cdf.length; i++) {
            if(value < cdf[i]){
                return i;
            }
        }
        return cdf.length - 1;
    }
    
    getFarAwayTiles(map:TileTypeEnum[][]){
        var locations:Phaser.Point[] = Global.getEmptyTiles(map);
        var playerLocation:Phaser.Point = new Phaser.Point(Math.floor((this.lastDirection.x + 1) * Global.ROOM_WIDTH / 2) 
            - Math.floor((this.lastDirection.x + 1) / 2), Math.floor((this.lastDirection.y + 1) * Global.ROOM_HEIGHT / 2) 
            - Math.floor((this.lastDirection.y + 1) / 2));
        playerLocation.x -= this.lastDirection.x;
        playerLocation.y -= this.lastDirection.y;
            
        for (var i = 0; i < locations.length; i++) {
            if(playerLocation.distance(locations[i]) < 3){
                locations.splice(i, 1);
                i--;
            }
        }
        
        return locations;
    }
    
    createRandom(game:Phaser.Game, map:TileTypeEnum[][], damage:number, distances:number[]){
        var locations:Phaser.Point[] = this.getFarAwayTiles(map);
        var empty:Phaser.Point = locations[game.rnd.integerInRange(0, locations.length - 1)];
        var health:number = this.getIndex(game.rnd, this.healthProbabilites) + 1;
        var maxHealth:boolean = true;
        for (var i = 0; i < distances.length; i++) {
            if(distances[i] > 1){
                maxHealth = false;
                break;
            }
        }
        if(maxHealth && health > damage){
            health = damage;
        }
        
        this.currentEnemyNumbers[EnemyNames.Random] += 1;
        return new RandomEnemyObject(game, empty.x, empty.y, health, 0, new Phaser.Point());
    }
    
    createChaser(game:Phaser.Game, map:TileTypeEnum[][], damage:number, distances:number[]){
        var locations:Phaser.Point[] = this.getFarAwayTiles(map);
        var empty:Phaser.Point = locations[game.rnd.integerInRange(0, locations.length - 1)];
        var health:number = this.getIndex(game.rnd, this.healthProbabilites) + 1;
        var maxHealth:boolean = true;
        for (var i = 0; i < distances.length; i++) {
            if(distances[i] > 1){
                maxHealth = false;
                break;
            }
        }
        if(this.currentEnemyNumbers[EnemyNames.Patrol] == 0 && maxHealth && health > damage){
            health = damage;
        }
        
        this.currentEnemyNumbers[EnemyNames.Chaser] += 1;
        return new ChaserEnemyObject(game, empty.x, empty.y, health, 0, new Phaser.Point());
    }
    
    createShooter(game:Phaser.Game, map:TileTypeEnum[][], damage:number, distances:number[]){
        var health:number = this.getIndex(game.rnd, this.healthProbabilites) + 1;
        this.currentEnemyNumbers[EnemyNames.Shooter] += 1;
        var cannonDirection:Phaser.Point = new Phaser.Point(this.lastDirection.x, this.lastDirection.y);
        cannonDirection = cannonDirection.rotate(0, 0, 90, true);
        if(Math.abs(cannonDirection.x) == 1){
            cannonDirection.y = 0;
        }
        else{
            cannonDirection.x = 0;
        }
        console.log(this.lastDirection + " " + cannonDirection);
        return new StaticShooterEnemyObject(game, Math.floor(Global.ROOM_WIDTH/2), 
            Math.floor(Global.ROOM_HEIGHT/2), health, 1, cannonDirection);
    }
    
    createExplosive(game:Phaser.Game, map:TileTypeEnum[][], damage:number, distances:number[]):EnemyObject{
        var locations:Phaser.Point[] = this.getFarAwayTiles(map);
        var empty:Phaser.Point = locations[game.rnd.integerInRange(0, locations.length - 1)];
        var health:number = this.getIndex(game.rnd, this.healthProbabilites) + 1;
        var changeEnemy:boolean = true;
        for (var i = 0; i < distances.length; i++) {
            if(distances[i] > 2){
                changeEnemy = false;
                break;
            }
        }
        if(this.currentEnemyNumbers[EnemyNames.Patrol] == 0 && changeEnemy){
            if(Math.random() < 0.5){
                return this.createPatrol(game, map, damage, distances);
            }
            return this.createChaser(game, map, damage, distances);
        }
        
        this.currentEnemyNumbers[EnemyNames.Explosive] += 1;
        return new ExplosiveEnemyObject(game, empty.x, empty.y, health, 0, new Phaser.Point());
    }
    
    createBlob(game:Phaser.Game, map:TileTypeEnum[][], damage:number, distances:number[]):EnemyObject{
        var locations:Phaser.Point[] = this.getFarAwayTiles(map);
        var empty:Phaser.Point = locations[game.rnd.integerInRange(0, locations.length - 1)];
        var health:number = this.getIndex(game.rnd, this.healthProbabilites) + 1;
        
        var playerLocation:Phaser.Point = new Phaser.Point(Math.floor((this.lastDirection.x + 1) * Global.ROOM_WIDTH / 2) 
            - Math.floor((this.lastDirection.x + 1) / 2), Math.floor((this.lastDirection.y + 1) * Global.ROOM_HEIGHT / 2) 
            - Math.floor((this.lastDirection.y + 1) / 2));
        playerLocation.x -= this.lastDirection.x;
        playerLocation.y -= this.lastDirection.y;
        
        this.currentEnemyNumbers[EnemyNames.Blob] += 1;
        return new BlobEnemyObject(game, empty.x, empty.y, health, 0, new Phaser.Point(), playerLocation);
    }
    
    getBestPatrolPositions(random:Phaser.RandomDataGenerator, map:TileTypeEnum[][], refrenceValue:number){
        var positions: Phaser.Point[] = [];
        var playerLocation:Phaser.Point = new Phaser.Point(Math.floor((this.lastDirection.x + 1) * Global.ROOM_WIDTH / 2) 
            - Math.floor((this.lastDirection.x + 1) / 2), Math.floor((this.lastDirection.y + 1) * Global.ROOM_HEIGHT / 2) 
            - Math.floor((this.lastDirection.y + 1) / 2));
        for (var x = 2; x < Math.ceil(map.length / 2) - 2; x++) {
            var value: number = 0;
            var maxValue: number = 0;
            var places: number[] = [];
            var maxPlaces: number[] = [];
            for (var y = 0; y < map[x].length; y++) {
                if (map[x][y] == TileTypeEnum.Passable) {
                    if ((y > Math.floor(Global.ROOM_HEIGHT / 2) + 1 || 
                        y < Math.floor(Global.ROOM_HEIGHT / 2) - 1) &&
                        !(playerLocation.x == x || playerLocation.x == y || 
                        playerLocation.y == x || playerLocation.y == y)){
                        places.push(y);
                    }
                    value += 1;
                }
                else if(map[x][y] == TileTypeEnum.Enemy){
                    value += 1;
                }
                else {
                    if (value > maxValue) {
                        maxValue = value;
                        maxPlaces = places;
                    }
                    value = 0;
                    places = [];
                }
            }
            if (maxValue > refrenceValue) {
                positions.push(new Phaser.Point(x, maxPlaces[random.integerInRange(0, maxPlaces.length - 1)]));
            }
        }
        
        return positions[random.integerInRange(0, positions.length - 1)];
    }
    
    createPatrol(game:Phaser.Game, map:TileTypeEnum[][], damage:number, distances:number[]){
        var position:Phaser.Point = new Phaser.Point();
        var health:number = this.getIndex(game.rnd, this.healthProbabilites) + 1;
        var cannonDirection:Phaser.Point = this.patrols.splice(game.rnd.integerInRange(0, this.patrols.length-1), 1)[0];
        var moveDirection:Phaser.Point = new Phaser.Point(cannonDirection.y, cannonDirection.x);
        if(Math.random() < 0.5){
            moveDirection.x *= -1;
            moveDirection.y *= -1;
        }
        
        if(cannonDirection.x == 1){
            position = this.getBestPatrolPositions(game.rnd, map, 3);
        }
        if(cannonDirection.x == -1){
            position = this.getBestPatrolPositions(game.rnd, Global.matrixReflectX(map), 3);
            if(position != null){
                position.x = Global.ROOM_WIDTH - position.x - 1;
            }
        }
        if(cannonDirection.y == 1){
            position = this.getBestPatrolPositions(game.rnd, Global.matrixTranspose(map), 3);
            if(position != null){
                var tempY:number = position.y;
                position.y = position.x;
                position.x = tempY;
            }
        }
        if(cannonDirection.y == -1){
            position = this.getBestPatrolPositions(game.rnd, Global.matrixReflectX(Global.matrixTranspose(map)), 3);
            if(position != null){
                var tempY:number = position.y;
                position.y = position.x;
                position.x = tempY;
                position.y = Global.ROOM_HEIGHT - position.y - 1;
            }
        }
        
        if(position == null){
            this.patrols.push(cannonDirection);
            this.currentEnemyNumbers[EnemyNames.Chaser] += 1;
            return this.createChaser(game, map, damage, distances);
        }
        
        this.currentEnemyNumbers[EnemyNames.Patrol] += 1;
        return new BackAndForthEnemyObject(game, position.x, position.y, health, 1, cannonDirection, moveDirection);
    }
    
    checkConstraints(currentClassIndex:EnemyNames){
        switch (currentClassIndex){
            case EnemyNames.Shooter:
                return this.currentEnemyNumbers[currentClassIndex] < 1;
            case EnemyNames.Patrol:
                return this.currentEnemyNumbers[currentClassIndex] < 2;
        }
        return true;
    }
    
    getEnemy(game:Phaser.Game, map:TileTypeEnum[][], damageMatrix:number[][]){
        var damageValue:number = 0;
        var distances:number[] = [];
        for (var x = 0; x < Global.ROOM_WIDTH; x++) {
            for (var y = 0; y < Global.ROOM_HEIGHT; y++) {
                if(damageMatrix[x][y] > 0){
                    damageValue = damageMatrix[x][y];
                    var d:number = Math.abs(x - Math.floor(Global.ROOM_WIDTH / 2)) + 
                        Math.abs(y - Math.floor(Global.ROOM_HEIGHT / 2));
                    distances.push(d);
                }
            }
        }
        var currentClassIndex:number = 0;
        do{
            currentClassIndex = this.getIndex(game.rnd, this.typeProbabilities);
        }while(!this.checkConstraints(currentClassIndex));
        
        var enemy:EnemyObject = null;
        switch (currentClassIndex) {
            case EnemyNames.Random:
                enemy = this.createRandom(game, map, damageValue, distances);
                break;
            case EnemyNames.Chaser:
                enemy = this.createChaser(game, map, damageValue, distances);
                break;
            case EnemyNames.Patrol:
                enemy = this.createPatrol(game, map, damageValue, distances);
                break;
            case EnemyNames.Shooter:
                enemy = this.createShooter(game, map, damageValue, distances);
                break;
            case EnemyNames.Explosive:
                enemy = this.createExplosive(game, map, damageValue, distances);
                break;
            case EnemyNames.Blob:
                enemy = this.createBlob(game, map, damageValue, distances);
                break;
        }
        
        return enemy;
    }
}