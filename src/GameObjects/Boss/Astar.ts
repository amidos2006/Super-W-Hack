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

    search(boss: Boss, playerPosition: Phaser.Point, map: TileTypeEnum[][]): Phaser.Point {
        var open: ANode[] = [];
        var closed: ANode[] = [];

        var bossPosition: Phaser.Point = new Phaser.Point(boss.tilePosition.x, boss.tilePosition.y);

        var initial: ANode = new ANode();
        initial.x = bossPosition.x;
        initial.y = bossPosition.y;
        initial.parent = null;
        initial.g = 0;
        initial.h = Math.sqrt(Math.pow(playerPosition.x - bossPosition.x, 2) + Math.pow(playerPosition.y - bossPosition.y, 2));
        open.push(initial);
        var cur: ANode = null;

        var dir: Phaser.Point[] = [new Phaser.Point(1, 0), new Phaser.Point(0, 1), new Phaser.Point(-1, 0), new Phaser.Point(0, -1)];
        while (open.length > 0) {
            open.sort(function (a: ANode, b: ANode) { return (a.f() - b.f()) * (-1); });
            cur = open.pop();

            if (cur.x == playerPosition.x && cur.y == playerPosition.y)
                break;

            for (var i: number = 0; i < dir.length; i++) {
                if (map[cur.x + dir[i].x][cur.y + dir[i].y] != TileTypeEnum.Wall &&
                    map[cur.x + dir[i].x][cur.y + dir[i].y] != TileTypeEnum.Enemy) {
                    var child: ANode = this.createChild(cur, playerPosition, map, dir[i].x, dir[i].y);

                    if (!this.appearInList(open, child) && !this.appearInList(closed, child))
                        open.push(child);
                }
            }

            closed.push(cur);
        }

        if (cur.x == playerPosition.x && cur.y == playerPosition.y) {
            var s: string = "";
            for (var i: number = 0; i < map.length; i++) {
                for (var j: number = 0; j < map[0].length; j++) {
                    s += map[j][i];
                }
                s += "\n";
            }
            console.log(s);
            console.log(cur.x + " " + cur.y);
            while (cur.parent != null && cur.parent.x != initial.x && cur.parent.y != initial.y) {
                cur = cur.parent;
                console.log(cur.x + " " + cur.y);
            }
            return new Phaser.Point(cur.xdir, cur.ydir);
        } else {
            return null;
        }
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