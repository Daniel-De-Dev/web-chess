import { Game } from "../controllers/Game.js";
import { Coordinate } from "../interfaces/Types.js";
import { BOARD_SIZE } from "../models/Board.js";
import { ChessPiece, King } from "../models/Piece.js";

function is_equal(map_1: Coordinate, map_2: Coordinate): boolean {
    return map_1.column === map_2.column && map_1.row === map_2.row;
}

function coordinate_array_subtraction(array_1: Coordinate[], array_2: Coordinate[]) {
    return array_1.filter(
        (item_1) => !array_2.some((item2) => is_equal(item_1, item2))
    );
}

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

    let clicked_piece_moves = PIECE.get_moves(game, {column: 3, row: 1}, false);

    if (PIECE instanceof King) {
        // The piece is the king, it cannot walk into checks
        game.board.forEach(row => {
            row.forEach(cell => {
                if (cell && cell.color !== PIECE.color) {
                    // its an enemy piece
                    clicked_piece_moves = coordinate_array_subtraction(clicked_piece_moves, cell.get_moves(game, PIECE.position, true))
                }
            })
        })

    } else if (game.check_from) {




        // there is a on going check that needs to dealt with
    } else {
        // logic for forced moves so that a piece does not cause check

    }

    return clicked_piece_moves;
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