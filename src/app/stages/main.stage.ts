import { IBaseStage, StageComplete } from "./base.stage";
import { Graphics, Text, interaction } from "pixi.js";
import { Config } from "../../config/base.config";
import { Renderer } from "../renderer/renderer";
import { Keyboard } from "../../utility/keyboard";


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
        this.playButton.drawRect(0, 0, Config.width/20, 40);
        this.playButton.endFill();
        this.playButton.addChild(new Text('PLAY', { align: 'center' }));
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