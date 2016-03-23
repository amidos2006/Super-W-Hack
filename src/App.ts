class SimpleGame {
    
    game: Phaser.Game;
    cursors:Phaser.CursorKeys;
    player:PlayerElement;
    enemy:RandomEnemy;
    enemyDir:number;
    
    constructor() 
    {
        this.game = new Phaser.Game(Global.TILE_SIZE*21, Global.TILE_SIZE*11, Phaser.AUTO,
             'content', {preload: this.preload, create: this.create, update: this.update})
        this.enemyDir = 0;
    }
    
    preload()
    {
        this.game.load.image('cowboy', 'assets/cowboy.png');
        this.game.load.image('enemy', 'assets/enemy.jpg');
    }

    create() 
    {
        var text = "Could you see something?";
        var style = { font: "65px Arial", fill: "#0000FF", align: "center" };
        this.game.add.text(0, 0, text, style);
        this.player = new PlayerElement(this.game, 0, 0);
        this.enemy = new RandomEnemy(this.game, 144, 144);
        this.cursors = this.game.input.keyboard.createCursorKeys();
    }
    
    update()
    {
       if(this.player.move(this.cursors))
       {
           this.enemy.randomMove();
       }
    }

}



window.onload = () => {
    var game:SimpleGame = new SimpleGame();
};