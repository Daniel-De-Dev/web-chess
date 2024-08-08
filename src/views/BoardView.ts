import { Game } from "../controllers/Game.js";
import { BOARD_SIZE } from "../models/Board.js";
import { ChessPiece } from "../models/Piece.js";
import { handle_square_click } from "../services/Game.js";

const DEBUG = true;

/**
 * Draws the chess board on the specified element.
 * 
 * @param board_element - The HTML element where the chess board will be drawn.
 * @param board - The chess board data.
 * @param direction - The direction of the board (1 for white, -1 for black).
 */
export function draw_board(board_element: HTMLElement, game: Game) {
    clear_board(board_element);

    let count = 0;
    
    for (let row = game.board_direction === 1 ? BOARD_SIZE - 1 : 0;
        game.board_direction === 1 ? row >= 0 : row < BOARD_SIZE;
        game.board_direction === 1 ? row-- : row++) {

        const BOARD_ROW = game.board[row]!;

        for (let column = game.board_direction === 1 ? 0 : BOARD_SIZE - 1;
            game.board_direction === 1 ? column < BOARD_SIZE : column >= 0;
            game.board_direction === 1 ? column++ : column--) {

            const SQUARE = BOARD_ROW[column];

            const CELL = document.createElement('div');
            CELL.classList.add('cell');
            CELL.id = `${column}-${row}`;
            CELL.addEventListener('click', (event) => {
                handle_square_click(event, game);
            });

            if (count % 2 === 0) {
                CELL.classList.add('w');
            } else {
                CELL.classList.add('b');
            }

            board_element.append(CELL);

            
            if (SQUARE !== undefined && SQUARE !== null) {
                SQUARE as ChessPiece;
                const PIECE = document.createElement('img');
                const PIECE_COLOR = SQUARE.color === 1 ? 'w' : 'b';
                PIECE.classList.add('piece');
                const PIECE_NAME = SQUARE.constructor.name.toLowerCase();
                PIECE.src = `./assets/images/${PIECE_NAME}-${PIECE_COLOR}.svg`;
                PIECE.alt = `${PIECE_NAME}-${PIECE_COLOR}`;
                CELL.appendChild(PIECE);
            }

            if (DEBUG) {
                const COLUMN_NUM = document.createElement('p');
                COLUMN_NUM.textContent = `(${column},${row})`;
                COLUMN_NUM.classList.add('pos');
                CELL.appendChild(COLUMN_NUM);
            }
            
            count++;
        }
        count++;
    }
}

export function flip_board(_: Event, board_element: HTMLElement, game: Game) {
    game.board_direction *= -1;
    draw_board(board_element, game);
}

function clear_board(board_element: HTMLElement) {
    Array.from(board_element.childNodes).forEach(square => square.remove());
}