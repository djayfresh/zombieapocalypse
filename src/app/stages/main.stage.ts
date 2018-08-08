import { IBaseStage, StageComplete } from "./base.stage";
import { Graphics, Text } from "pixi.js";
import { Config } from "../../config/base.config";
import { Renderer } from "../renderer/renderer";
import { Game } from '../main';
import { RendererV2 } from "../renderer/renderer-v2";


export class MainStage implements IBaseStage {
    hasBeenSetup: boolean;
    renderer: RendererV2;

    private playButton: Graphics;
    private begin: boolean;

    setup() {
        this.renderer = new RendererV2(new PIXI.Container());
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

        this.renderer.addChild(this.playButton);
    }

    update() {}

    clear() {
        this.renderer.clear();
        this.hasBeenSetup = false;
        this.begin = false;
    }

    isComplete(): StageComplete {
        return {completed: this.begin, success: this.begin};
    }
}