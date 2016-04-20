class ANode {
    parent: ANode;
    x: number;
    y: number;
    //cost
    g: number;
    //heuristic
    h: number;

    xdir: number;
    ydir: number;

    constructor() {
    }

    setEverything(parent: ANode, x: number, y: number, g: number, h: number) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.g = g;
        this.h = h;
    }

    f(): number {
        return this.h + this.g;
    }
}