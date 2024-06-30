import { ChessPiece } from "../models/Piece.js";

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

export type Row = [Square, Square, Square, Square, Square, Square, Square, Square];

export type ChessBoard = [Row, Row, Row, Row, Row, Row, Row, Row];
