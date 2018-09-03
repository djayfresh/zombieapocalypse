import { IBaseStage, StageComplete } from "./base.stage";
import { Container } from "pixi.js";
import { Player } from "../characters/player";
import { Config } from "../../config/base.config";
import { Pistol } from "../weapons/gun";
import { RendererV2 } from "../renderer/renderer-v2";
import { Level } from '../maps/level';
import { Level1 } from '../maps/level1';

export class PlayStage implements IBaseStage {
    private stageCompleted: StageComplete;

    hasBeenSetup: boolean;    
    renderer: RendererV2;
    private levelStage: PIXI.Container;
    private player: Player;
    private level: Level;
    private levels: [Level1];

    isComplete(): StageComplete {
        return this.stageCompleted;
    }

    setup() {
        this.stageCompleted = {completed: false};

        this.levelStage = new Container();       
        this.renderer = new RendererV2(this.levelStage); 

        this.player = new Player();
        this.player.asset.x = Config.width/2;
        this.player.asset.y = Config.height/2;
        this.player.setGun(Pistol, this.renderer);
        this.renderer.add(this.player);

        this.hasBeenSetup = true;

        this.levels = [new Level1()];
        this.level = this.levels[0];
        this.level.setup(this.player);
        this.renderer.add(this.level.levelContainer);
    }

    update(dt: number) {
        this.renderer.update(dt, []);
        this.level.update(dt);
    }

    pause(){
        //Don't do nothin
    }

    clear(){
        this.renderer.clear();
    }

    private clearLevel() {
        this.renderer.gameObjects.forEach((object) => {
            this.levelStage.removeChild(object.asset);
        });
        this.renderer.gameObjectId = 0;
        this.renderer.gameObjects = [];
    }
}