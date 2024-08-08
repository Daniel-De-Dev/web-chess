import { Game } from "../controllers/Game.js";
import { BOARD_SIZE } from "../models/Board.js";
import { ChessPiece } from "../models/Piece.js";
import { handle_square_click } from "../services/Game.js";

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

            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `${column}-${row}`;
            cell.addEventListener('click', (event) => {
                handle_square_click(event, game);
            });

            if (count % 2 === 0) {
                cell.classList.add('w');
            } else {
                cell.classList.add('b');
            }

            board_element.append(cell);
            
            if (SQUARE !== undefined && SQUARE !== null) {
                SQUARE as ChessPiece;
                const piece = document.createElement('img');
                const piece_color = SQUARE.color === 1 ? 'w' : 'b';
                piece.classList.add('piece');
                const PIECE_NAME = SQUARE.constructor.name.toLowerCase();
                piece.src = `./assets/images/${PIECE_NAME}-${piece_color}.svg`;
                piece.alt = `${PIECE_NAME}-${piece_color}`;
                cell.appendChild(piece);
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