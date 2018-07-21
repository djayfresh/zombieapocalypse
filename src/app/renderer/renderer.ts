import { CollisionDetection, CollisionLocation } from "../../utility/collision-detection";
import { GameObject, AssetType } from "./game-object";



export class Renderer {
    static gameObjects: GameObject[] = [];
    static gameObjectId: number = 0;
    static toRemove: GameObject[];

    static update(dt, onHit: OnHit[]) {
        Renderer.gameObjects.forEach(gameObject => {
            gameObject.update(dt);
        });
        
        Renderer.checkCollision(onHit);

        Renderer.toRemove = [];
        Renderer.gameObjects.filter(o => o.shouldDestory()).forEach((gameObject, i) => {
            Renderer.toRemove.push(gameObject);
        });

        Renderer.gameObjects = Renderer.gameObjects.filter(o => !o.shouldDestory());
    }

    private static checkCollision(onHits: OnHit[]) {
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

    static addImage(src, position, lifespan = -1, assetType) {
        var loadTexture = PIXI.loader.resources[src];
        var image = new PIXI.Sprite(loadTexture.texture);
        image.x = position.x;
        image.y = position.y;
        
        var gameObject = new GameObject(Renderer.gameObjectId, image, assetType, lifespan);
        gameObject.setVelocity(position.vx, position.vy);

        return Renderer.add(gameObject).id;
    }

    static addRectangle(position, width, height, lifespan, assetType) {
        var color = assetType == AssetType.Player? 0x550033 : assetType == AssetType.Enemy? 0x770000 : assetType == AssetType.Wall? 0xFFFFFF : 0x66CCFF;
        var rectangle = new PIXI.Graphics();
        rectangle.beginFill(color);
        rectangle.drawRect(0, 0, width, height);
        rectangle.endFill();
        rectangle.x = position.x;
        rectangle.y = position.y;

        var gameObject = new GameObject(Renderer.gameObjectId, rectangle, assetType, lifespan);
        gameObject.setVelocity(position.vx, position.vy);

        return Renderer.add(gameObject).id;
    }

    static add(gameObject: GameObject){
        gameObject.id = Renderer.gameObjectId++;
        Renderer.gameObjects.push(gameObject);
        return gameObject;
    }

    static getById(id): GameObject {
        return Renderer.gameObjects.filter(o => o.id === id)[0];
    }
}

export interface OnHit {
    shouldCheck(gameObject1: GameObject, gameObject2: GameObject): boolean;
    hit(gameObject1: GameObject, gameObject2: GameObject, location: CollisionLocation): void;
}