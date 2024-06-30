import { ChessPiece } from "../models/Piece.js";

/**
 * Represents the types of chess pieces.
 */
export type ChessPieces = 'rook' | 'knight' | 'bishop' | 'queen' | 'king' | 'pawn';

/**
 * Represents the color of a chess piece.
 * -1 represents black.
 * 1 represents white.
 */
export type Color = -1 | 1;

/**
 * Represents a square on a chessboard.
 * It can either contain a chess piece or be empty (null).
 */
export type Square = ChessPiece | null;

/**
 * Represents a row in a chessboard.
 * A row is an array of squares.
 */
export type Row = [Square, Square, Square, Square, Square, Square, Square, Square];

/**
 * Represents a chess board.
 * It is an array of 8 rows, where each row is an array of squares.
 */
export type ChessBoard = [Row, Row, Row, Row, Row, Row, Row, Row];

export type Coordinate = [number, number];