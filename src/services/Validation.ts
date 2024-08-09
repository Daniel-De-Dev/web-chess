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

    const moves = PIECE.get_moves(game, {column: 3, row: 1}, false);

    return moves;
}