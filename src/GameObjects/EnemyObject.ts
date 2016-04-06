class EnemyObject extends BaseGameObject{
    
    static enemySpriteNumbers:number[] = [8, 6, 9];
    enemySprite:Phaser.Sprite;
    enemyHealth:number;
    enemySpeed:number;
    isAlive:boolean;
    directions:Phaser.Point[];
    keepDirection:number;
    factorDirectionChange:number;
    enemyDirection:Phaser.Point;
    hitWall:boolean;
    cannons:CannonObject[];
    enemyType:EnemyTypeEnum;
    
    constructor(game:Phaser.Game, x:number, y:number, params:number[]){
        super(game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
        
        this.enemyHealth = 1;
        this.enemySpeed = 1;
        this.isAlive = true;        
        this.setDirections();
        this.keepDirection = 0;
        this.factorDirectionChange = 2;
        this.hitWall = false;
        this.enemyDirection = this.pickDirection();
        this.cannons = this.initializeCannons(0, this.x, this.y);
        this.enemyType = this.game.rnd.integerInRange(0, 3);
        
        this.enemySprite = this.game.add.sprite(0, 0, 'graphics');
        this.enemySprite.animations.add("normal", [EnemyObject.enemySpriteNumbers[this.enemyType]]);
        this.enemySprite.animations.play("normal");
        this.enemySprite.tint = 0xcc6668;
        this.add(this.enemySprite);
    }
    
    initializeCannons(numberOfCannons:number, x:number, y:number)
    {
        var cannons:CannonObject[];
        if(numberOfCannons == 0)
        {
            cannons = [];
        }
        else if(numberOfCannons == 1)
        {
           cannons = [new CannonObject(this.game, x, y, this.pickDirection())]; 
        }
        else if(numberOfCannons == 2)
        {
            var direction = this.pickDirection();
            cannons = [new CannonObject(this.game, x, y, this.pickDirection()),
                      new CannonObject(this.game, x, y,
                      this.pickDirectionWithThisConstraint(this.findDirectionIndex(direction)))]; 
        }
        return cannons;
    }
    
    defineEnemyType(choose:number)
    {
        if (choose == 1)
        {
            return EnemyTypeEnum.BackAndForth;
        }
        if (choose == 2)
        {
            return EnemyTypeEnum.Random;
        }
        if (choose == 3)
        {
            return EnemyTypeEnum.ClockMovement;
        }
        if (choose == 4)
        {
            return EnemyTypeEnum.Chaser;
        }
    }
    
    chaser(player:PlayerObject)
    {
        if((this.getTilePosition().x < player.getTilePosition().x)
        && (this.getTilePosition().y < player.getTilePosition().y))
        {
            var difX = player.getTilePosition().x - this.getTilePosition().x;
            var difY = player.getTilePosition().y - this.getTilePosition().y;
            
            if(difX >= difY)
            {
                this.x += Global.TILE_SIZE * this.enemySpeed;
            }
            else
            {
                this.y += Global.TILE_SIZE * this.enemySpeed;
            }
        }
        
        if((this.getTilePosition().x < player.getTilePosition().x)
        && (this.getTilePosition().y > player.getTilePosition().y))
        {
            var difX = player.getTilePosition().x - this.getTilePosition().x;
            var difY = this.getTilePosition().y - player.getTilePosition().y;
            
            if(difX >= difY)
            {
                this.x += Global.TILE_SIZE * this.enemySpeed;
            }
            else
            {
                this.y -= Global.TILE_SIZE * this.enemySpeed;
            }
        }
        
        if((this.getTilePosition().x > player.getTilePosition().x)
        && (this.getTilePosition().y < player.getTilePosition().y))
        {
            var difX = this.getTilePosition().x - player.getTilePosition().x;
            var difY = player.getTilePosition().y - this.getTilePosition().y;
            
            if(difX >= difY)
            {
                this.x -= Global.TILE_SIZE * this.enemySpeed;
            }
            else
            {
                this.y += Global.TILE_SIZE * this.enemySpeed;
            }
        }
        
        if((this.getTilePosition().x > player.getTilePosition().x)
        && (this.getTilePosition().y > player.getTilePosition().y))
        {
            var difX = player.getTilePosition().x - this.getTilePosition().x;
            var difY = player.getTilePosition().y - this.getTilePosition().y;
            
            if(difX >= difY)
            {
                this.x -= Global.TILE_SIZE * this.enemySpeed;
            }
            else
            {
                this.y -= Global.TILE_SIZE * this.enemySpeed;
            }
        }
    }
    
    setDirections()
    {
       this.directions = [new Phaser.Point(0,0), 
                          new Phaser.Point(1,0),
                          new Phaser.Point(0,1),
                          new Phaser.Point(-1,0),
                          new Phaser.Point(0,-1)];
    }
    
    pickDirection()
    {
        var dir:Phaser.Point;
        var choose:number = Math.floor(Math.random() * 4) + 1;
        dir = this.directions[choose];
        return dir;
    }
    
    findDirectionIndex(dir:Phaser.Point)
    {
        var indexReturn = 1;
        for (var index = 1; index < this.directions.length; index++) {
           if(dir.equals(this.directions[index]))
           {
               indexReturn = index;
           } 
        }
        return indexReturn;
    }
    
    pickDirectionWithThisConstraint(constraint:number)
    {
        var choose:number = (Math.floor(Math.random() * 4) + 1) % constraint;
        return this.directions[choose];
    }
    
    moveUntilFindWall(playerPosition:Phaser.Point, tileMatrix:TileTypeEnum[][])
    {
        if(this.keepDirection % this.factorDirectionChange == 0)
        {
            this.enemyDirection = this.pickDirection();
        }
        this.keepDirection++;
        
        if(!this.updateEnemy(this.enemyDirection, tileMatrix))
        {
            var newDir = this.pickDirectionWithThisConstraint(this.findDirectionIndex(this.enemyDirection));
            this.updateEnemy(newDir, tileMatrix);
        }
    }
    
    moveAndKeepDirection(playerPosition:Phaser.Point, tileMatrix:TileTypeEnum[][])
    {
        if(this.keepDirection % this.factorDirectionChange == 0)
        {
            this.enemyDirection = this.pickDirection();
        }
        this.keepDirection++;
        
        if(!this.updateEnemy(this.enemyDirection, tileMatrix))
        {
            var newDir = this.pickDirectionWithThisConstraint(this.findDirectionIndex(this.enemyDirection));
            this.updateEnemy(newDir, tileMatrix);
        }
    }
    
    circleDirectionClockWise(direction:Phaser.Point)
    {
        if(direction.equals(new Phaser.Point(1,0)))
        {
            return new Phaser.Point(0,1);
        }
        if(direction.equals(new Phaser.Point(0,1)))
        {
            return new Phaser.Point(-1,0);
        }
        if(direction.equals(new Phaser.Point(-1,0)))
        {
            return new Phaser.Point(0,-1);
        }
        if(direction.equals(new Phaser.Point(0,-1)))
        {
            return new Phaser.Point(1,0);
        }
    }
    
    moveCircleClockWise(playerPosition:Phaser.Point, tileMatrix:TileTypeEnum[][])
    {
        if(this.keepDirection % this.factorDirectionChange == 0)
        {
            this.enemyDirection = this.circleDirectionClockWise(this.enemyDirection);
        }
        this.keepDirection++;
        
        if(!this.updateEnemy(this.enemyDirection, tileMatrix))
        {
            var newDir = this.pickDirectionWithThisConstraint(this.findDirectionIndex(this.enemyDirection));
            this.updateEnemy(newDir, tileMatrix);
        }
    }
    
    moveCircleCounterClockWise(playerPosition:Phaser.Point, tileMatrix:TileTypeEnum[][])
    {
        if(this.keepDirection % this.factorDirectionChange == 0)
        {
            this.enemyDirection = this.circleDirectionClockWise(this.enemyDirection);
            this.enemyDirection.x = this.enemyDirection.x * (-1);
            this.enemyDirection.y = this.enemyDirection.y * (-1);
        }
        this.keepDirection++;
        
        if(!this.updateEnemy(this.enemyDirection, tileMatrix))
        {
            var newDir = this.pickDirectionWithThisConstraint(this.findDirectionIndex(this.enemyDirection));
            this.updateEnemy(newDir, tileMatrix);
        }
    }
    
    reverseDirection(dir:Phaser.Point)
    {
        dir.x = dir.x * (-1);
        dir.y = dir.y * (-1);
        return dir;
    }
    
    moveBackAndForth(playerPosition:Phaser.Point, tileMatrix:TileTypeEnum[][])
    {
         if(!this.updateEnemy(this.enemyDirection, tileMatrix))
        {
            this.updateEnemy(this.reverseDirection(this.enemyDirection), tileMatrix);
        }
    }
    
    moveEnemy(playerPosition:Phaser.Point, tileMatrix:TileTypeEnum[][])
    {
        var enemyDirection = this.pickDirection();
        if(!this.updateEnemy(enemyDirection, tileMatrix))
        {
            var newDir = this.pickDirectionWithThisConstraint(this.findDirectionIndex(enemyDirection));
            this.updateEnemy(newDir, tileMatrix);
        }
    }
    
    enemyShot(player:PlayerObject)
    {
        if (typeof this.cannons == 'undefined')
        {
            return false;
        }
        if(this.cannons.length == 1)
        {
            return this.cannons[0].shoot(player, this);
        }
        if(this.cannons.length == 2)
        {
            var shoot1 = this.cannons[0].shoot(player, this);
            var shoot2 = this.cannons[1].shoot(player, this);
            return (shoot1 || shoot2);
        }
    }
    
    updateEnemy(enemyDirection:Phaser.Point, tileMap:TileTypeEnum[][])
    {   
        let canMove:boolean = false;
        
        if (enemyDirection.x > 0)
        {
            if(tileMap[this.getTilePosition().x + 1][this.getTilePosition().y] == TileTypeEnum.Passable)
            {
                this.x += Global.TILE_SIZE * this.enemySpeed;
                canMove = true;
            }
            else
            {
                canMove = false;
            }        
        }
        
        if(enemyDirection.x < 0)
        {
            if(tileMap[this.getTilePosition().x - 1][this.getTilePosition().y] == TileTypeEnum.Passable)
            {
                this.x -= Global.TILE_SIZE * this.enemySpeed;
                canMove = true;
            }
            else
            {
                canMove = false;
            }   
        }
        
        if(enemyDirection.y > 0)
        {
            if(tileMap[this.getTilePosition().x][this.getTilePosition().y + 1] == TileTypeEnum.Passable)
            {
                this.y += Global.TILE_SIZE * this.enemySpeed;
                canMove = true;
            }
            else
            {
                canMove = false;
            }
        }
        
        if(enemyDirection.y < 0)
        {
            if(tileMap[this.getTilePosition().x][this.getTilePosition().y - 1] == TileTypeEnum.Passable)
            {
                this.y -= Global.TILE_SIZE * this.enemySpeed;
                canMove = true;
            }
            else
            {
                canMove = false;
            }
        }
        
        return canMove;
    }
    
    movement(player:PlayerObject, tileMap:TileTypeEnum[][])
    {
       console.log("movType : " + this.enemyType);
       if(this.enemyType == EnemyTypeEnum.BackAndForth)
       {
           this.moveBackAndForth(player.position, tileMap);
       }
       
       if(this.enemyType == EnemyTypeEnum.Chaser)
       {
           this.chaser(player);
       }
       
       if(this.enemyType == EnemyTypeEnum.Random)
       {
           this.moveAndKeepDirection(player.position, tileMap);
       }
       
       if(this.enemyType == EnemyTypeEnum.ClockMovement)
       {
           var choice = Math.floor(Math.random() * 2) + 1;
           if(choice % 2 == 0)
           {
               this.moveCircleClockWise(player.position, tileMap);
           }
           else
           {
               this.moveCircleCounterClockWise(player.position, tileMap);
           }
       }
    }
    
    takeDamage(damage:number)
    {
        if(this.enemyHealth - damage > 0)
        {
            this.enemyHealth = this.enemyHealth - damage;
        }
        else
        {
            this.isAlive = false;
            super.killObject();
            return true;
        } 
        
        return false;   
    }
    
    isEnemyAlive()
    {
        return this.isAlive;
    }
    
    selectHealthValue(selector:number)
    {
        if(selector == -4 || selector == -3)
        {
            return 1;
        }
        if(selector == -2 || selector == -1)
        {
            return Math.floor(Math.random() * 2) + 1;
        }
        if(selector == 0)
        {
            return Math.floor(Math.random() * 3) + 1;
        }
        if(selector == 1 || selector == 2)
        {
            return Math.floor(Math.random() * 3) + 2;
        }
        if(selector == 3 || selector == 4)
        {
            return 3;
        }
    }
    
    selectSpeedOrCannonValues(selector:number)
    {
        if(selector == -4 || selector == -3)
        {
            return 0;
        }
        if(selector == -2 || selector == -1)
        {
            return (Math.floor(Math.random() * 2) + 1) - 1;
        }
        if(selector == 0)
        {
            return (Math.floor(Math.random() * 3) + 1) - 1;
        }
        if(selector == 1 || selector == 2)
        {
            return (Math.floor(Math.random() * 3) + 2) - 1;
        }
        if(selector == 3 || selector == 4)
        {
            return 2;
        }
    }
    
    selectTypeOfEnemey(selector:number)
    {
         if(selector == -4 || selector == -3)
        {
            return EnemyTypeEnum.BackAndForth;
        }
        if(selector == -2 || selector == -1)
        {
            return this.defineEnemyType(Math.floor(Math.random() * 3) + 1);
        }
        if(selector == 0)
        {
            return this.defineEnemyType(Math.floor(Math.random() * 4) + 1);
        }
        if(selector == 1 || selector == 2)
        {
            return this.defineEnemyType(Math.floor(Math.random() * 4) + 2);
        }
        if(selector == 3 || selector == 4)
        {
            return EnemyTypeEnum.Chaser;
        }
    }
    
    static getEnemey(game:Phaser.Game, x:number, y:number, params:number[])
    {
        return new EnemyObject(game, x, y, params);
    }
}