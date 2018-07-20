import { Level, Wall } from './level';
import { Container, AssetType } from '../renderer/game-object';
import { Keyboard } from '../../utility/keyboard';

export class Level1 implements Level {
    walls: Container;

    onWin: () => void;
    onLose: () => void;
    onPause: () => void;

    left: Keyboard; right: Keyboard; up: Keyboard; down: Keyboard;

    constructor(){
        this.setup();
    }

    setup(): void {
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

        this.walls = new Container(AssetType.Wall);
        this.walls.asset.x = 0;
        this.walls.asset.y = 0;

        walls.forEach((wall) => {
            this.walls.add(wall);
        });

        this.left = new Keyboard(65);
        this.right = new Keyboard(68);
        this.up = new Keyboard(87);
        this.down = new Keyboard(83);

        this.left.onClick(() => this.moveWall(-1, true), () => this.moveWall(0, 0));
        this.right.onClick(() => this.moveWall(1, true), () => this.moveWall(0, 0));
        this.down.onClick(() => this.moveWall(true, 1), () => this.moveWall(0, 0));
        this.up.onClick(() => this.moveWall(true, -1), () => this.moveWall(0, 0));
    }

    update(dt: any): void {
        //spawn enimes
    }

    //keep the same velocity or set it to a number
    private moveWall(x: number | boolean, y: number | boolean){
        if(y === true)
            y = this.walls.velocity.y;
        if(x === true)
            x = this.walls.velocity.x;

        this.walls.setVelocity(x, y);
    }
}