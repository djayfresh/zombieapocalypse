import { GameObject, AssetType } from "../renderer/game-object";

export class Weapon {
    private shots: number;
    private lastShot: number = 0;

    constructor(protected fireRate: number, public damage: number, public fired: Function, protected ammo = -1, public speed: number = 2) {

    }

    update(dt){
        this.lastShot += dt;
    }

    fire() {
        if(this.lastShot > this.fireRate && (this.shots < this.ammo || this.ammo == -1)){
            this.fired();
            this.shots++;
            this.lastShot = 0;
        }
    }

    reload() {
        this.shots = 0;
    }
}

export var Pistol = new Weapon(10, 1, undefined, -1);
export var Lazer = new Weapon(1, 1, undefined, -1);


export class Bullet extends GameObject {
    asset: PIXI.Graphics;

    constructor() {
        super(0, new PIXI.Graphics(), AssetType.Bullet, 300);

        this.asset.beginFill(0x66CCFF);
        this.asset.drawRect(0, 0, 5, 5);
        this.asset.endFill();
    }
}