/// <reference path="BasePlayerData.ts"/>

class TatPlayerData extends BasePlayerData{
    constructor(text:string){
        super(text, 8, 10, new TeleportSpecial());
    }
}