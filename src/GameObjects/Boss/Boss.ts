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

enum BossMovementType {
    RANDOM, CHASE, SPAWN, SHOOT, TELEPORT, JUMP, DAMAGE_FLOOR, HEAL, STUN, ROTATE
}

class Boss extends BaseGameObject {

    static BOSS_MOVEMENTS: BossMovementType[] =
    [BossMovementType.RANDOM, BossMovementType.CHASE, BossMovementType.SPAWN, BossMovementType.SHOOT,
        BossMovementType.TELEPORT, BossMovementType.JUMP, BossMovementType.DAMAGE_FLOOR, BossMovementType.HEAL,
        BossMovementType.STUN, BossMovementType.ROTATE];

    movements: BossMovementType[] = null;
    curMovementType: number = -1;
    stepsSinceLastMoveChange: number = 0;
    stepsToChangeMove: number = 0;

    health: number = 0;
    damage: number = 0;

    attackCooldown: number = 0;
    movementCooldown: number = 0;
    movementSpeed: number = 0;
    dashSpeed: number = 0;

    spawnEnemy: EnemyTypeEnum = EnemyTypeEnum.Random;

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game,x,y);
    }

    stepUpdate(playerPosition: Phaser.Point, map: TileTypeEnum[][], random: Phaser.RandomDataGenerator) {

    }
}