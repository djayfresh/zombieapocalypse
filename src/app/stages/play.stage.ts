import { IBaseStage, StageComplete } from "./base.stage";
import { Container } from "pixi.js";
import { Player } from "../characters/player";
import { Config } from "../../config/base.config";
import { Pistol } from "../weapons/gun";
import { RendererV2 } from "../renderer/renderer-v2";

export class PlayStage implements IBaseStage {
    private stageCompleted: StageComplete;

    hasBeenSetup: boolean;    
    renderer: RendererV2;
    private levelStage: PIXI.Container;
    private player: Player;

    isComplete(): StageComplete {
        return this.stageCompleted;
    }

    setup() {
        this.levelStage = new Container();       
        this.renderer = new RendererV2(this.levelStage); 

        this.player = new Player();
        this.player.asset.x = Config.width/2;
        this.player.asset.y = Config.height/2;
        this.player.setGun(Pistol, this.renderer);
        this.renderer.add(this.player);

        this.renderer.stage.addChild(this.levelStage);

        this.hasBeenSetup = true;
    }

    update(dt: number) {

    }

    clear() {
        this.renderer.clear();
    }

}