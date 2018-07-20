import { Game } from './src/app/main';

var game = new Game();

window.addEventListener("resize", function() {
    game.resize();
}, false);

document.addEventListener("DOMContentLoaded", function(event) {
    game.setup([], () => {
        document.body.appendChild(game.app.view);

        game.play();
    });
});