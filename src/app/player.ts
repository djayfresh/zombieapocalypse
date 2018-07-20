import { GameObject, AssetType } from "./renderer/game-object";
import { Weapon } from "./weapons/gun";

export class Player extends GameObject {
    asset: PIXI.Graphics;
    gun: Weapon;

    constructor() {
        super(0, new PIXI.Graphics, AssetType.Player);

        this.asset.beginFill(0x550033);
        this.asset.drawRect(0, 0, 20, 20);
        this.asset.endFill();
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

