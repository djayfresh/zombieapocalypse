import { GameObject, AssetType } from "../renderer/game-object";
import { Weapon, Bullet } from "../weapons/gun";
import { Mouse, MouseButton } from "../../utility/mouse";
import { RendererV2 } from "../renderer/renderer-v2";
import { Vector2 } from "../../utility/vector";
import { Game } from "../game";
import { Config } from "../../config/base.config";

export class Player extends GameObject {
    asset: PIXI.Graphics;
    gun: Weapon;
    health: number = Config.player.health;

    trigger: Mouse;

    constructor() {
        super(0, new PIXI.Graphics, AssetType.Player);

        this.asset.beginFill(0x550033);
        this.asset.drawRect(0, 0, 20, 20);
        this.asset.endFill();

        this.trigger = new Mouse(MouseButton.Left);
    }

    update(dt) {
        if(this.gun){
            this.gun.update(dt);

            if(this.trigger.isDown){
                this.gun.fire();
            }
        }
    }

    setGun(gun: Weapon, renderer: RendererV2){
        this.gun = gun;
        this.gun.fired = () => {
            var bullet = new Bullet();
            bullet.setPosition(this.asset.x, this.asset.y);

            var mousePos = new Vector2(this.trigger.x, this.trigger.y);
            var playerPos = new Vector2(Game.center.x, Game.center.y);
            var directionOfMouse = Vector2.subtract(mousePos, playerPos).unitVector();
            console.log("Fire", "Mouse Pos", mousePos, "Player Pos", playerPos, "Dir", directionOfMouse);

            bullet.setVelocity(directionOfMouse.x * this.gun.speed, directionOfMouse.y * this.gun.speed);

            renderer.add(bullet);
        }
    }
}

