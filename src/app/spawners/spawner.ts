import { GameObject, AssetType } from "../renderer/game-object";
import { Enemy } from "../characters/enemy";
import { Renderer } from "../renderer/renderer";
import { Vector2 } from "../../utility/vector";

export class Spawner extends GameObject {
    private lastSpawn: number = 0;
    private spawnCount: number = 0;
    private spawns: GameObject[] = [];
    asset: PIXI.Graphics;

    constructor(private path: Vector2[], protected spawnRate: number, protected maxSpawns: number, protected target: GameObject) {
        super(0, undefined, AssetType.Spawner);

        this.asset = new PIXI.Graphics();
        this.asset.beginFill(0x0000FF);
        this.asset.drawCircle(this.path[0].x, this.path[0].y, 25);
        this.asset.endFill();
    }

    update(dt) {
        this.lastSpawn += dt;

        if(this.lastSpawn > this.spawnRate && this.spawnCount < this.maxSpawns){
            this.lastSpawn = 0;
            this.spawn();
        }

        this.spawns.forEach((enemy) => {
            var dir = Vector2.subtract(this.target.getPosition(), enemy.getPosition()).unitVector();
            enemy.setVelocity(dir.x, dir.y);
        });
    }

    protected spawn() {
        var enemy = new Enemy(Math.random() + 0.25);
        console.log("Spawn enemy", enemy);

        enemy.setPosition(this.path[0].x, this.path[0].y);

        var dir = Vector2.subtract(this.target.getPosition(), enemy.getPosition()).unitVector();
        enemy.setVelocity(dir.x, dir.y);

        this.asset.addChild(enemy.asset);

        Renderer.add(enemy, false);
        this.spawns.push(enemy);
    }
}