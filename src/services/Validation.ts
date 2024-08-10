import { Game } from "../controllers/Game.js";
import { Coordinate } from "../interfaces/Types.js";
import { BOARD_SIZE } from "../models/Board.js";
import { ChessPiece, King, Knight } from "../models/Piece.js";

function is_equal(map_1: Coordinate, map_2: Coordinate): boolean {
    return map_1.column === map_2.column && map_1.row === map_2.row;
}

function coordinate_array_subtraction(array_1: Coordinate[], array_2: Coordinate[]) {
    return array_1.filter(
        (item_1) => !array_2.some((item2) => is_equal(item_1, item2))
    );
}

function coordinate_array_intersection(array_1: Coordinate[], array_2: Coordinate[]) {
    return array_1.filter(
        (item_1) => array_2.some((item_2) => is_equal(item_1, item_2))
    );
}

/*function coordinate_array_union(array_1: Coordinate[], array_2: Coordinate[]): Coordinate[] {
    const combinedArray = [...array_1, ...array_2];
    
    return combinedArray.filter((item, index) =>
        combinedArray.findIndex((other) => is_equal(item, other)) === index
    );
}*/

function coordinate_array_contains(array: Coordinate[], coord: Coordinate): boolean {
    return array.some((item) => is_equal(item, coord));
}

function sign(num: number): number {
    if (num > 0) {
        return 1;
    } else if (num < 0) {
        return -1;
    } else {
        return 0;
    }
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

    let clicked_piece_moves: Coordinate[] = [];
    
    if (PIECE instanceof King) {
        clicked_piece_moves = PIECE.get_moves(game, null);
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
        clicked_piece_moves = PIECE.get_moves(game, null, false)

        const CHECKING_PIECE_POS = game.check_from.position;
        const CHECKED_KING_POS = game.check_from.color === 1 ? game.king_b : game.king_w;

        const VALID_DIRECTION: [number, number] = [sign(CHECKED_KING_POS.column-CHECKING_PIECE_POS.column), sign(CHECKED_KING_POS.row-CHECKING_PIECE_POS.row)]; // This variable contains information on what axis/direction the moves have to be on to be able to block a check

        console.log(VALID_DIRECTION);

        const ALLOWED_BLOCK: Coordinate[] = []

        let current_column = CHECKING_PIECE_POS.column;
        let current_row = CHECKING_PIECE_POS.row;
        ALLOWED_BLOCK.push({row: current_row, column: current_column});
        while (!(current_column === CHECKED_KING_POS.column && current_row === CHECKED_KING_POS.row) && !(game.check_from instanceof Knight)) {
            current_column += VALID_DIRECTION[0];
            current_row += VALID_DIRECTION[1];
            ALLOWED_BLOCK.push({row: current_row, column: current_column});
        }

        clicked_piece_moves = coordinate_array_intersection(clicked_piece_moves, ALLOWED_BLOCK);

        // there is a on going check that needs to dealt with
    } else {
        // logic for forced moves so that a piece does not cause check
        clicked_piece_moves = PIECE.get_moves(game, null, false);
        game.board.forEach(row => {
            row.forEach(cell => {
                if (cell && cell.color !== PIECE.color) {
                    // its an enemy piece
                    const CURRENT_ENEMY_PIECE_MOVES = cell.get_moves(game, PIECE.position, true);
                    CURRENT_ENEMY_PIECE_MOVES.push(cell.position);
                    const PIECE_KING = PIECE.color === 1 ? game.king_w : game.king_b;
                    const ALLOWED_BLOCK: Coordinate[] = [];

                    if (coordinate_array_contains(CURRENT_ENEMY_PIECE_MOVES, PIECE_KING)) {
                        // this piece is pinning down the selected piece

                        const VALID_DIRECTION: [number, number] = [sign(PIECE_KING.column-cell.position.column), sign(PIECE_KING.row-cell.position.row)];
                        let current_column = cell.position.column;
                        let current_row = cell.position.row;
                        while (!(current_column === PIECE_KING.column && current_row === PIECE_KING.row) && !(game.check_from instanceof Knight) ) {
                            ALLOWED_BLOCK.push({row: current_row, column: current_column});
                            current_column += VALID_DIRECTION[0];
                            current_row += VALID_DIRECTION[1];
                        }

                        clicked_piece_moves = coordinate_array_intersection(ALLOWED_BLOCK, clicked_piece_moves);
                    }
                    
                }
            })
        })
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