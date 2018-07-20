import * as PIXI from 'pixi.js';

import { Keyboard } from '../utility/keyboard';
import { Config } from '../config/base.config';
import { Player } from './player';
import { Renderer } from './renderer/renderer';
import { GameObject, Container } from './renderer/game-object';
import { Level } from './maps/level';
import { Level1 } from './maps/level1';

export class Game {
    app: PIXI.Application;
    player: Player;
    level: Level;

    private levels: any[] = [Level1];

    state: (dt) => void;

    setup(resources: string[], callback: Function) {        
        this.app = new PIXI.Application({width: Config.width, height: Config.height});
        
        this.app.view.style.left = '' + ((Config.windowWidth/2) - (Config.width/2));
        this.app.view.className = 'my-game';

        this.app.ticker.add((dt) => {if(this.state) this.state(dt);});

        this.player = new Player();
        this.player.asset.x = Config.width/2;
        this.player.asset.y = Config.height/2;

        this.level = this.levels[0];
        this.initLevel();

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

    private update(dt){
        Renderer.update(dt, []);
        this.level.update(dt);
    }

    pause(){
        this.state = this.stop;
    }

    play(){
        this.state = this.update;
    }

    private stop(_dt) {

    }

    private initLevel() {
        this.level.onPause = () => {this.pause();}

        this.level.onLose = () => { console.log("Lose"); this.clearLevel();}
        this.level.onWin = () => { console.log("Win"); this.clearLevel();}

        this.addContainer(this.level.walls);
    }

    private clearLevel() {
        Renderer.gameObjects.forEach((object) => {
            this.app.stage.removeChild(object.asset);
        });
        Renderer.gameObjectId = 0;
        Renderer.gameObjects = [];
    }

    resize() {
        var gameWidth = (window.innerWidth * 0.75);
        this.app.view.style.left = ''+ ((window.innerWidth/2) - (gameWidth/2));
        this.app.renderer.resize(gameWidth, Config.height);
        this.player.asset.x = gameWidth/2;
    }

    spawn(gameObject: GameObject){
        Renderer.add(gameObject);

        this.app.stage.addChild(gameObject.asset);
    }

    addContainer(gameObject: Container){
        Renderer.add(gameObject);
        gameObject.children.forEach((child) => {
            Renderer.add(child);
        });
        
        this.app.stage.addChild(gameObject.asset);
    }
}