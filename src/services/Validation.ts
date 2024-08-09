import { Game } from "../controllers/Game.js";
import { Coordinate } from "../interfaces/Types.js";
import { BOARD_SIZE } from "../models/Board.js";
import { ChessPiece } from "../models/Piece.js";

export function get_valid_moves(coordinate: Coordinate, game: Game): Coordinate[] | null {

    const COLUMN_INDEX = coordinate.column;
    const ROW_INDEX = coordinate.row;

    // Validate that the coordinates provided are within the range
    if (COLUMN_INDEX < 0 || COLUMN_INDEX > BOARD_SIZE || ROW_INDEX < 0 || ROW_INDEX > BOARD_SIZE) {
        console.error('Invalid coordinate value retrieved from cell', coordinate);
        return null;
    }

    const ROW = game.board[ROW_INDEX];

    if (!ROW) {
        console.error('The boards row is undefine when it should not be', coordinate, game.board);
        return null;
    }

    const SQUARE = ROW[COLUMN_INDEX];

    if (!SQUARE) {
        return null; //! Reset of highlighted and valid moves may happen here
    }

    // Plan is to get all possible moves for the current piece selected
    const PIECE = SQUARE as ChessPiece;

    const CLICKED_PIECE_MOVES = PIECE.get_moves(game, {column: 3, row: 1}, false);



    return CLICKED_PIECE_MOVES;
}

export function check_for_check(game: Game) {

    const LAST_MOVE_COLOR = game.turn * -1 // Assume that the color has been changed to next
    const CURRENT_MOVE_KING = game.turn === 1 ? game.king_w : game.king_b;

    game.board.forEach(row => {
        row.forEach(cell => {
            if (cell && cell.color === LAST_MOVE_COLOR) {
                // We have encountered a piece from the player that made the previous move
                const POSSIBLE_MOVES = cell.get_moves(game, null, false);
                POSSIBLE_MOVES.forEach(coordinate => {
                    if (coordinate.column === CURRENT_MOVE_KING.column && coordinate.row === CURRENT_MOVE_KING.row) {
                        // the king is being threatened and its a check                        
                        game.check_from = cell;
                    }
                });
            }
        });
    });


}