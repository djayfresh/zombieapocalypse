import { Vector2 } from "../../utility/vector";

export class GameObject {
    id: number;
    asset: PIXI.DisplayObject;
    assetType: AssetType;
    destoryed: boolean;
    lifespan: number;
    timeAlive: number = 0;
    velocity: Vector2;

    constructor(id: number, asset, assetType, lifespan = -1){
        this.id = id;
        this.asset = asset;
        this.assetType = assetType;
        this.lifespan = lifespan;
        this.velocity = new Vector2(0, 0);
    }

    setPosition(x, y){
        this.asset.x = x;
        this.asset.y = y;
    };

    getPosition(): Vector2{
        return new Vector2(this.asset.x, this.asset.y);
    }

    setVelocity(vx, vy){
        this.velocity.x = vx;
        this.velocity.y = vy;
    };

    update(dt){
        this.asset.x += this.velocity.x * dt;
        this.asset.y += this.velocity.y * dt;
        this.timeAlive += dt;
    };

    shouldDestory() {
        return (this.timeAlive > this.lifespan && this.lifespan !== -1) || this.destoryed;
    }
}

export class Container extends GameObject {
    asset: PIXI.Container;
    children: GameObject[] = [];

    constructor(assetType: AssetType, lifespan = -1){
        super(0, new PIXI.Container(), assetType, lifespan);
    }

    add(gameObject: GameObject){
        this.children.push(gameObject);

        this.asset.addChild(gameObject.asset);
    }
}

export enum AssetType {
    Player = 0,
    Enemy = 1,
    Bullet = 2,
    Wall = 3,
    Container = 4,
    Spawner = 5
}