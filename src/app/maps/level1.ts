import { Level, Wall } from './level';
import { Container, AssetType, GameObject } from '../renderer/game-object';
import { Keyboard } from '../../utility/keyboard';
import { CollisionLocation } from '../../utility/collision-detection';
import { Game } from '../main';
import { Spawner } from '../spawners/spawner';
import { Vector2 } from '../../utility/vector';

export class Level1 implements Level {
    spawners: Spawner[];
    levelContainer: Container;

    onWin: () => void;
    onLose: () => void;
    onPause: () => void;

    left: Keyboard; right: Keyboard; up: Keyboard; down: Keyboard;

    constructor(){
        this.setup();
    }

    setup(): void {
        var spawnerLocations = [
            new Vector2(100, 100),
            new Vector2(900, 100)
        ];

        this.spawners = [];
        spawnerLocations.forEach((path) => {
            this.spawners.push(new Spawner([path], 2000, 20, Game.player));
        });

        //Initial setup
        var walls = [
            //border
            new Wall(0, -50, 1500, 50),
            new Wall(-50, 0, 50, 1500),
            new Wall(1500, 0, 50, 1500),
            new Wall(0, 1500, 1500, 50),

            //Bottom Fill
            new Wall(0, 600, 1500, 900),
            
            // new Wall(0, 0, 200, 600),
            // new Wall(300, 0, 200, 600),
            // new Wall(150, 0, 400, 300),
        ];

        this.levelContainer = new Container(AssetType.Container);
        this.levelContainer.asset.x = 0;
        this.levelContainer.asset.y = 0;

        walls.forEach((wall) => {
            this.levelContainer.add(wall);
        });

        this.spawners.forEach((spawner) => {
            this.levelContainer.add(spawner.spawnerObject);
        });

        this.left = new Keyboard(65);
        this.right = new Keyboard(68);
        this.up = new Keyboard(87);
        this.down = new Keyboard(83);

        this.left.onClick(() => this.moveWall(1, true), () => this.moveWall(0, true));
        this.right.onClick(() => this.moveWall(-1, true), () => this.moveWall(0, true));
        this.down.onClick(() => this.moveWall(true, -1), () => this.moveWall(true, 0));
        this.up.onClick(() => this.moveWall(true, 1), () => this.moveWall(true, 0));
    }

    update(dt: any): void {
        //spawn enimes
        this.spawners.forEach((spawner) => {
            spawner.update(dt);
        });
    }

    //keep the same velocity or set it to a number
    private moveWall(x: number | boolean, y: number | boolean){
        if(y === true)
            y = this.levelContainer.velocity.y;
        if(x === true)
            x = this.levelContainer.velocity.x;

        this.levelContainer.setVelocity(x, y);
    }

    checkCollision(g1: GameObject, g2: GameObject) {
        return g1.assetType == AssetType.Player && (g2.assetType == AssetType.Wall || g2.assetType == AssetType.Enemy);
    }

    onCollision(g1: GameObject, g2: GameObject, location: CollisionLocation) {
        if(g2.assetType == AssetType.Wall){
            let padding = Game.dt;

            switch(location){
                case CollisionLocation.top: 
                case CollisionLocation.bottom: 
                    this.moveCollisionWalls(true, -(this.levelContainer.velocity.y * padding));
                    break;
                case CollisionLocation.right:
                case CollisionLocation.left:
                    this.moveCollisionWalls(-(this.levelContainer.velocity.x * padding), true);
                    break;
            }
        }
        else if(g2.assetType == AssetType.Enemy){
            Game.player.health--;
            if(Game.player.health <= 0){
                this.onLose();
            }
        }
    }

    private moveCollisionWalls(x: number | boolean, y: number | boolean){
        if(y === true)
            y = 0;
        if(x === true)
            x = 0;

        this.levelContainer.setPosition((this.levelContainer.asset.x + <number>x), (this.levelContainer.asset.y + <number>y));
    }
}