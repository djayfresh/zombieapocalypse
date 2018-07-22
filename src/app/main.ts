import * as PIXI from 'pixi.js';

import { Keyboard } from '../utility/keyboard';
import { Config } from '../config/base.config';
import { Player } from './characters/player';
import { Renderer } from './renderer/renderer';
import { GameObject, Container } from './renderer/game-object';
import { Level } from './maps/level';
import { Level1 } from './maps/level1';
import { Pistol } from './weapons/gun';
import { Vector2 } from '../utility/vector';

export class Game {
    app: PIXI.Application;
    static player: Player;
    level: Level;
    up: Keyboard;
    down: Keyboard;

    static dt: number;
    static center: Vector2;

    private levels: Level[];

    state: (dt) => void;

    setup(resources: string[], callback: Function) {        
        this.app = new PIXI.Application({width: Config.width, height: Config.height});
        Game.center = new Vector2(window.innerWidth/2, this.app.screen.y + (Config.height/2));
        this.app.view.style.left = '' + ((Config.windowWidth/2) - (Config.width/2));
        this.app.view.className = 'my-game';

        this.app.ticker.add((dt) => {if(this.state) this.state(dt);});

        this.app.stage.scale = new PIXI.Point(1,1);
        Renderer.stage = this.app.stage;

        var player = new Player();
        Game.player = player;

        player.asset.x = Config.width/2;
        player.asset.y = Config.height/2;
        player.setGun(Pistol);
        this.spawn(player);

        this.levels = [new Level1()];
        this.level = this.levels[0];
        this.initLevel();

        this.up = new Keyboard(38);
        this.up.onClick(() => { this.app.stage.scale = new PIXI.Point(this.app.stage.scale.x + 0.1, this.app.stage.scale.y + 0.1); }, () => {});

        this.down = new Keyboard(40);
        this.down.onClick(() => { this.app.stage.scale = new PIXI.Point(this.app.stage.scale.x - 0.1, this.app.stage.scale.y - 0.1); }, () => {});

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
        Game.dt = dt;
        
        Renderer.update(dt, [{
            shouldCheck: (g1, g2) => this.level.checkCollision(g1, g2),
            hit: (g1, g2, loc) =>  this.level.onCollision(g1, g2, loc)
        }]);
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

        this.addContainer(this.level.levelContainer);
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
        Game.player.asset.x = gameWidth/2;
        Game.center = new Vector2(gameWidth/2, this.app.screen.y + (Config.height/2));
    }

    spawn(gameObject: GameObject){
        Renderer.add(gameObject);
    }

    addContainer(gameObject: Container){
        Renderer.add(gameObject);

        gameObject.children.forEach((child) => {
            Renderer.add(child, false);
        });
    }
}