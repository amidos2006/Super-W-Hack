class TrailObject extends BaseGameObject
{
    constructor(game:Phaser.Game, x:number, y:number)
    {
        super(game, x, y);
    }
    
    printTrail()
    {
        console.log("trail : " + this.getTilePosition().x + " " + this.getTilePosition().y);
    }
}