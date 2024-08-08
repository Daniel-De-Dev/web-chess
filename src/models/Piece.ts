import { Game } from '../controllers/Game.js';
import { Color, Coordinate } from '../interfaces/Types.js';

/**
 * Represents a chess piece.
 */
export abstract class ChessPiece {
    position: Coordinate;
    color: Color;
    constructor(coordinate: Coordinate, color: Color) {
        this.position = {row: coordinate.row, column: coordinate.column};
        this.color = color;
    }
    abstract clone(): ChessPiece;
    abstract get_moves(game: Game, ignore_king: boolean): Coordinate[];
}

export class Rook extends ChessPiece {
    moved: boolean;

    constructor(coordinate: Coordinate, color: Color, moved: boolean) { 
        super(coordinate, color);  
        this.moved = moved; 
    }

    clone(): ChessPiece {
        const CURRENT_POS = {row: this.position.row, column: this.position.column} as Coordinate;
        return new Rook(CURRENT_POS, this.color, this.moved);
    }

    override get_moves(game: Game, ignore_king: boolean): Coordinate[] {
        const DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        const legal_moves: Coordinate[] = [];

        DIRECTIONS.forEach(direction => {
            
            let current_row = this.position.row + direction[0]!;
            let current_column = this.position.column + direction[1]!;
            
            // eslint-disable-next-line no-constant-condition
            while (true) {

                if (current_row <= 0 || current_row >= 8 || current_column <= 0 || current_column >= 8) {
                    // out of bounds
                    break;
                }
                
                const GAME_ROW = game.board[current_row];

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
                    
                    if (!(ignore_king && SQUARE instanceof King)) {
                        // Add capture possibility and stop there
                        legal_moves.push({row: current_row, column: current_row});
                        break;
                    }
                
                }

                legal_moves.push({row: current_row, column: current_row});
                
                current_row += direction[0]!;
                current_column += direction[1]!;
            }
        });

        return legal_moves;
    }
}

export class Knight extends ChessPiece {
    constructor(coordinate: Coordinate, color: Color) { super(coordinate, color); }
    clone(): ChessPiece {
        const CURRENT_POS = {row: this.position.row, column: this.position.column} as Coordinate;
        return new Knight(CURRENT_POS, this.color);
    }

    override get_moves(game: Game, _: boolean): Coordinate[] {
        const MOVES = [[2, -1], [2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2], [1, -2]];

        const legal_moves: Coordinate[] = [];

        MOVES.forEach(move => {
            const current_row = this.position.row + move[0]!;
            const current_column = this.position.column + move[1]!;

            if (current_row >= 0 || current_row < 8 || current_column >= 0 || current_column < 8) {
                
                const GAME_ROW = game.board[current_row];
                
                if (GAME_ROW) {
                    const SQUARE = GAME_ROW[current_column];
                
                    if (!SQUARE || SQUARE.color !== this.color) {
                        legal_moves.push({row: current_row, column: current_row});
                    }
                
                } else {
                    console.error('Not out of bounds, but somehow doesn\'t have a defined row within bounds', game);
                }
            }
        });

        return legal_moves;
    }
}

export class Bishop extends ChessPiece {
    constructor(coordinate: Coordinate, color: Color) { super(coordinate, color); }
    clone(): ChessPiece {
        const CURRENT_POS = {row: this.position.row, column: this.position.column} as Coordinate;
        return new Bishop(CURRENT_POS, this.color);
    }

    override get_moves(game: Game, ignore_king: boolean): Coordinate[] {
        const DIRECTIONS = [[1,1], [-1, 1], [-1, -1], [1, -1]];

        const legal_moves: Coordinate[] = [];

        DIRECTIONS.forEach(direction => {
            
            let current_row = this.position.row + direction[0]!;
            let current_column = this.position.column + direction[1]!;
            
            // eslint-disable-next-line no-constant-condition
            while (true) {

                if (current_row <= 0 || current_row >= 8 || current_column <= 0 || current_column >= 8) {
                    // out of bounds
                    break;
                }
                
                const GAME_ROW = game.board[current_row];

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
                    
                    if (!(ignore_king && SQUARE instanceof King)) {
                        // Add capture possibility and stop there
                        legal_moves.push({row: current_row, column: current_row});
                        break;
                    }
                
                }

                legal_moves.push({row: current_row, column: current_row});
                
                current_row += direction[0]!;
                current_column += direction[1]!;
            }
        });

        return legal_moves;
    }
}

export class Queen extends ChessPiece {
    constructor(coordinate: Coordinate, color: Color) { super(coordinate, color); }
    clone(): ChessPiece {
        const CURRENT_POS = {row: this.position.row, column: this.position.column} as Coordinate;
        return new Queen(CURRENT_POS, this.color);
    }
    
    override get_moves(game: Game, ignore_king: boolean): Coordinate[] {
        const DIRECTIONS = [[1,1], [-1, 1], [-1, -1], [1, -1], [-1, 0], [1, 0], [0, -1], [0, 1]];

        const legal_moves: Coordinate[] = [];

        DIRECTIONS.forEach(direction => {
            
            let current_row = this.position.row + direction[0]!;
            let current_column = this.position.column + direction[1]!;
            
            // eslint-disable-next-line no-constant-condition
            while (true) {

                if (current_row <= 0 || current_row >= 8 || current_column <= 0 || current_column >= 8) {
                    // out of bounds
                    break;
                }
                
                const GAME_ROW = game.board[current_row];

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
                    
                    if (!(ignore_king && SQUARE instanceof King)) {
                        // Add capture possibility and stop there
                        legal_moves.push({row: current_row, column: current_row});
                        break;
                    }
                
                }

                legal_moves.push({row: current_row, column: current_row});
                
                current_row += direction[0]!;
                current_column += direction[1]!;
            }
        });

        return legal_moves;
    }
}

export class King extends ChessPiece {
    moved: boolean;

    constructor(coordinate: Coordinate, color: Color, moved: boolean) { 
        super(coordinate, color); 
        this.moved = moved;
    }
    clone(): ChessPiece {
        const CURRENT_POS = {row: this.position.row, column: this.position.column} as Coordinate;
        return new King(CURRENT_POS, this.color, this.moved);
    }

    override get_moves(game: Game, _: boolean): Coordinate[] {
        const MOVES = [[1,1], [-1, 1], [-1, -1], [1, -1], [-1, 0], [1, 0], [0, -1], [0, 1]];

        const legal_moves: Coordinate[] = [];

        MOVES.forEach(move => {
            const CURRENT_ROW = this.position.row + move[0]!;
            const CURRENT_COLUMN = this.position.column + move[1]!;

            if (CURRENT_ROW >= 0 || CURRENT_ROW < 8 || CURRENT_COLUMN >= 0 || CURRENT_COLUMN < 8) {
                
                const GAME_ROW = game.board[CURRENT_ROW];
                
                if (GAME_ROW) {
                    const SQUARE = GAME_ROW[CURRENT_COLUMN];
                
                    if (!SQUARE || SQUARE.color !== this.color) {
                        legal_moves.push({row: CURRENT_ROW, column: CURRENT_ROW});
                    }
                
                } else {
                    console.error('Not out of bounds, but somehow doesn\'t have a defined row within bounds', game);
                }
            }
        });

        return legal_moves;
    }
}

export class Pawn extends ChessPiece {
    moved: boolean;

    constructor(coordinate: Coordinate, color: Color, moved: boolean) { 
        super(coordinate, color);
        this.moved = moved;
    }
    clone(): ChessPiece {
        const CURRENT_POS = {row: this.position.row, column: this.position.column} as Coordinate;
        return new Pawn(CURRENT_POS, this.color, this.moved);
    }

    override get_moves(game: Game, _: boolean): Coordinate[] {
        const MOVES = [[1, -1], [1,1]];

        const legal_moves: Coordinate[] = [];

        MOVES.forEach(move => {
            const CURRENT_ROW = game.board_direction * (this.position.row + move[0]!);
            const CURRENT_COLUMN = this.position.column + move[1]!;

            if (CURRENT_ROW >= 0 || CURRENT_ROW < 8 || CURRENT_COLUMN >= 0 || CURRENT_COLUMN < 8) {
                
                const GAME_ROW = game.board[CURRENT_ROW];
                
                if (GAME_ROW) {
                    const SQUARE = GAME_ROW[CURRENT_COLUMN];
                
                    if (!SQUARE || SQUARE.color !== this.color) {
                        legal_moves.push({row: CURRENT_ROW, column: CURRENT_ROW});
                    }
                
                } else {
                    console.error('Not out of bounds, but somehow doesn\'t have a defined row within bounds', game);
                }
            }
        });

        //! Need to add double step and el peasant

        return legal_moves;
    }
}