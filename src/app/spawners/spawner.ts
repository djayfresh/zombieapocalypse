import { GameObject, AssetType } from "../renderer/game-object";
import { Enemy } from "../characters/enemy";
import { Renderer } from "../renderer/renderer";
import { Vector2 } from "../../utility/vector";

export class Spawner {
    private lastSpawn: number = 0;
    private spawnCount: number = 0;
    private spawns: GameObject[] = [];
    
    spawnerObject: GameObject;

    constructor(private path: Vector2[], protected spawnRate: number, protected maxSpawns: number, protected target: GameObject) {

        var spawner = new PIXI.Graphics();
        spawner.beginFill(0x0000FF);
        spawner.drawCircle(this.path[0].x, this.path[0].y, 15);
        spawner.endFill();

        this.spawnerObject = new GameObject(0, spawner, AssetType.Spawner);
    }

    update(dt) {
        this.lastSpawn += dt;

        if(this.lastSpawn > this.spawnRate && this.spawnCount < this.maxSpawns){
            this.lastSpawn = 0;
            this.spawn();
        }
    }

    protected spawn() {
        var enemy = new Enemy(Math.random() + 1);
        console.log("Spawn enemy", enemy);

        enemy.setPosition(this.path[0].x, this.path[0].y);

        var dir = Vector2.subtract(this.target.getPosition(), enemy.getPosition()).unitVector();
        enemy.setVelocity(dir.x, dir.y);

        Renderer.add(enemy);
        this.spawns.push(enemy);
    }
}