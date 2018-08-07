import { IBaseStage, StageComplete } from "./base.stage";
import { Container } from "pixi.js";
import { Renderer } from "../renderer/renderer";
import { Player } from "../characters/player";
import { Config } from "../../config/base.config";
import { Pistol } from "../weapons/gun";

export class PlayStage implements IBaseStage {
    private stageCompleted: StageComplete;

    hasBeenSetup: boolean;    
    stage: PIXI.Container;
    private levelStage: PIXI.Container;
    private player: Player;

    isComplete(): StageComplete {
        return this.stageCompleted;
    }

    setup() {
        this.levelStage = new Container();        

        this.player = new Player();
        this.player.asset.x = Config.width/2;
        this.player.asset.y = Config.height/2;
        this.player.setGun(Pistol);
        this.stage.addChild(this.player.asset);

        this.stage = Renderer.stage;
        this.stage.addChild(this.levelStage);

        this.hasBeenSetup = true;
    }

    update(dt: number) {

    }

    clear() {

    }

}