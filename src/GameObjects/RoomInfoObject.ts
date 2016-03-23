class RoomInfoObject{
    seed:number;
    cleared:boolean;
    difficulty:DifficultyEnum;
    connections:number;
    
    constructor(seed:number, difficulty:DifficultyEnum){
        this.seed = seed;
        this.difficulty = difficulty;
        this.cleared = false;
        this.connections = 0;
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
    }
    
    checkDoor(direction:Phaser.Point):boolean{
        if(direction.x < 0){
            return (this.connections & 0x1) > 0;
        }
        if(direction.x > 0){
            return (this.connections & 0x2) > 0;
        }
        if(direction.y < 0){
            return (this.connections & 0x4) > 0;
        }
        if(direction.y > 0){
            return (this.connections & 0x8) > 0;
        }
        
        return false;
    }
}