import { Game } from "./controllers/Game.js";
import { START_BOARD } from "./models/Board.js";
import { draw_board, flip_board } from "./views/BoardView.js";


function main() {
    const BOARD = document.getElementById('chessboard') as HTMLElement;
    if (BOARD === null) {
        console.error('Failed to fetch the chessboard element');
        return;
    }
    
    const CHESS_GAME = new Game(1, START_BOARD, BOARD);
    draw_board(BOARD, CHESS_GAME);
    
    const BUTTON = document.getElementById('flip');
    BUTTON?.addEventListener('click', (event) => {
        flip_board(event, BOARD, CHESS_GAME);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    main();
});
