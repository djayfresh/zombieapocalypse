import { Keyboard } from '../utility/keyboard';

export class App {
    static run() {
        console.log("Hello world");
        var left = new Keyboard(65);
        left.onClick(() => { console.log("Left");}, () => {});
    }
}