import { IBaseStage, StageComplete } from "./base.stage";
import { Graphics, Text } from "pixi.js";
import { Config } from "../../config/base.config";
import { Renderer } from "../renderer/renderer";
import { Game } from '../game';
import { RendererV2 } from "../renderer/renderer-v2";
import { Button } from "../renderer/button";


export class MainStage implements IBaseStage {
    hasBeenSetup: boolean;
    renderer: RendererV2;

    private playButton: Button;
    private begin: boolean;

    setup() {
        this.renderer = new RendererV2(new PIXI.Container());
        this.hasBeenSetup = true;

        this.playButton = new Button(Game.center.x, Game.center.y, Config.width/10, 40, 'PLAY');
        this.playButton.setPosition(Game.center.x - (this.playButton.button.width * 2), Game.center.y - (this.playButton.button.height/2));

        this.playButton.onClick.subscribe(() => {
            this.begin = true;
        });

        this.renderer.add(this.playButton);
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