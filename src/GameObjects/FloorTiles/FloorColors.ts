class FloorColors{
    static getWallColors(category:number){
        var tint:number = 0x664729;
        switch (category) {
            case 0:
                tint = 0x664729;
                break;
            case 1:
                tint = 0x808080;
                break;
            case 2:
                tint = 0x3d2966;
                break;
            case 3:
                tint = 0xb3b336;
                break;
            case 4:
                tint = 0x294766;
                break;
            case 5:
                tint = 0x3b6629;
                break;
            default:
                tint = 0x664729;
                break;
        }
        return tint;
    }
}