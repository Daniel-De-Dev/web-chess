import { Game } from "../controllers/Game.js";
import { BOARD_SIZE } from "../models/Board.js";
import { draw_board } from "../views/BoardView.js";
import { get_valid_moves } from "./Validation.js";

export function handle_square_click(event: Event, game: Game) {
    const CLICKED_TARGET = event.target as HTMLElement;
    const CELL = event.currentTarget as HTMLElement;

    // If they are unequal means a cell with a piece was clicked
    if (CLICKED_TARGET !== CELL) {
        const TARGET_CLASSES = CLICKED_TARGET.classList;
        if (TARGET_CLASSES.contains('piece')) {

            piece_click(CLICKED_TARGET, CELL, game, 0);

        } else if (TARGET_CLASSES.contains('dot')) { // a dot has been pressed

            // TODO: Complete dot presses (piece is being moved)
        }

    }
}

/**
 * 
 * @param piece_element HTMLElement of the piece that was clicked on
 * @param cell_element HTMLElement of the cell that was clicked on
 * @param game The game object
 * @returns void
 * 
 * This function is called once a piece is clicked, the functionally is as follows:
 * If no piece is highlighted from before, then it becomes the highlighted one and its possible moves are displayed,
 * If the same piece is clicked, then it becomes un-highlighted
 * if a different piece is clicked, then that new piece gets highlighted
 */
function piece_click(_piece_element: HTMLElement, cell_element: HTMLElement, game: Game, retry_num: number) {
    
    if (retry_num >= 10) {
        console.error('After refreshing 10 times, still cannot fix problem', cell_element, game);
        return;
    }

    const parts = cell_element.id.split('-');

    if (parts.length !== 2) {
        console.error('did not get expected ID, refreshing and retrying', cell_element);
        draw_board(game.html_board, game);
        setTimeout(() => piece_click(_piece_element, cell_element, game, retry_num + 1), 1000);
        return;
    }

    const COLUMN = parseInt(parts[0] ?? '-1', 10);
    const ROW = parseInt(parts[1] ?? '-1', 10);

    if (!((0 <= COLUMN && COLUMN < BOARD_SIZE) && (0 <= ROW && ROW < BOARD_SIZE))) {
        console.error('did not get valid position values, refreshing and retrying', cell_element);
        draw_board(game.html_board, game);
        setTimeout(() => piece_click(_piece_element, cell_element, game, retry_num + 1), 1000);  
        return;
    }

    const CLICKED_ROW = game.board[ROW];

    if (!CLICKED_ROW) {
        console.error(`Coordinate are valid, but row ${ROW} doesn't exist`, game);
        draw_board(game.html_board, game);
        setTimeout(() => piece_click(_piece_element, cell_element, game, retry_num + 1), 1000);  
        return;
    }

    const CLICKED_PIECE = CLICKED_ROW[COLUMN];

    if (!CLICKED_PIECE) {
        console.error(`Coordinate are valid, but the clicked cell does not contain a chesspiece`, game);
        draw_board(game.html_board, game);
        setTimeout(() => piece_click(_piece_element, cell_element, game, retry_num + 1), 1000);  
        return;
    }

    if (game.highlighted_piece === CLICKED_PIECE) {
        // The same piece is highlighted from before, un-highlight it
        game.highlighted_piece = null;
        game.valid_moves = null;
    } else {
        game.highlighted_piece = CLICKED_PIECE;
        game.valid_moves = get_valid_moves({row: ROW, column: COLUMN}, game);
    }

    draw_board(game.html_board, game);
    
    return;
}