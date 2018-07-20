var Graphics = PIXI.Graphics;

var documentWidth = window.innerWidth;

let CONFIG = {
    width: documentWidth * 0.75,
    height: 800
}

var AssetType = {
    Player:0,
    Enemy:1,
    Bullet:2,
    Wall: 3,
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
    key.press = () => { key.onPress.forEach(press => { press(); }); };
    key.release = () => { key.onRelease.forEach(release => { release(); }); };
    BoundKeys.push(keyCode);
    key.onPress = [];
    key.onRelease = [];

    key.onClick = (onPress, onRelease) => {
        key.onPress.push(onPress);
        key.onRelease.push(onRelease);
    }

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


function mouse(button) {
    let mouse = {};
    mouse.button = button;
    mouse.isDown = false;
    mouse.isUp = true;
    mouse.press = undefined;
    mouse.release = undefined;
    mouse.move = undefined;
    mouse.x = 0;
    mouse.y = 0;

    //The `downHandler`
    mouse.downHandler = event => {
        if(mouse.button == event.button){
            if (mouse.isUp && mouse.press) mouse.press();
            mouse.isDown = true;
            mouse.isUp = false;

            event.preventDefault();
        }
    };

    //The `upHandler`
    mouse.upHandler = event => {
        if(mouse.button == event.button){
            if (mouse.isDown && mouse.release) mouse.release();
            mouse.isDown = false;
            mouse.isUp = true;
            
            event.preventDefault();
        }
    };

    //The `moveHandler`
    mouse.moveHandler = event => {
        if(mouse.move) mouse.move(event);

        mouse.x = event.screenX;
        mouse.y = event.screenY;
    };

    //Attach event listeners
    window.addEventListener(
        "mousedown", mouse.downHandler.bind(mouse), false
    );
    window.addEventListener(
        "mouseup", mouse.upHandler.bind(mouse), false
    );
    window.addEventListener(
        "mousemove", mouse.moveHandler.bind(mouse), false
    );

    return mouse;
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
        this.gameObjects.forEach((gameObject1) => {
            this.gameObjects.forEach((gameObject2) => {
                if(gameObject1.assetType == AssetType.Enemy){
                    if(CollisionDetection.hitRectangle(gameObject1.asset, gameObject2.asset)) {
                        switch(gameObject2.assetType){
                            case AssetType.Bullet: 
                                gameObject1.destoryed = true;
                                gameObject2.destoryed = true;//kill the bullet
                                break;
                            case AssetType.Player:
                                gameObject2.destoryed = true;//kill the player
                                break;
                        }
                    }
                }
                else if(gameObject1.assetType == AssetType.Player && gameObject2.assetType == AssetType.Wall){
                    if(CollisionDetection.hitRectangle(gameObject1.asset, gameObject2.asset)){
                        gameObject1.asset.x -= gameObject1.asset.vx;
                        if(CollisionDetection.hitRectangle(gameObject1.asset, gameObject2.asset)){
                            gameObject1.asset.x += gameObject1.asset.vx;
                            gameObject1.asset.y -= gameObject1.asset.vy;
                            if(CollisionDetection.hitRectangle(gameObject1.asset, gameObject2.asset)){
                                gameObject1.asset.x -= gameObject1.asset.vx;
                            }
                        }
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
        var color = assetType == AssetType.Player? 0x550033 : assetType == AssetType.Enemy? 0x770000 : assetType == AssetType.Wall? 0xFFFFFF : 0x66CCFF;
        var rectangle = new Graphics();
        rectangle.beginFill(color);
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
    space: keyboard(32), left: keyboard(65), right: keyboard(68), up: keyboard(87), down: keyboard(83),
    mouse: mouse(undefined), leftClick: mouse(0), rightClick: mouse(2),
    player: undefined,

    setup: function(resources, callback) {
        this.app = new PIXI.Application({width: CONFIG.width, height: CONFIG.height});
        
        this.app.view.style.left = (documentWidth/2) - (CONFIG.width/2);
        this.app.view.className = 'my-game';

        this.player = player();

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
        this.player.update(dt);
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

function weapon(fireRate, damage, shoot, ammo = -1){
    let gun = {};
    gun.fireRate = fireRate;
    gun.damage = damage;
    gun.ammo = ammo;
    gun.shots = 0;
    gun.shoot = shoot;

    gun.lastShot = 0;

    gun.fire = (dt) => {
        if(gun.lastShot > gun.fireRate && (gun.shots < gun.ammo || gun.ammo == -1)){
            gun.shoot();
            gun.shots++;
            gun.lastShot = 0;
        }
    };

    gun.reload = () => {
        gun.shots = 0;
    };

    return gun;
}

var Pistol = weapon(10, 1, undefined, -1);

function player(){
    let plyr = {};
    plyr.id = Renderer.addRectangle(new Position(300, 20, 0, 0), 20, 20, -1, AssetType.Player);
    plyr.gameObject = Renderer.getById(plyr.id);
    
    plyr.shotBullet = () => {
        var directionX = Game.mouse.x - plyr.gameObject.asset.x;
        var directionY = Game.mouse.y - plyr.gameObject.asset.y;

        Renderer.addRectangle(new Position(plyr.gameObject.asset.x, plyr.gameObject.asset.y, -11, 0), 5, 5, -1, AssetType.Bullet);
    };

    plyr.gun = Pistol;
    plyr.gun.shoot = plyr.shotBullet;

    plyr.update = (dt) => {
        if(Game.leftClick.isDown){
            plyr.gun.fire(dt);
        }

        plyr.gun.lastShot += dt;
    };

    return plyr;
}


var Level = {
    walls: [{x: 0, y:0, w:80, h:600}, {x: 600, y: 0, w: 160, h: 600}],

    load: function() {
        this.walls.forEach((wall) => {
            wall.id = Renderer.addRectangle(new Position(wall.x, wall.y, 0, 0), wall.w, wall.h, -1, AssetType.Wall);
        });
    },

    move: function(vx, vy) {
        this.walls.forEach((wall) => { 
            let wallAsset = Renderer.getById(wall.id).asset;
            wallAsset.vx = vx;
            wallAsset.vy = vy;
        });
    }
}


window.addEventListener("resize", function() {
    Game.resize();
}, false);

document.addEventListener("DOMContentLoaded", function(event) {
    Game.setup(null, () => {
        //Add the canvas that Pixi automatically created for you to the HTML document
        document.body.appendChild(Game.app.view);
        Level.load();


        // Renderer.addRectangle(0, 0, 0.1, 0.1, 10, 10, 300, AssetType.Bullet);

        // Renderer.addRectangle(0, 0, 1, 1, 20, 20, -1, AssetType.Bullet);

        
        Renderer.addRectangle(new Position(60, 20, 1, 0), 20, 20, -1, AssetType.Enemy);
        Renderer.addRectangle(new Position(600, 20, -11, 0), 10, 10, -1, AssetType.Bullet);
        //Renderer.addImage(Assets.Images.Globie, 100, 10, 0, 0, 0, 0, -1, AssetType.Player);

        
        var player1 = Game.player.gameObject;
        
        Game.left.onClick(function() {
            player1.setVelocity(-1, player1.asset.vy);
            //Level.move(-1, player1.asset.vy);
        }, function() {
            //Level.move(0, player1.asset.vy);
            player1.setVelocity(0, player1.asset.vy);
        });

        Game.right.onClick(function() {
            player1.setVelocity(1, player1.asset.vy);
        }, function() {
            player1.setVelocity(0, player1.asset.vy);
        });

        Game.up.onClick(function() {
            player1.setVelocity(player1.asset.vx, -1);
        }, function() {
            player1.setVelocity(player1.asset.vx, 0);
        });

        Game.down.onClick(function() {
            player1.setVelocity(player1.asset.vx, 1);
        }, function() {
            player1.setVelocity(player1.asset.vx, 0);
        });

        Game.start();
    });
});
