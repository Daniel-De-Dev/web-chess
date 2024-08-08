import { ChessBoard } from "../interfaces/Types.js";
import { Rook, Knight, Bishop, Queen, King, Pawn } from "./Piece.js";

/**
 * The size of the chess board.
 */
export const BOARD_SIZE = 8;

/**
 * Represents the starting chess board configuration.
 * 
 * @remarks
 * The `START_BOARD` constant is a 2D array that represents the initial positions of chess pieces on the board.
 * Each element in the array represents a square on the board, and can contain either a chess piece object or `null` if the square is empty.
 * The array follows the standard chess board layout, with the first element representing the top-left square (A1) and the last element representing the bottom-right square (H8).
 * 
 * @type {ChessBoard}
 */
export const START_BOARD: ChessBoard = [
    [
        new Rook({row: 0, column: 0}, 1, false), new Knight({row: 0, column: 1}, 1), new Bishop({row: 0, column: 2}, 1), new Queen({row: 0, column: 3}, 1), 
        new King({row: 0, column: 4}, 1, false), new Bishop({row: 0, column: 5}, 1), new Knight({row: 0, column: 6}, 1), new Rook({row: 0, column: 7}, 1, false)
    ],
    [
        new Pawn({row: 1, column: 0}, 1, false), new Pawn({row: 1, column: 1}, 1, false), new Pawn({row: 1, column: 2}, 1, false), new Pawn({row: 1, column: 3}, 1, false), 
        new Pawn({row: 1, column: 4}, 1, false), new Pawn({row: 1, column: 5}, 1, false), new Pawn({row: 1, column: 6}, 1, false), new Pawn({row: 1, column: 7}, 1, false)
    ],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [
        new Pawn({row: 6, column: 0}, -1, false), new Pawn({row: 6, column: 1}, -1, false), new Pawn({row: 6, column: 2}, -1, false), new Pawn({row: 6, column: 3}, -1, false), 
        new Pawn({row: 6, column: 4}, -1, false), new Pawn({row: 6, column: 5}, -1, false), new Pawn({row: 6, column: 6}, -1, false), new Pawn({row: 6, column: 7}, -1, false)
    ],
    [
        new Rook({row: 7, column: 0}, -1, false), new Knight({row: 7, column: 1}, -1), new Bishop({row: 7, column: 2}, -1), new Queen({row: 7, column: 3}, -1), 
        new King({row: 7, column: 4}, -1, false), new Bishop({row: 7, column: 5}, -1), new Knight({row: 7, column: 6}, -1), new Rook({row: 7, column: 7}, -1, false)
    ]
];