import { Game } from "./controllers/Game.js";
import { START_BOARD } from "./models/Board.js";
import { draw_board } from "./views/BoardView.js";

function main() {
    const CHESS_GAME = new Game(1, START_BOARD);
    const BOARD = document.getElementById('chessboard');
    if (BOARD) {
        draw_board(BOARD, CHESS_GAME.board);
    }
}

main();
console.log('test');
