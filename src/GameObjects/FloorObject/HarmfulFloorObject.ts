class HarmfulFloorObject extends BaseGameObject{
    sprite:Phaser.Sprite;
    timeText:Phaser.Text;
    damage:number;
    time:number;
    exp:boolean;
    isAlive:boolean;
    
    constructor(game:Phaser.Game, xTile:number, yTile:number, damage:number, time:number){
        super(game, xTile * Global.TILE_SIZE, yTile * Global.TILE_SIZE);
        
        this.damage = damage;
        this.time = time;
        this.isAlive = true;
        
        this.sprite = this.game.add.sprite(0, 0, "graphics");
        this.sprite.animations.add("normal", [32]);
        this.sprite.animations.play("normal");
        this.sprite.tint = 0xcc6668;
        this.add(this.sprite);
        
        var style = { font: "10px pixelFont", fill: "#cc6668", align: "right" };
        this.timeText = this.game.add.text(Global.TILE_SIZE - 3, Global.TILE_SIZE + 2, 
            this.time.toString(), style, this);
        this.timeText.anchor.set(1, 1);
        this.add(this.timeText);
    }
    
    killObject(){
        this.game.add.existing(new DeathEffect(this.game, this.getTilePosition().x, 
            this.getTilePosition().y, 32, 0xcc6668));
        super.killObject();
    }
    
    explode(){
        var explosionDmg: number[][] = [];
        for (var y = 0; y < Global.ROOM_HEIGHT; y++) {
            explosionDmg.push([]);
            for (var x = 0; x < Global.ROOM_WIDTH; x++) {
                explosionDmg[y].push(0);
            }
        }

        var location: Phaser.Point = this.getTilePosition();
        for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
                if (location.x + x >= 0 && location.y + y >= 0 &&
                    location.x + x < Global.ROOM_WIDTH && location.y + y < Global.ROOM_HEIGHT) {
                    explosionDmg[location.y + y][location.x + x] = 3;
                }
            }
        }
        return explosionDmg;
    }
    
    updateStep(){
        if(this.time == 0){
            this.isAlive = false;
            return;
        }
        this.timeText.text = this.time.toString();
        this.timeText.anchor.set(1, 1);
        this.time -= 1;
    }
    
    update(){
        super.update();
    }
}