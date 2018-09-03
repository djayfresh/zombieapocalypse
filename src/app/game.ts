import * as PIXI from 'pixi.js';

import { Keyboard } from '../utility/keyboard';
import { Config } from '../config/base.config';
import { Player } from './characters/player';
import { GameObject, Container } from './renderer/game-object';
import { Level } from './maps/level';
import { Level1 } from './maps/level1';
import { Pistol } from './weapons/gun';
import { Vector2 } from '../utility/vector';
import { IBaseStage } from './stages/base.stage';
import { MainStage } from './stages/main.stage';
import { PlayStage } from './stages/play.stage';

export class Game {
    app: PIXI.Application;
    level: Level;
    up: Keyboard;
    down: Keyboard;
    esc: Keyboard;
    p: Keyboard;

    static score: number = 0;

    static dt: number;
    static center: Vector2;

    static appContainer: PIXI.Container;
    private stages: IBaseStage[];
    private activeStage: IBaseStage;
    private activeStageId: number = 0;

    state: (dt) => void;

    setup(resources: string[], callback: Function) {        
        this.app = new PIXI.Application({width: Config.width, height: Config.height});
        Game.center = new Vector2(window.innerWidth/2, this.app.screen.y + (Config.height/2));
        this.app.view.style.left = '' + ((Config.windowWidth/2) - (Config.width/2));
        this.app.view.className = 'my-game';

        this.app.ticker.add((dt) => {if(this.state) this.state(dt);});

        this.app.stage.scale = new PIXI.Point(1,1);
        Game.appContainer = this.app.stage;

        this.stages = [new MainStage(), new PlayStage()];
        this.activeStage = this.stages[this.activeStageId];

        this.up = new Keyboard(38);
        this.up.onClick(() => { this.app.stage.scale = new PIXI.Point(this.app.stage.scale.x + 0.1, this.app.stage.scale.y + 0.1); }, () => {});

        this.down = new Keyboard(40);
        this.down.onClick(() => { this.app.stage.scale = new PIXI.Point(this.app.stage.scale.x - 0.1, this.app.stage.scale.y - 0.1); }, () => {});

        this.esc = new Keyboard(27);
        this.esc.onClick(() => { this.togglePlay(); });

        this.p = new Keyboard(80);
        this.p.onClick(() => { this.togglePlay(); });

        if(resources && resources.length > 0){
            resources.forEach((resource) => {
                PIXI.loader
                .add(resource, {crossOrigin: 'anonymous'});
            });

            PIXI.loader.load(callback);

        }else {
            callback();
        }
    }

    private togglePlay() {
        if(this.state == this.update){
            this.pause();
        }
        else {
            this.play();
        }
    }

    private update(dt){
        if(!this.activeStage.hasBeenSetup){
            this.activeStage.setup();
            Game.appContainer.addChild(this.activeStage.renderer.stage);
        }

        Game.dt = dt;

        var isStageComplete = this.activeStage.isComplete();
        if(!isStageComplete.completed){
            this.activeStage.update(dt);
        }

        if(isStageComplete.completed && isStageComplete.success){
            this.activeStage.clear();
            this.nextStage();
        }
    }

    private nextStage() {
        console.log("Next stage", this.activeStageId);
        this.activeStageId = ++this.activeStageId % this.stages.length;
        this.activeStage = this.stages[this.activeStageId];
    }

    pause(){
        this.state = this.stop;
    }

    play(){
        this.state = this.update;
    }

    private stop(_dt) {

    }

    resize() {
        var gameWidth = (window.innerWidth * 0.75);
        this.app.view.style.left = ''+ ((window.innerWidth/2) - (gameWidth/2));
        this.app.renderer.resize(gameWidth, Config.height);
        Game.center = new Vector2(gameWidth/2, this.app.screen.y + (gameWidth/2));
    }

    
}