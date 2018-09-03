import { Game } from './src/app/game';

var game = new Game();

window.addEventListener("resize", function() {
    game.resize();
}, false);

document.addEventListener("DOMContentLoaded", function() {
    game.setup([], () => {
        document.body.appendChild(game.app.view);

        game.play();
    });
});