
export class Weapon {
    private shots: number;
    private lastShot: number = 0;

    constructor(protected fireRate: number, public damage: number, protected fired: Function, protected ammo = -1) {

    }

    fire(dt) {
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

