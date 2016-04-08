/// <reference path="BasePlayerData.ts"/>

class GatPlayerData extends BasePlayerData{
    constructor(text:string){
        super(text, 4, 11, new AllScreenSpecial());
    }
}