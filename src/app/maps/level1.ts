import { Level, Wall } from './level';
import { Container, AssetType } from '../renderer/game-object';

export class Level1 implements Level {
    walls: Container;

    onWin: () => void;
    onLose: () => void;
    onPause: () => void;

    constructor(){
        this.setup();
    }

    setup(): void {
        //Initial setup
        var walls = [
            new Wall(-50, -50, 1000, 50),
            new Wall(0, 0, 600, 100),
            new Wall(150, 0, 400, 300),
        ];

        this.walls = new Container(AssetType.Wall);
        this.walls.asset.x = 0;
        this.walls.asset.y = 0;

        walls.forEach((wall) => {
            this.walls.add(wall);
        });
    }

    update(dt: any): void {
        //spawn enimes
    }
}