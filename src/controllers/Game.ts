import { Color, ChessBoard, Row } from '../interfaces/Types.js';

export class Game {
    board: ChessBoard;
    turn: Color = 1;
    board_direction: Color;
    constructor(board_direction: Color, initialBoard: ChessBoard) {  
        this.board_direction = board_direction;
        this.board = this.deep_copy_board(initialBoard);
    }

    private deep_copy_board(original: ChessBoard): ChessBoard {
        const copiedBoard = original.map(row =>
            row.map(square => square ? square.clone() : null) as Row
        ) as ChessBoard;
        return copiedBoard;
    }
}