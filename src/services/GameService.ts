import { Game } from "../controllers/Game.js";
import { draw_board } from "../views/BoardView.js";
import { get_valid_moves } from "./ValidationService.js";

export function handle_square_click(event: Event, game: Game) {
    const CLICKED_TARGET = event.target as HTMLElement;
    const CELL = event.currentTarget as HTMLElement;

    // If they are unequal means a cell with a piece was clicked
    if (CLICKED_TARGET !== CELL) {
        const TARGET_CLASSES = CLICKED_TARGET.classList;
        if (TARGET_CLASSES.contains('piece')) {

            piece_click(CLICKED_TARGET, CELL, game);

        } else if (TARGET_CLASSES.contains('dot')) { // a dot has been pressed


        }

    }
}

function piece_click(piece_element: HTMLElement, cell_element: HTMLElement, game: Game) {

    // Clear board in case some piece is highlighted
    //! Might not be need and could be removed
    if (game.highlighted_piece !== null) {
        game.highlighted_piece = null;
        game.valid_moves = null;
        draw_board(game.html_board, game);
    }

    const parts = cell_element.id.split('-');

    if (parts.length !== 2) {
        console.error('did not get expected ID, refreshing and retrying', cell_element);
        draw_board(game.html_board, game);
        setTimeout(() => piece_click(piece_element, cell_element, game), 1000);
        return;
    }

    const x = parseInt(parts[0] ?? '-1', 10);
    const y = parseInt(parts[1] ?? '-1', 10);
    
    get_valid_moves([x,y], game);
}