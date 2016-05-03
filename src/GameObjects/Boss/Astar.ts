/// <reference path="ANode.ts"/>

class Astar {

    createChild(cur: ANode, playerPosition: Phaser.Point, map: TileTypeEnum[][], sumX: number, sumY: number): ANode {
        var child: ANode = new ANode();
        child.setEverything(cur, cur.x + sumX, cur.y + sumY, cur.g + 1, 0);
        child.h = Math.sqrt(Math.pow(playerPosition.x - child.x, 2) + Math.pow(playerPosition.y - child.y, 2))
        child.xdir = sumX;
        child.ydir = sumY;
        return child;
    }

    dist(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    search(boss: Boss, playerPosition: Phaser.Point, map: TileTypeEnum[][]): Phaser.Point {
        var open: ANode[] = [];
        var closed: ANode[] = [];

        var bossPosition: Phaser.Point = new Phaser.Point(boss.tilePosition.x, boss.tilePosition.y);

        var initial: ANode = new ANode();
        initial.x = bossPosition.x;
        initial.y = bossPosition.y;
        var minDist: number = this.dist(initial.x, initial.y, playerPosition.x, playerPosition.y);
        //find closest point to player
        var aux: number = 0;
        for (var i: number = boss.tilePosition.x; i < boss.tilePosition.x + boss.bossWidth; i++) {
            for (var j: number = boss.tilePosition.y; j < boss.tilePosition.y + boss.bossHeight; j++) {
                aux = this.dist(i, j, playerPosition.x, playerPosition.y);
                if (minDist > aux) {
                    minDist = aux;
                    initial.x = i;
                    initial.y = j;
                }
            }
        }


        initial.xdir = 0;
        initial.ydir = 0;
        initial.parent = null;
        initial.g = 0;
        initial.h = Math.sqrt(Math.pow(playerPosition.x - bossPosition.x, 2) + Math.pow(playerPosition.y - bossPosition.y, 2));
        open.push(initial);
        var cur: ANode = null;

        var dir: Phaser.Point[] = [
            new Phaser.Point(1, 0),
            new Phaser.Point(0, 1),
            new Phaser.Point(-1, 0),
            new Phaser.Point(0, -1)];
        while (open.length > 0) {
            open.sort(function (a: ANode, b: ANode) { return (a.f() - b.f()) * (-1); });
            cur = open.pop();

            if (cur.x == playerPosition.x && cur.y == playerPosition.y)
                break;

            for (var i: number = 0; i < dir.length; i++) {
                //if (map[cur.x + dir[i].x][cur.y + dir[i].y] != TileTypeEnum.Wall &&
               //     map[cur.x + dir[i].x][cur.y + dir[i].y] != TileTypeEnum.Enemy) {
                if (this.colideEnemy(new Phaser.Point(cur.x + dir[i].x, cur.y + dir[i].y),boss,map)) {
                    var child: ANode = this.createChild(cur, playerPosition, map, dir[i].x, dir[i].y);

                    if (!this.appearInList(open, child) && !this.appearInList(closed, child))
                        open.push(child);
                }
            }

            closed.push(cur);
        }

        if (this.colide(cur,boss,playerPosition,map)) {
            var s: string = "";
            for (var i: number = 0; i < map.length; i++) {
                for (var j: number = 0; j < map[0].length; j++) {
                    if (i == playerPosition.x && j == playerPosition.y)
                        s += "P";
                    else if (i >= cur.x && i <= cur.x + boss.bossWidth && j >= cur.y && j <= cur.y + boss.bossHeight)
                        s += "B";
                    else
                        s += map[j][i];
                }
                s += "\n";
            }
            console.log(s);
            console.log("1 "+cur.x + " " + cur.y + " "+cur.parent+" init"+ initial.x+" "+initial.y);
            while (cur.parent != null && cur.parent.parent != null && cur.parent.x != initial.x && cur.parent.y != initial.y) {
                cur = cur.parent;
                console.log("2 "+cur.x + " " + cur.y);
            }
            console.log("returning " + cur.xdir + " " + cur.ydir +" "+boss.tilePosition.x+" "+boss.tilePosition.y);
            return new Phaser.Point(cur.xdir, cur.ydir);
        } else {
            return new Phaser.Point(0,0);
        }
    }

    colideEnemy(pos: Phaser.Point, boss: Boss, map: TileTypeEnum[][]): boolean {
        for (var i: number = pos.x; i <= pos.x + boss.width; i++) {
            for (var j: number = pos.y; j <= pos.y + boss.height; j++) {
                if (map[i][j] == TileTypeEnum.Enemy || map[i][j] == TileTypeEnum.Wall)
                    return true;
            }
        }

        return false;
    }

    colide(cur: ANode, boss: Boss, player: Phaser.Point, map: TileTypeEnum[][]): boolean {
        for (var i: number = cur.x; i <= cur.x + boss.width; i++) {
            for (var j: number = cur.y; j <= cur.y + boss.height; j++) {
                if ((player.x == i && player.y == j))
                    return true;
            }
        }

        return false;
    }

    appearInList(list: ANode[], child: ANode): boolean {
        var has: boolean = false;
        for (var i: number = 0; i < list.length; i++) {
            if (list[i].x == child.x && list[i].y == child.y && list[i].f() < child.f()) {
                has = true;
                break;
            }
        }
        return has;
    }
}