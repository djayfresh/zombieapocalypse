import { Level, Wall } from './level';

export class Level1 implements Level {
    walls: Wall[];
    onWin: () => void;
    onLose: () => void;
    onPause: () => void;

    setup(): void {
        //Initial setup
        this.walls = [
            new Wall(-50, -50, 1000, 50),
            new Wall(0, 0, 600, 100),
            new Wall(150, 0, 400, 300)
        ];
    }

    update(dt: any): void {

    }


}