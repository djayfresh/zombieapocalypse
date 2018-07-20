import { GameObject, AssetType, Container } from "../renderer/game-object";

export interface Level {
    walls: Container;
    
    onWin: () => void;
    onLose: () => void;
    onPause: () => void;
    
    setup(): void;
    update(dt): void;

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