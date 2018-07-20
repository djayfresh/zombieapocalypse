import { Keyboard } from '../utility/keyboard';
import { Config } from '../config/base.config';
import * as PIXI from 'pixi.js';

export class Game {
    app: PIXI.Application;

    static run() {
        var game = new Game();
        game.setup();
    }

    setup() {
        this.app = new PIXI.Application({width: Config.width, height: Config.height});
        
        this.app.view.style.left = '' + ((Config.windowWidth/2) - (Config.width/2));
        this.app.view.className = 'my-game';
    }
}