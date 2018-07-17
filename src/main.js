var Graphics = PIXI.Graphics;

var documentWidth = window.innerWidth;

let CONFIG = {
    width: documentWidth * 0.75,
    height: 800
}

var AssetType = {
    Player:0,
    Enemy:1,
    Bullet:2
};

var Assets = {
    Images: {
        Globie: "assets/images/globie.png"
    }
}

function Position(x, y, vx = 0, vy = 0) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
}

var BoundKeys = [];
function keyboard(keyCode) {
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    BoundKeys.push(keyCode);
    //The `downHandler`
    key.downHandler = event => {
      if (event.keyCode === key.code) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
      }

      if(BoundKeys.find(k => k == event.keyCode)){
        event.preventDefault();
      }
    };
  
    //The `upHandler`
    key.upHandler = event => {
      if (event.keyCode === key.code) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
      }
      if(BoundKeys.find(k => k == event.keyCode)){
        event.preventDefault();
      }
    };
  
    //Attach event listeners
    window.addEventListener(
      "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
      "keyup", key.upHandler.bind(key), false
    );
    return key;
  }

var CollisionDetection = {
    hitRectangle: function(r1, r2) {
        //Define the variables we'll need to calculate
        let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
      
        //hit will determine whether there's a collision
        hit = false;
      
        //Find the center points of each sprite
        r1.centerX = r1.x + r1.width / 2;
        r1.centerY = r1.y + r1.height / 2;
        r2.centerX = r2.x + r2.width / 2;
        r2.centerY = r2.y + r2.height / 2;
      
        //Find the half-widths and half-heights of each sprite
        r1.halfWidth = r1.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfWidth = r2.width / 2;
        r2.halfHeight = r2.height / 2;
      
        //Calculate the distance vector between the sprites
        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;
      
        //Figure out the combined half-widths and half-heights
        combinedHalfWidths = r1.halfWidth + r2.halfWidth;
        combinedHalfHeights = r1.halfHeight + r2.halfHeight;
      
        //Check for a collision on the x axis
        if (Math.abs(vx) < combinedHalfWidths) {
      
          //A collision might be occuring. Check for a collision on the y axis
          if (Math.abs(vy) < combinedHalfHeights) {
      
            //There's definitely a collision happening
            hit = true;
          } else {
      
            //There's no collision on the y axis
            hit = false;
          }
        } else {
      
          //There's no collision on the x axis
          hit = false;
        }
      
        //`hit` will be either `true` or `false`
        return hit;
      }
}

function GameObject(id, asset, lifespan = -1, assetType) {
    this.id = id;
    this.asset = asset;
    this.lifespan = lifespan;
    this.timeAlive = 0;
    this.assetType = assetType;
    this.destoryed = false;

    this.setPosition = function(x, y){
        this.asset.x = x;
        this.asset.y = y;
    };

    this.setVelocity = function(vx, vy){
        this.asset.vx = vx;
        this.asset.vy = vy;
    };

    this.update = function(dt){
        this.asset.x += this.asset.vx * dt;
        this.asset.y += this.asset.vy * dt;
        this.timeAlive += dt;
    };

    this.shouldDestory = function() {
        return (this.timeAlive > this.lifespan && this.lifespan !== -1) || this.destoryed;
    }
}

var Renderer = {
    gameObjects: [],
    gameObjectId: 0,

    update: function(dt){
        this.gameObjects.forEach(gameObject => {
            gameObject.update(dt);
        });
        
        this.checkCollision();

        this.gameObjects.filter(o => o.shouldDestory()).forEach((gameObject, i) => {
            this.removeRenderedObject(gameObject.asset);
        });

        this.gameObjects = this.gameObjects.filter(o => !o.shouldDestory());
    },

    checkCollision: function() {
        this.gameObjects.filter(o => o.assetType == AssetType.Enemy).forEach((enemy) => {
            this.gameObjects.filter(o => o.assetType != AssetType.Enemy).forEach((gameObject) => {
                if(CollisionDetection.hitRectangle(enemy.asset, gameObject.asset)) {
                    switch(gameObject.assetType){
                        case AssetType.Bullet: 
                            enemy.destoryed = true;
                            gameObject.destoryed = true;//kill the bullet
                            break;
                        case AssetType.Player:
                            gameObject.destoryed = true;//kill the player
                            break;
                    }
                }
            });
        });
    },

    addImage: function(src, position, width, height, lifespan = -1, assetType) {
        var loadTexture = PIXI.loader.resources[src];
        var image = new PIXI.Sprite(loadTexture.texture);
        image.x = position.x;
        image.y = position.y;
        image.vx = position.vx;
        image.vy = position.vy;
        
        this.gameObjects.push(new GameObject(this.gameObjectId, image, lifespan, assetType));
        this.addRenderedObject(this.getById(this.gameObjectId).asset);

        return this.gameObjectId++;
    },

    addRectangle: function(position, width, height, lifespan = -1, assetType) {
        var rectangle = new Graphics();
        rectangle.lineStyle(2, 0xFF3300, 1);
        rectangle.beginFill(0x66CCFF);
        rectangle.drawRect(0, 0, width, height);
        rectangle.endFill();
        rectangle.x = position.x;
        rectangle.y = position.y;
        rectangle.vx = position.vx;
        rectangle.vy = position.vy;

        this.gameObjects.push(new GameObject(this.gameObjectId, rectangle, lifespan, assetType));
        this.addRenderedObject(this.getById(this.gameObjectId).asset);

        return this.gameObjectId++;
    },

    getById: function(id){
        return this.gameObjects.find(o => o.id === id);
    },

    addRenderedObject(obj){
        Game.app.stage.addChild(obj);
    },

    removeRenderedObject(obj){
        Game.app.stage.removeChild(obj);
    },
}


var Game = {
    app: null,
    space: keyboard(32), left: keyboard(37), right: keyboard(39),

    setup: function(resources, callback) {
        this.app = new PIXI.Application({width: CONFIG.width, height: CONFIG.height});
        
        this.app.view.style.left = (documentWidth/2) - (CONFIG.width/2);
        this.app.view.className = 'my-game';

        if(resources){
            resources.forEach((resource) => {
                PIXI.loader
                .add(resource, {crossOrigin: 'anonymous'});
            });

            PIXI.loader.load(callback);

        }else {
            callback();
        }
    },

    start: function() {
        this.state = this.play;

        //Start the game loop by adding the `gameLoop` function to
        //Pixi's `ticker` and providing it with a `delta` argument.
        this.app.ticker.add(dt => this.state(dt));
    },

    update: function(dt) {
        Renderer.update(dt);
    },

    pause: function(dt) {
        this.state = function() {};
    },

    play: function(dt) {
        this.update(dt);
    },

    resize: function() {
        var gameWidth = (window.innerWidth * 0.75);
        this.app.view.style.left = (window.innerWidth/2) - (gameWidth/2);
        this.app.renderer.resize(gameWidth, CONFIG.height);
    },

    state: null,
    HighSchore: 0,

    
}


window.addEventListener("resize", function() {
    Game.resize();
}, false);

document.addEventListener("DOMContentLoaded", function(event) {
    Game.setup(null, () => {
        //Add the canvas that Pixi automatically created for you to the HTML document
        document.body.appendChild(Game.app.view);


        // Renderer.addRectangle(0, 0, 0.1, 0.1, 10, 10, 300, AssetType.Bullet);

        // Renderer.addRectangle(0, 0, 1, 1, 20, 20, -1, AssetType.Bullet);

        
        Renderer.addRectangle(new Position(60, 20, 1, 0), 20, 20, -1, AssetType.Enemy);
        Renderer.addRectangle(new Position(600, 20, -11, 0), 10, 10, -1, AssetType.Bullet);
        //Renderer.addImage(Assets.Images.Globie, 100, 10, 0, 0, 0, 0, -1, AssetType.Player);

        
        var playerId = Renderer.addRectangle(new Position(300, 20, 0, 0), 20, 20, -1, AssetType.Player);
        var player = Renderer.getById(playerId);

        Game.left.press = function() {
            player.setVelocity(-1, player.asset.vy);
        };        
        Game.left.release = function() {
            player.setVelocity(0, player.asset.vy);
        };
        Game.right.press = function() {
            player.setVelocity(1, player.asset.vy);
        };
        Game.right.release = function() {
            player.setVelocity(0, player.asset.vy);
        };

        Game.start();
    });
});
