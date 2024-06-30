import { Color, ChessBoard, Row, ChessPieces, Coordinate } from '../interfaces/Types.js';

/**
 * Represents a game of chess.
 */
export class Game {
    board: ChessBoard;
    html_board: HTMLElement;
    turn: Color = 1;
    board_direction: Color;
    highlighted_piece: ChessPieces | null = null;
    valid_moves: Coordinate[] | null = null;

    constructor(board_direction: Color, initialBoard: ChessBoard, html_board: HTMLElement) {  
        this.board_direction = board_direction;
        this.html_board = html_board;
        this.board = this.deep_copy_board(initialBoard);
    }

    private deep_copy_board(original: ChessBoard): ChessBoard {
        const copiedBoard = original.map(row =>
            row.map(square => square ? square.clone() : null) as Row
        ) as ChessBoard;
        return copiedBoard;
    }
}