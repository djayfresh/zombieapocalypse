import { GameObject, AssetType } from "./renderer/game-object";
import { Weapon } from "./weapons/gun";

export class Player extends GameObject {
    asset: PIXI.Graphics;
    gun: Weapon;

    constructor() {
        super(0, new PIXI.Graphics, AssetType.Player);
    }

    update(dt) {
        if(this.gun){
            this.gun.fire(dt);
        }
    }

    setGun(gun: Weapon){
        this.gun = gun;
    }
}

