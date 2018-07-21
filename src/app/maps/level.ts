import { GameObject, AssetType, Container } from "../renderer/game-object";
import { CollisionLocation } from "../../utility/collision-detection";

export interface Level {
    walls: Container;
    
    onWin: () => void;
    onLose: () => void;
    onPause: () => void;
    
    setup(): void;
    update(dt): void;

    checkCollision(g1: GameObject, g2: GameObject): boolean;
    onCollision(g1: GameObject, g2: GameObject, loc: CollisionLocation): void;
}

export class Wall extends GameObject {
    static color: number = 0xFFFFFF;
    asset: PIXI.Graphics;

    constructor(x: number, y: number, w: number, h: number) {
        super(0, new PIXI.Graphics(), AssetType.Wall);

        this.asset.beginFill(Wall.color);
        this.asset.drawRect(0, 0, w, h);
        this.asset.endFill();

        this.asset.x = x;
        this.asset.y = y;

        console.log("Walls", this.asset);
    }
}