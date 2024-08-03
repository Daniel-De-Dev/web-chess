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

    let y = game.board_direction === 1 ? 0 : BOARD_SIZE - 1;
    game.board.forEach(row => {
        let x = game.board_direction === 1 ? BOARD_SIZE - 1 : 0;
        row.forEach(square => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `${x}-${y}`;
            cell.addEventListener('click', (event) => {
                handle_square_click(event, game);
            });

            if ((x+y) % 2 === 0) {
                cell.classList.add('w');
            } else {
                cell.classList.add('b');
            }

            game.board_direction === 1 ? board_element.prepend(cell) : board_element.append(cell);
            
            if (square !== null) {
                square as ChessPiece;
                const piece = document.createElement('img');
                const piece_color = square.color === 1 ? 'w' : 'b';
                piece.classList.add('piece');
                piece.src = `./assets/images/${square.type}-${piece_color}.svg`;
                piece.alt = `${square.type}-${piece_color}`;
                cell.appendChild(piece);
            }
            game.board_direction === 1 ? x-- : x++;
        });
        game.board_direction === 1 ? y++ : y--;
    });
}

export function flip_board(_: Event, board_element: HTMLElement, game: Game) {
    game.board_direction *= -1;
    draw_board(board_element, game);
}

function clear_board(board_element: HTMLElement) {
    Array.from(board_element.childNodes).forEach(square => square.remove());
}