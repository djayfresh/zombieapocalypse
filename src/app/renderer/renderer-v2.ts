import { GameObject, AssetType } from "./game-object";
import { OnHit } from "./renderer";
import { CollisionDetection, CollisionLocation } from "../../utility/collision-detection";
import { Game } from "../main";


export class RendererV2 {
    gameObjects: GameObject[] = [];
    gameObjectId: number = 0;
    stage: PIXI.Container;

    constructor(stage: PIXI.Container){
        this.stage = stage;
        Game.appContainer.addChild(this.stage);
    }

    update(dt, onHit: OnHit[]) {
        this.gameObjects.forEach(gameObject => {
            gameObject.update(dt);
        });
        
        this.checkCollision(onHit);

        this.gameObjects.filter(o => o.shouldDestory()).forEach((gameObject) => {
            if(gameObject.asset.parent != this.stage){
                gameObject.asset.parent.removeChild(gameObject.asset);
            }
            else {
                this.stage.removeChild(gameObject.asset);
            }
        });

        this.gameObjects = this.gameObjects.filter(o => !o.shouldDestory());
    }

    private checkCollision(onHits: OnHit[]) {
        this.gameObjects.forEach((gameObject1) => {
            this.gameObjects.forEach((gameObject2) => {
                if(gameObject1.id != gameObject2.id){
                    onHits.forEach((onHit) => {
                        if(onHit.shouldCheck(gameObject1, gameObject2)){
                            //console.log("Parents", gameObject1.id, gameObject1, "2", gameObject2.id, gameObject2);
                            let collisionLocation = CollisionDetection.hitRectangle(gameObject1.asset, gameObject2.asset, gameObject1.asset.parent, gameObject2.asset.parent);
                            if(collisionLocation != CollisionLocation.none) {
                                onHit.hit(gameObject1, gameObject2, collisionLocation);
                            }
                        }
                    });
                }
            });
        });
    }

    addImage(src, position, lifespan = -1, assetType) {
        var loadTexture = PIXI.loader.resources[src];
        var image = new PIXI.Sprite(loadTexture.texture);
        image.x = position.x;
        image.y = position.y;
        
        var gameObject = new GameObject(this.gameObjectId, image, assetType, lifespan);
        gameObject.setVelocity(position.vx, position.vy);
        this.stage.addChild(gameObject.asset);

        return this.add(gameObject).id;
    }

    addRectangle(position, width, height, lifespan, assetType, color: number) {
        //var color = assetType == AssetType.Player? 0x550033 : assetType == AssetType.Enemy? 0x770000 : assetType == AssetType.Wall? 0xFFFFFF : 0x66CCFF;
        var rectangle = new PIXI.Graphics();
        rectangle.beginFill(color);
        rectangle.drawRect(0, 0, width, height);
        rectangle.endFill();
        rectangle.x = position.x;
        rectangle.y = position.y;

        var gameObject = new GameObject(this.gameObjectId, rectangle, assetType, lifespan);
        gameObject.setVelocity(position.vx, position.vy);
        this.stage.addChild(gameObject.asset);

        return this.add(gameObject).id;
    }

    add(gameObject: GameObject, addToStage: boolean = true){
        gameObject.id = this.gameObjectId++;
        this.gameObjects.push(gameObject);
        if(addToStage){
            this.stage.addChild(gameObject.asset);
        }
        return gameObject;
    }

    addChild(asset: PIXI.DisplayObject){
        this.stage.addChild(asset);
    }

    getById(id): GameObject {
        return this.gameObjects.filter(o => o.id === id)[0];
    }

    clear() {
        this.stage.children.forEach((child) => {
            this.stage.removeChild(child);
        });

        this.gameObjects.forEach((object) => {
            this.stage.removeChild(object.asset);
        });
        this.gameObjectId = 0;
        this.gameObjects = [];
        
        Game.appContainer.removeChild(this.stage);
    }
}