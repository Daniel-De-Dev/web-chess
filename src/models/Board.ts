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
        new Rook(1), new Knight(1), new Bishop(1), new Queen(1), 
        new King(1), new Bishop(1), new Knight(1), new Rook(1)
    ],
    [
        new Pawn(1), new Pawn(1), new Pawn(1), new Pawn(1), 
        new Pawn(1), new Pawn(1), new Pawn(1), new Pawn(1)
    ],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [
        new Pawn(-1), new Pawn(-1), new Pawn(-1), new Pawn(-1), 
        new Pawn(-1), new Pawn(-1), new Pawn(-1), new Pawn(-1)
    ],
    [
        new Rook(-1), new Knight(-1), new Bishop(-1), new Queen(-1), 
        new King(-1), new Bishop(-1), new Knight(-1), new Rook(-1)
    ]
];