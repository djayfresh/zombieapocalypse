import { IBaseStage, StageComplete } from "./base.stage";
import { Graphics, Text } from "pixi.js";
import { Config } from "../../config/base.config";
import { Renderer } from "../renderer/renderer";
import { Game } from '../main';


export class MainStage implements IBaseStage {
    hasBeenSetup: boolean;
    stage: PIXI.Container;

    private playButton: Graphics;
    private begin: boolean;

    setup() {
        this.stage = Renderer.stage;
        this.hasBeenSetup = true;

        this.playButton = new Graphics();
        this.playButton.beginFill(0xf2edb0);
        this.playButton.drawRect(0, 0, Config.width/10, 40);
        this.playButton.endFill();
        this.playButton.addChild(new Text('PLAY', { align: 'center' }));

        this.playButton.x = Game.center.x - (this.playButton.width/2);
        this.playButton.y = Game.center.y - (this.playButton.height/2);

        this.playButton.interactive = true;
        this.playButton.addListener('mousedown', (_event) => {
            console.log("Play click", _event);
            this.begin = true;
        });

        this.stage.addChild(this.playButton);
    }

    update() {}

    clear() {
        this.stage.removeChild(this.playButton);
        this.hasBeenSetup = false;
        this.begin = false;
    }

    isComplete(): StageComplete {
        return {completed: this.begin, success: this.begin};
    }
}