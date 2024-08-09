import { Game } from "../controllers/Game.js";
import { BOARD_SIZE } from "../models/Board.js";
import { ChessPiece, King } from "../models/Piece.js";
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
    
    // Replicate the stored state of the board to HTML
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
                if (SQUARE instanceof King && game.check_from && game.check_from.color !== SQUARE.color) {
                    CELL.classList.add('check');
                }
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

                const styleElement = document.createElement('style');
                styleElement.type = 'text/css';
                styleElement.appendChild(document.createTextNode(`.dot {background-color: blue;}`));
                document.head.appendChild(styleElement);
            }
            
            count++;
        }
        count++;
    }

    // Render the moves of a piece

    if (game.highlighted_piece) {
        
        const PIECE_COLUMN = game.highlighted_piece.position.column;
        const PIECE_ROW = game.highlighted_piece.position.row;
        
        if (!((0 <= PIECE_COLUMN && PIECE_COLUMN < BOARD_SIZE) && (0 <= PIECE_ROW && PIECE_ROW < BOARD_SIZE))) {
            console.error('The coordinates stored on the highlighted pieces is invalid', game);
            return;
        }

        const SELECTED_CELL = document.getElementById(`${PIECE_COLUMN}-${PIECE_ROW}`);

        if (!SELECTED_CELL) {
            console.error('Could not fetch the cell the current selected piece is on', game);
            return;
        }

        const SELECTED_PIECE = SELECTED_CELL.querySelector('.piece');

        if (!SELECTED_PIECE) {
            console.error('There is no piece where a piece is expected', game);
            return;
        }

        SELECTED_PIECE.classList.add('selected');

        
    }

    if (game.valid_moves) {
        game.valid_moves.forEach(move => {
            const MOVE_COLUMN = move.column;
            const MOVE_ROW = move.row;

            if (!((0 <= MOVE_COLUMN && MOVE_COLUMN < BOARD_SIZE) && (0 <= MOVE_ROW && MOVE_ROW < BOARD_SIZE))) {
                console.error('The coordinates stored on the valid move is invalid', game);
                return;
            }

            const MOVE_CELL = document.getElementById(`${MOVE_COLUMN}-${MOVE_ROW}`);

            if (!MOVE_CELL) {
                console.error('Could not fetch the cell the move is specifying', game);
                return;
            }
            
            const DOT = document.createElement('div');
            DOT.classList.add('dot');
            
            const BOARD_ROW = game.board[MOVE_ROW];

            if (!BOARD_ROW) {
                console.error('Somehow a row doesn\'t exits for a valid value', game, move);
                return;
            }

            const BOARD_SQUARE = BOARD_ROW[MOVE_COLUMN];

            if (BOARD_SQUARE && BOARD_SQUARE.color !== game.highlighted_piece?.color) {
                DOT.classList.add('capture');
            }

            MOVE_CELL.appendChild(DOT);
            
        });
    }


}

export function flip_board(_: Event, board_element: HTMLElement, game: Game) {
    game.board_direction *= -1;
    draw_board(board_element, game);
}

function clear_board(board_element: HTMLElement) {
    Array.from(board_element.childNodes).forEach(square => square.remove());
}