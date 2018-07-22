import { GameObject, AssetType } from "../renderer/game-object";
import { Vector2 } from "../../utility/vector";

export class Enemy extends GameObject {
    asset: PIXI.Graphics;

    constructor(public runSpeed: number) {
        super(0, new PIXI.Graphics, AssetType.Enemy, 4000);

        this.asset.beginFill(0x770000);
        this.asset.drawRect(0, 0, 20, 20);
        this.asset.endFill();
    }

    setVelocity(x, y){
        this.velocity.x = x * this.runSpeed;
        this.velocity.y = y * this.runSpeed;
    }
}