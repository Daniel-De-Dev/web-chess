import { ChessBoard } from "../interfaces/Types.js";
import { Rook, Knight, Bishop, Queen, King, Pawn } from "./Piece.js";

export const BOARD_SIZE = 8;

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