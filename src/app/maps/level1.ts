import { Level, Wall } from './level';
import { Container, AssetType, GameObject } from '../renderer/game-object';
import { Keyboard } from '../../utility/keyboard';
import { CollisionLocation } from '../../utility/collision-detection';
import { Game } from '../main';
import { Spawner } from '../spawners/spawner';
import { Vector2 } from '../../utility/vector';
import { Player } from '../characters/player';

export class Level1 implements Level {
    spawners: Spawner[];
    levelContainer: Container;
    private player: Player;

    onWin: () => void;
    onLose: () => void;
    onPause: () => void;

    left: Keyboard; right: Keyboard; up: Keyboard; down: Keyboard;

    constructor(){
    }

    setup(player: Player): void {
        this.player = player;
        
        var spawnerLocations = [
            new Vector2(100, 100),
            new Vector2(900, 100)
        ];

        this.spawners = [];
        spawnerLocations.forEach((path) => {
            this.spawners.push(new Spawner([path], 500, 20, player));
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
            this.levelContainer.add(spawner);
        });

        this.left = new Keyboard(65);
        this.right = new Keyboard(68);
        this.up = new Keyboard(87);
        this.down = new Keyboard(83);

        this.left.onClick(() => this.moveLevel(1, true), () => this.moveLevel(0, true));
        this.right.onClick(() => this.moveLevel(-1, true), () => this.moveLevel(0, true));
        this.down.onClick(() => this.moveLevel(true, -1), () => this.moveLevel(true, 0));
        this.up.onClick(() => this.moveLevel(true, 1), () => this.moveLevel(true, 0));
    }

    update(dt: any): void {
        //spawn enimes
        this.spawners.forEach((spawner) => {
            spawner.update(dt);
        });
    }

    //keep the same velocity or set it to a number
    private moveLevel(x: number | boolean, y: number | boolean){
        if(y === true)
            y = this.levelContainer.velocity.y;
        if(x === true)
            x = this.levelContainer.velocity.x;

        this.levelContainer.setVelocity(x, y);
    }

    checkCollision(g1: GameObject, g2: GameObject) {
        return (g1.assetType == AssetType.Player && (g2.assetType == AssetType.Wall || g2.assetType == AssetType.Enemy)) || 
        (g1.assetType == AssetType.Enemy && g2.assetType == AssetType.Bullet);
    }

    onCollision(g1: GameObject, g2: GameObject, location: CollisionLocation) {
        if(g1.assetType == AssetType.Player) {
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
                g2.destoryed = true;

                this.player.health--;
                if(this.player.health <= 0){
                    this.onLose();
                }
            }
        }
        else if(g1.assetType == AssetType.Enemy){
            if(g2.assetType == AssetType.Bullet){
                g2.destoryed = true;
                g1.destoryed = true;
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