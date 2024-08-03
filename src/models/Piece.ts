import { Game } from '../controllers/Game.js';
import { ChessPieces, Color, Coordinate } from '../interfaces/Types.js';

/**
 * Represents a chess piece.
 */
export abstract class ChessPiece {
    type: ChessPieces;
    color: Color;
    constructor(type: ChessPieces, color: Color) {
        this.type = type;
        this.color = color;
    }
    abstract clone(): ChessPiece;
    abstract get_moves(pos: Coordinate, game: Game, ignore_king: boolean): Coordinate[];
}

export class Rook extends ChessPiece {
    moved: boolean

    constructor(color: Color, moved: boolean) { 
        super('rook', color); 
        this.moved = moved; 
    }

    clone(): ChessPiece {
        return new Rook(this.color, this.moved);
    }

    override get_moves(pos: Coordinate, game: Game, ignore_king: boolean): Coordinate[] {
        const DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        let valid_moves: Coordinate[] = [];

        DIRECTIONS.forEach(direction => {
            
            let current_row = pos.row + direction[0]!;
            let current_column = pos.column + direction[1]!;
            
            while (true) {

                if (current_row <= 0 || current_row >= 8 || current_column <= 0 || current_column >= 8) {
                    // out of bounds
                    break;
                }
                
                const GAME_ROW = game.board[current_row]

                if (!GAME_ROW) {
                    console.error('Not out of bounds, but somehow doesn\'t have a defined row within bounds', game);
                    break;
                }

                const SQUARE = GAME_ROW[current_column];

                if (SQUARE) { 
                    if (SQUARE.color == this.color) {
                        // Cant capture its own piece
                        break;
                    }
                    
                    if (!(ignore_king && SQUARE.type === 'king')) {
                        // Add capture possibility and stop there
                        valid_moves.push({row: current_row, column: current_row});
                        break;
                    }
                
                }

                valid_moves.push({row: current_row, column: current_row});
                
                current_row += direction[0]!;
                current_column += direction[1]!;
            }
        });

        return valid_moves;
    }
}

export class Knight extends ChessPiece {
    constructor(color: Color) { super('knight', color); }
    clone(): ChessPiece {
        return new Knight(this.color);
    }

    override get_moves(pos: Coordinate, game: Game, _: boolean): Coordinate[] {
        const MOVES = [[2, -1], [2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2], [1, -2]]

        let valid_moves: Coordinate[] = [];

        MOVES.forEach(move => {
            const current_row = pos.row + move[0]!;
            const current_column = pos.column + move[1]!;

            if (current_row >= 0 || current_row < 8 || current_column >= 0 || current_column < 8) {
                
                const GAME_ROW = game.board[current_row]
                
                if (GAME_ROW) {
                    const SQUARE = GAME_ROW[current_column];
                
                    if (!SQUARE || SQUARE.color !== this.color) {
                        valid_moves.push({row: current_row, column: current_row});
                    }
                
                } else {
                    console.error('Not out of bounds, but somehow doesn\'t have a defined row within bounds', game);
                }
            }
        })

        return valid_moves;
    }
}

export class Bishop extends ChessPiece {
    constructor(color: Color) { super('bishop', color); }
    clone(): ChessPiece {
        return new Bishop(this.color);
    }

    override get_moves(pos: Coordinate, game: Game, ignore_king: boolean): Coordinate[] {
        const DIRECTIONS = [[1,1], [-1, 1], [-1, -1], [1, -1]];

        let valid_moves: Coordinate[] = [];

        DIRECTIONS.forEach(direction => {
            
            let current_row = pos.row + direction[0]!;
            let current_column = pos.column + direction[1]!;
            
            while (true) {

                if (current_row <= 0 || current_row >= 8 || current_column <= 0 || current_column >= 8) {
                    // out of bounds
                    break;
                }
                
                const GAME_ROW = game.board[current_row]

                if (!GAME_ROW) {
                    console.error('Not out of bounds, but somehow doesn\'t have a defined row within bounds', game);
                    break;
                }

                const SQUARE = GAME_ROW[current_column];

                if (SQUARE) { 
                    if (SQUARE.color == this.color) {
                        // Cant capture its own piece
                        break;
                    }
                    
                    if (!(ignore_king && SQUARE.type === 'king')) {
                        // Add capture possibility and stop there
                        valid_moves.push({row: current_row, column: current_row});
                        break;
                    }
                
                }

                valid_moves.push({row: current_row, column: current_row});
                
                current_row += direction[0]!;
                current_column += direction[1]!;
            }
        });

        return valid_moves;
    }
}

export class Queen extends ChessPiece {
    constructor(color: Color) { super('queen', color); }
    clone(): ChessPiece {
        return new Queen(this.color);
    }
    
    override get_moves(pos: Coordinate, game: Game, ignore_king: boolean): Coordinate[] {
        const DIRECTIONS = [[1,1], [-1, 1], [-1, -1], [1, -1], [-1, 0], [1, 0], [0, -1], [0, 1]];

        let valid_moves: Coordinate[] = [];

        DIRECTIONS.forEach(direction => {
            
            let current_row = pos.row + direction[0]!;
            let current_column = pos.column + direction[1]!;
            
            while (true) {

                if (current_row <= 0 || current_row >= 8 || current_column <= 0 || current_column >= 8) {
                    // out of bounds
                    break;
                }
                
                const GAME_ROW = game.board[current_row]

                if (!GAME_ROW) {
                    console.error('Not out of bounds, but somehow doesn\'t have a defined row within bounds', game);
                    break;
                }

                const SQUARE = GAME_ROW[current_column];

                if (SQUARE) { 
                    if (SQUARE.color == this.color) {
                        // Cant capture its own piece
                        break;
                    }
                    
                    if (!(ignore_king && SQUARE.type === 'king')) {
                        // Add capture possibility and stop there
                        valid_moves.push({row: current_row, column: current_row});
                        break;
                    }
                
                }

                valid_moves.push({row: current_row, column: current_row});
                
                current_row += direction[0]!;
                current_column += direction[1]!;
            }
        });

        return valid_moves;
    }
}

export class King extends ChessPiece {
    moved: boolean

    constructor(color: Color, moved: boolean) { 
        super('king', color); 
        this.moved = moved;
    }
    clone(): ChessPiece {
        return new King(this.color, this.moved);
    }

    override get_moves(pos: Coordinate, game: Game, _: boolean): Coordinate[] {
        const MOVES = [[1,1], [-1, 1], [-1, -1], [1, -1], [-1, 0], [1, 0], [0, -1], [0, 1]];

        let valid_moves: Coordinate[] = [];

        MOVES.forEach(move => {
            const CURRENT_ROW = pos.row + move[0]!;
            const CURRENT_COLUMN = pos.column + move[1]!;

            if (CURRENT_ROW >= 0 || CURRENT_ROW < 8 || CURRENT_COLUMN >= 0 || CURRENT_COLUMN < 8) {
                
                const GAME_ROW = game.board[CURRENT_ROW]
                
                if (GAME_ROW) {
                    const SQUARE = GAME_ROW[CURRENT_COLUMN];
                
                    if (!SQUARE || SQUARE.color !== this.color) {
                        valid_moves.push({row: CURRENT_ROW, column: CURRENT_ROW});
                    }
                
                } else {
                    console.error('Not out of bounds, but somehow doesn\'t have a defined row within bounds', game);
                }
            }
        })

        return valid_moves;
    }
}

export class Pawn extends ChessPiece {
    moved: boolean;

    constructor(color: Color, moved: boolean) { 
        super('pawn', color);
        this.moved = moved;
    }
    clone(): ChessPiece {
        return new Pawn(this.color, this.moved);
    }

    override get_moves(pos: Coordinate, game: Game, _: boolean): Coordinate[] {
        const MOVES = [[1, -1], [1,1]]

        let valid_moves: Coordinate[] = [];

        MOVES.forEach(move => {
            const CURRENT_ROW = game.board_direction * (pos.row + move[0]!);
            const CURRENT_COLUMN = pos.column + move[1]!;

            if (CURRENT_ROW >= 0 || CURRENT_ROW < 8 || CURRENT_COLUMN >= 0 || CURRENT_COLUMN < 8) {
                
                const GAME_ROW = game.board[CURRENT_ROW]
                
                if (GAME_ROW) {
                    const SQUARE = GAME_ROW[CURRENT_COLUMN];
                
                    if (!SQUARE || SQUARE.color !== this.color) {
                        valid_moves.push({row: CURRENT_ROW, column: CURRENT_ROW});
                    }
                
                } else {
                    console.error('Not out of bounds, but somehow doesn\'t have a defined row within bounds', game);
                }
            }
        });

        //! Need to add double step and el peasant

        return valid_moves;
    }
}