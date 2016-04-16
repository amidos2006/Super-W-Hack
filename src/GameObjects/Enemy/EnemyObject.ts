class EnemyObject extends BaseGameObject implements Movement{
    
    enemySprite:Phaser.Sprite;
    healthText:Phaser.Text;
    enemyHealth:number;
    enemySpeed:number;
    isAlive:boolean;
    directions:Phaser.Point[];
    keepDirection:number;
    factorDirectionChange:number;
    enemyDirection:Phaser.Point;
    hitWall:boolean;
    cannons:CannonObject[];
    
    constructor(game:Phaser.Game, x:number, y:number, health:number, numberOfCannons:number,
        cannonDirection1:Phaser.Point){
        super(game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
        
        this.setDirections();
        
        if(health < 0 || health > 3)
        {
            this.enemyHealth = 1;
        }
        else
        {
            this.enemyHealth = health;    
        }
        
        this.cannons = this.initializeCannons(numberOfCannons, new Phaser.Point(x,y), cannonDirection1);
        
        this.enemySpeed = 1;
        this.isAlive = true;        
        this.keepDirection = 0;
        this.factorDirectionChange = 2;
        this.hitWall = false;
        
       var style = { font: "10px pixelFont", fill: "#cc6668", align: "right" };
        this.healthText = this.game.add.text(Global.TILE_SIZE - 3, Global.TILE_SIZE + 4, 
            this.enemyHealth.toString(), style, this);
        this.healthText.anchor.set(1, 1);
        this.add(this.healthText);
    }
    
    initializeCannons(numberOfCannons:number, cannonPos1:Phaser.Point, cannonDir1:Phaser.Point)
    {
        var cannons:CannonObject[];
        if(numberOfCannons == 0)
        {
            cannons = [];
        }
        else
        {
           cannons = [new CannonObject(this.game, cannonPos1.x, cannonPos1.y, cannonDir1)]; 
        }
       
        return cannons;
    }
    
    // chaser(playerPosition:Phaser.Point)
    // {
    //     var enemyDirection:Phaser.Point = new Phaser.Point(0,0);
        
    //     if((this.getTilePosition().x < playerPosition.x)
    //     && (this.getTilePosition().y < playerPosition.y))
    //     {
    //         var difX = playerPosition.x - this.getTilePosition().x;
    //         var difY = playerPosition.y - this.getTilePosition().y;
            
    //         console.log("difX: " + difX);
    //         console.log("difY: " + difX);
            
    //         if(difX >= difY)
    //         {
    //             //this.x += Global.TILE_SIZE * this.enemySpeed;
    //             enemyDirection = new Phaser.Point(1,0);
    //         }
    //         else
    //         {
    //             //this.y += Global.TILE_SIZE * this.enemySpeed;
    //             enemyDirection = new Phaser.Point(0,1);
    //         }
    //     }
        
    //     if((this.getTilePosition().x < playerPosition.x)
    //     && (this.getTilePosition().y > playerPosition.y))
    //     {
    //         var difX = playerPosition.x - this.getTilePosition().x;
    //         var difY = this.getTilePosition().y - playerPosition.y;
            
    //         console.log("difX: " + difX);
    //         console.log("difY: " + difX);
            
    //         if(difX >= difY)
    //         {
    //             //this.x += Global.TILE_SIZE * this.enemySpeed;
    //             enemyDirection = new Phaser.Point(1,0);
    //         }
    //         else
    //         {
    //             //this.y -= Global.TILE_SIZE * this.enemySpeed;
    //             enemyDirection = new Phaser.Point(0,-1);
    //         }
    //     }
        
    //     if((this.getTilePosition().x > playerPosition.x)
    //     && (this.getTilePosition().y < playerPosition.y))
    //     {
    //         var difX = this.getTilePosition().x - playerPosition.x;
    //         var difY = playerPosition.y - this.getTilePosition().y;
            
    //         console.log("difX: " + difX);
    //         console.log("difY: " + difX);
            
    //         if(difX >= difY)
    //         {
    //             //this.x -= Global.TILE_SIZE * this.enemySpeed;
    //             enemyDirection = new Phaser.Point(-1,0);
    //         }
    //         else
    //         {
    //             //this.y += Global.TILE_SIZE * this.enemySpeed;
    //             enemyDirection = new Phaser.Point(0,1);
    //         }
    //     }
        
    //     if((this.getTilePosition().x > playerPosition.x)
    //     && (this.getTilePosition().y > playerPosition.y))
    //     {
    //         var difX = playerPosition.x - this.getTilePosition().x;
    //         var difY = playerPosition.y - this.getTilePosition().y;
            
    //         console.log("difX: " + difX);
    //         console.log("difY: " + difX);
            
    //         if(difX >= difY)
    //         {
    //             //this.x -= Global.TILE_SIZE * this.enemySpeed;
    //             enemyDirection = new Phaser.Point(-1,0);
    //         }
    //         else
    //         {
    //             //this.y -= Global.TILE_SIZE * this.enemySpeed;
    //             enemyDirection = new Phaser.Point(0,-1);
    //         }
    //     }
        
    //     if(this.getTilePosition().x == playerPosition.x
    //     && this.getTilePosition().y > playerPosition.y)
    //     {
    //         enemyDirection = new Phaser.Point(0,-1);
    //     }
        
    //     if(this.getTilePosition().x == playerPosition.x
    //     && this.getTilePosition().y < playerPosition.y)
    //     {
    //         enemyDirection = new Phaser.Point(0,1);
    //     }
        
    //     if(this.getTilePosition().x > playerPosition.x
    //     && this.getTilePosition().y == playerPosition.y)
    //     {
    //         enemyDirection = new Phaser.Point(-1,0);
    //     }
        
    //     if(this.getTilePosition().x < playerPosition.x
    //     && this.getTilePosition().y == playerPosition.y)
    //     {
    //         enemyDirection = new Phaser.Point(1,0);
    //     }
        
    //     return enemyDirection;
    // }
    
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
    
    // moveAndKeepDirection(playerPosition:Phaser.Point, tileMatrix:TileTypeEnum[][])
    // {
    //     if(this.keepDirection % this.factorDirectionChange == 0)
    //     {
    //         this.enemyDirection = this.pickDirection();
    //     }
    //     this.keepDirection++;
        
    //     if(!this.updateEnemy(this.enemyDirection, tileMatrix))
    //     {
    //         var newDir = this.getFirstFreeDirection(this.enemyDirection, tileMatrix);//this.pickDirectionWithThisConstraint(this.findDirectionIndex(this.enemyDirection));
    //         this.updateEnemy(newDir, tileMatrix);
    //         this.goEnemy(newDir, tileMatrix);
    //     }else{
    //         this.goEnemy(this.enemyDirection, tileMatrix);
    //     }
    // }
    goEnemy(enemyDirection:Phaser.Point, tileMap:TileTypeEnum[][])
    {   
        if (enemyDirection.x > 0)
        {
            if(tileMap[this.getTilePosition().x + 1][this.getTilePosition().y] == TileTypeEnum.Passable)
            {
                this.x += Global.TILE_SIZE * this.enemySpeed;
                if(this.cannons.length > 0)
                {
                    this.cannons[0].x = this.x/32;
                }
            }   
        }
        
        if(enemyDirection.x < 0)
        {
            if(tileMap[this.getTilePosition().x - 1][this.getTilePosition().y] == TileTypeEnum.Passable)
            {
               this.x -= Global.TILE_SIZE * this.enemySpeed;
                if(this.cannons.length > 0)
                {
                    this.cannons[0].x = this.x/32;
                }
            }   
        }
        
        if(enemyDirection.y > 0)
        {
            if(tileMap[this.getTilePosition().x][this.getTilePosition().y + 1] == TileTypeEnum.Passable)
            {
                this.y += Global.TILE_SIZE * this.enemySpeed;
                 if(this.cannons.length > 0)
                {
                    this.cannons[0].x = this.x/32;
                }
            }
        }
        
        if(enemyDirection.y < 0)
        {
            if(tileMap[this.getTilePosition().x][this.getTilePosition().y - 1] == TileTypeEnum.Passable)
            {
                this.y -= Global.TILE_SIZE * this.enemySpeed;
                 if(this.cannons.length > 0)
                {
                    this.cannons[0].x = this.x/32;
                }
            }
        }
    }
    
    reverseDirection(dir:Phaser.Point)
    {
        dir.x = dir.x * (-1);
        dir.y = dir.y * (-1);
        return dir;
    }
    
    revertAxis(direction:Phaser.Point)
    {
        if(direction.x != 0)
        {
            return new Phaser.Point(0,1);
        }
        
        if(direction.y != 0)
        {
            return new Phaser.Point(1,0);
        }
    }
    
    // moveBackAndForth(playerPosition:Phaser.Point, tileMatrix:TileTypeEnum[][])
    // {
    //     if(!this.updateEnemy(this.enemyDirection, tileMatrix) && 
    //         !this.updateEnemy(this.reverseDirection(this.enemyDirection), tileMatrix))
    //     {
    //             this.enemyDirection = this.revertAxis(this.enemyDirection);
    //     }
        
    //     if(!this.updateEnemy(this.enemyDirection, tileMatrix))
    //     {
    //         this.goEnemy(this.reverseDirection(this.enemyDirection), tileMatrix);
    //     }else{
    //         this.goEnemy(this.enemyDirection, tileMatrix);
    //     }
    // }
    
    moveEnemy(playerPosition:Phaser.Point, tileMatrix:TileTypeEnum[][])
    {
        console.log("HiHIHIHI!");
        var enemyDirection = this.pickDirection();
        if(!this.updateEnemy(enemyDirection, tileMatrix))
        {
            var newDir = this.pickDirectionWithThisConstraint(this.findDirectionIndex(enemyDirection));
            this.updateEnemy(newDir, tileMatrix);
        }
    }
    
    enemyShot(playerPosition:Phaser.Point, tileMap:TileTypeEnum[][])
    {
        if (typeof this.cannons == 'undefined')
        {
            return false;
        }
        if(this.cannons.length == 1)
        {
            return this.cannons[0].shoot(playerPosition, this, tileMap);
        }
    }
    
    updateEnemy(enemyDirection:Phaser.Point, tileMap:TileTypeEnum[][])
    {   
        let canMove:boolean = false;
        
        if (enemyDirection.x > 0)
        {
            
            if((this.getTilePosition().x + this.enemySpeed) < 10  &&
                tileMap[this.getTilePosition().x + this.enemySpeed][this.getTilePosition().y] == TileTypeEnum.Passable)
            {
                //this.x += Global.TILE_SIZE * this.enemySpeed;
                canMove = true;
            }   
        }
        
        if(enemyDirection.x < 0)
        {
            if((this.getTilePosition().x - this.enemySpeed) > 0 &&
                tileMap[this.getTilePosition().x - this.enemySpeed][this.getTilePosition().y] == TileTypeEnum.Passable)
            {
                //this.x -= Global.TILE_SIZE * this.enemySpeed;
                canMove = true;
            }   
        }
        
        if(enemyDirection.y > 0)
        {
            if((this.getTilePosition().y + this.enemySpeed) < 10 &&
                tileMap[this.getTilePosition().x][this.getTilePosition().y + this.enemySpeed] == TileTypeEnum.Passable)
            {
                //this.y += Global.TILE_SIZE * this.enemySpeed;
                canMove = true;
            }
        }
        
        if(enemyDirection.y < 0)
        {
            if((this.getTilePosition().y - this.enemySpeed) > 0 &&
                tileMap[this.getTilePosition().x][this.getTilePosition().y - this.enemySpeed] == TileTypeEnum.Passable)
            {
                //this.y -= Global.TILE_SIZE * this.enemySpeed;
                canMove = true;
            }
        }
        
        return canMove;
    }
    
    enemyMove(enemyDirection:Phaser.Point, tileMatrix:TileTypeEnum[][])
    {   
        console.log("stay");
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
    
    selectParameters(selector:number)
    {
        var value:number;
        if(selector == -4)
        {
            var prob = Math.random();
            if(prob >= 0.2)
            {
               value = 1;
            }
            else if(prob > 0.1 && prob < 0.2)
            {
                value = 2;
            }
            else
            {
                value = 3;
            }
        }
        
        if(selector == -3)
        {
            var prob = Math.random();
            if(prob >= 0.3)
            {
                value = 1;
            }
            else if(prob > 0.1 && prob < 0.3)
            {
                value = 2;
            }
            else
            {
                value = 3;
            }
        }
        
        if(selector == -2)
        {
            var prob = Math.random();
            if(prob >= 0.5)
            {
                value = 1;
            }
            else if(prob > 0.2 && prob < 0.3)
            {
                value = 2;
            }
            else
            {
                value = 3;
            }
        }
        
        if(selector == -1)
        {
            var prob = Math.random();
            if(prob >= 0.6)
            {
                value = 1;
            }
            else if(prob > 0.2 && prob < 0.6)
            {
                value = 2;
            }
            else
            {
                value = 3;
            }
        }
        
        if(selector == 0)
        {
            var prob = Math.random();
            if(prob >= 0.7)
            {
                value = 1;
            }
            else if(prob > 0.4 && prob < 0.7)
            {
                value = 2;
            }
            else
            {
                value = 3;
            }
        }
        
        if(selector == 1)
        {
            var prob = Math.random();
            if(prob >= 0.8)
            {
                value = 1;
            }
            else if(prob > 0.3 && prob < 0.5)
            {
                value = 2;
            }
            else
            {
                value = 3;
            }
        } 
        
        if(selector == 2)
        {
            var prob = Math.random();
            if(prob >= 0.9)
            {
                value = 1;
            }
            else if(prob > 0.3 && prob < 0.9)
            {
                value = 2;
            }
            else
            {
                value = 3;
            }
        }
        
        if(selector == 3)
        {
            var prob = Math.random();
            if(prob >= 0.9)
            {
                value = 1;
            }
            else if(prob > 0.3 && prob < 0.6)
            {
                value = 2;
            }
            else
            {
                value = 3;
            }
        }     
        
        if(selector == 4)
        {
            var prob = Math.random();
            if(prob >= 0.8)
            {
                value = 1;
            }
            else if(prob > 0.7 && prob < 0.8)
            {
                value = 2;
            }
            else
            {
                value = 3;
            }
        }
        return value;
    }
    
    getFirstFreeDirection(enemyDirection:Phaser.Point, tileMap:TileTypeEnum[][])
    {
        var dir:Phaser.Point = new Phaser.Point(0,0);
        for(var i:number = 1; i < this.directions.length; i++)
        {
            if(this.updateEnemy(this.directions[i], tileMap) == true)
            {
                dir = this.directions[i];
            }
        }
        return dir;
    }
    
    getNearDirectionToPlayer(enemyDir:Phaser.Point, playerPosition, tileMap:TileTypeEnum[][])
    {
        var dir:Phaser.Point = new Phaser.Point(0,0);
        var dist = 9999;
        var directionsRedux:Phaser.Point[] = []
        if(enemyDir.x == 1)
        {
            directionsRedux.push(new Phaser.Point(0,1));
            directionsRedux.push(new Phaser.Point(0,-1));
            directionsRedux.push(new Phaser.Point(-1,0));
        }
        if(enemyDir.x == -1)
        {
            directionsRedux.push(new Phaser.Point(0,1));
            directionsRedux.push(new Phaser.Point(0,-1));
            directionsRedux.push(new Phaser.Point(1,0));
             directionsRedux.push(new Phaser.Point(0,0));
        }
        if(enemyDir.y == 1)
        {
            directionsRedux.push(new Phaser.Point(1,0));
            directionsRedux.push(new Phaser.Point(-1,0));
            directionsRedux.push(new Phaser.Point(0,-1));
             directionsRedux.push(new Phaser.Point(0,0));
        }
        if(enemyDir.y == -1)
        {
            directionsRedux.push(new Phaser.Point(1,0));
            directionsRedux.push(new Phaser.Point(-1,0));
            directionsRedux.push(new Phaser.Point(0,1));
             directionsRedux.push(new Phaser.Point(0,0));
        }
        
        for(var i:number = 0; i < directionsRedux.length; i++)
        {
            if(this.updateEnemy(directionsRedux[i], tileMap) == true)
            {
                var distX = Math.abs(playerPosition.x - (this.getTilePosition().x + directionsRedux[i].x));
                var distY = Math.abs(playerPosition.y - (this.getTilePosition().y + directionsRedux[i].y));
                var newdist = Math.sqrt((distX * distX) + (distY * distY));
                console.log("newdist : " + newdist);
                if(newdist < dist)
                {
                    dist = newdist;
                    dir = directionsRedux[i];
                }
            }
        }
        return dir;
    }
    
    update(){
        super.update();
        
        this.healthText.text = this.enemyHealth.toString();
        this.healthText.anchor.set(1, 1);
        this.healthText.alpha = 1;
        if(this.enemyHealth < 1){
            this.healthText.alpha = 0;
        }
    }
    
}