import { Game } from "../controllers/Game.js";
import { Coordinate, Square } from "../interfaces/Types.js";
import { BOARD_SIZE } from "../models/Board.js";
import { ChessPiece } from "../models/Piece.js";

export function get_valid_moves(coordinate: Coordinate, game: Game) {

    const x = coordinate[0];
    const y = coordinate[1];

    // Validate that the coordinates provided are within the range
    if (x < 0 || x > BOARD_SIZE || y < 0 || y > BOARD_SIZE) {
        console.error('Invalid coordinate value retrieved from cell', coordinate);
        return;
    }

    const ROW = game.board[y];

    if (!ROW) {
        console.error('The boards row is undefine when it should not be', coordinate, game.board);
        return;
    }

    const SQUARE = ROW[x];

    if (!SQUARE) {
        return; //! Reset of highlighted and valid moves may happen here
    }

    const PIECE = SQUARE as ChessPiece;

    


}