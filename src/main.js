let CONFIG = {
    width: 800,
    height: 800
}
var documentWidth = window.innerWidth;


let type = "WebGL";
if(!PIXI.utils.isWebGLSupported()){
    type = "canvas";
}

var Game = {

    update: function(dt) {
        
    },

    run: function(dt) {
        Game.update(dt);
    },

    pause: function() {
        Game.state = function() {};
    },

    play: function() {
        Game.state = this.run;
    },

    state: null,
    HighSchore: 0,
}

Game.state = Game.play;

let app = new PIXI.Application({width: CONFIG.width, height: CONFIG.height});

app.view.style.left = (documentWidth/2) - (CONFIG.width/2);
app.view.className = 'my-game';













document.addEventListener("DOMContentLoaded", function(event) {
    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);
});
