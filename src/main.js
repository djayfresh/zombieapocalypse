var documentWidth = window.innerWidth;

let CONFIG = {
    width: documentWidth * 0.75,
    height: 800
}


let type = "WebGL";
if(!PIXI.utils.isWebGLSupported()){
    type = "canvas";
}

var Game = {
    app: null,

    setup: function() {
        this.app = new PIXI.Application({width: CONFIG.width, height: CONFIG.height});
        
        this.app.view.style.left = (documentWidth/2) - (CONFIG.width/2);
        this.app.view.className = 'my-game';
    },

    start: function() {
        this.state = this.play;

        //Start the game loop by adding the `gameLoop` function to
        //Pixi's `ticker` and providing it with a `delta` argument.
        this.app.ticker.add(dt => this.state(dt));
    },

    update: function(dt) {

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
        this.app.resize(gameWidth, CONFIG.height);
    },

    state: null,
    HighSchore: 0,
}


window.addEventListener("resize", function() {
    Game.resize();
}, false);

document.addEventListener("DOMContentLoaded", function(event) {

    Game.setup();

    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(Game.app.view);

    Game.start();
});
