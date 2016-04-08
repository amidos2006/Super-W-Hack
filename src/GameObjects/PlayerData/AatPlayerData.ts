/// <reference path="BasePlayerData.ts"/>

class AatPlayerData extends BasePlayerData{
    constructor(text:string){
        super(text, 0, 3, new ChangeWeaponSpecial());
    }
}