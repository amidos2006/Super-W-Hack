class RoomInfoObject{
    seed:number;
    cleared:boolean;
    difficulty:DifficultyEnum;
    constructor(seed:number, cleared:boolean, difficulty:DifficultyEnum){
        this.seed = seed;
        this.cleared = cleared;
        this.difficulty = difficulty;
    }
}