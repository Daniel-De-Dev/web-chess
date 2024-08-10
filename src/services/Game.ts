import { Game } from "../controllers/Game.js";
import { Color } from "../interfaces/Types.js";
import { BOARD_SIZE } from "../models/Board.js";
import { Pawn, Rook, King } from "../models/Piece.js";
import { draw_board } from "../views/BoardView.js";
import { check_for_check, check_for_end, get_valid_moves } from "./Validation.js";

export function handle_square_click(event: Event, game: Game) {
    const CLICKED_TARGET = event.target as HTMLElement;
    const CELL = event.currentTarget as HTMLElement;

    // If they are unequal means a cell with a piece was clicked
    if (CLICKED_TARGET !== CELL) {
        const TARGET_CLASSES = CLICKED_TARGET.classList;
        if (TARGET_CLASSES.contains('piece')) {

            piece_click(CLICKED_TARGET, CELL, game, 0);

        } else if (TARGET_CLASSES.contains('dot')) { // a dot has been pressed
            
            dot_click(CELL, game, 0);

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

    if (CLICKED_PIECE.color !== game.turn) {
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

function dot_click(cell_element: HTMLElement, game: Game, attempt: number) {

    if (attempt >= 10) {
        console.error('After refreshing 10 times, still cannot fix problem', cell_element, game);
        return;
    }

    const PARTS = cell_element.id.split('-');

    if (PARTS.length !== 2) {
        console.error('did not get expected ID, refreshing and retrying', cell_element);
        draw_board(game.html_board, game);
        setTimeout(() => dot_click(cell_element, game, attempt + 1), 1000);
        return;
    }

    const COLUMN = parseInt(PARTS[0] ?? '-1', 10);
    const ROW = parseInt(PARTS[1] ?? '-1', 10);

    if (!((0 <= COLUMN && COLUMN < BOARD_SIZE) && (0 <= ROW && ROW < BOARD_SIZE))) {
        console.error('did not get valid position values, refreshing and retrying', cell_element);
        draw_board(game.html_board, game);
        setTimeout(() => dot_click(cell_element, game, attempt + 1), 1000);  
        return;
    }

    //! feeling lazy so i wont be doing any validation

    if (!game.highlighted_piece) {
        console.error('???? how you clicking dots without a selected piece?', game);
        return;
    }

    const SELECTED_PIECE_COPY = game.highlighted_piece.clone();
    SELECTED_PIECE_COPY.position = {column: COLUMN, row: ROW};

    const OLD_ROW = game.highlighted_piece.position.row;
    const OLD_COLUMN = game.highlighted_piece.position.column;

    // Logic for deleting the captured piece in case of el passant
    if (SELECTED_PIECE_COPY instanceof Pawn && game.last_double_step) {
        if (ROW === game.last_double_step.position.row + SELECTED_PIECE_COPY.color) {
            const CAPTURED_PAWN_ROW = game.board[game.last_double_step.position.row];
            if (CAPTURED_PAWN_ROW) {
                CAPTURED_PAWN_ROW[game.last_double_step.position.column] = null;
            }
        }
    }

    game.last_double_step = null;

    if (SELECTED_PIECE_COPY instanceof Pawn && (ROW === 4 || ROW === 3) && SELECTED_PIECE_COPY.moved === false) {
        game.last_double_step = SELECTED_PIECE_COPY;
    }

    if ((SELECTED_PIECE_COPY instanceof Pawn || SELECTED_PIECE_COPY instanceof Rook || SELECTED_PIECE_COPY instanceof King)) {
        SELECTED_PIECE_COPY.moved = true;
        if (SELECTED_PIECE_COPY instanceof King) {
            if (game.turn === 1) {
                game.king_w = {column: COLUMN, row: ROW};
            } else {
                game.king_b = {column: COLUMN, row: ROW};
            }
        }
    }

    const PRE_ROW = game.board[OLD_ROW];

    if (!PRE_ROW) {
        console.error('The old position of the selected piece doesnt result in a valid row', game);
        return;
    }

    if (PRE_ROW[OLD_COLUMN]) {
        PRE_ROW[OLD_COLUMN] = null;
    }

    const GAME_ROW = game.board[ROW];

    if (!GAME_ROW) {
        console.error('The new position of the selected piece doenst result in a valid row', game);
        return;
    }

    GAME_ROW[COLUMN] = SELECTED_PIECE_COPY;

    game.check_from = null;
    game.valid_moves = null;
    game.highlighted_piece = null;
    game.turn *= -1;
    game.board_direction = game.turn as Color;

    check_for_check(game);
    check_for_end(game);
    draw_board(game.html_board, game);

}