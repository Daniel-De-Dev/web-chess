import { Game } from '../controllers/Game.js';
import { Color, Coordinate } from '../interfaces/Types.js';
import { BOARD_SIZE } from './Board.js';

//! More check, pinning and forced moves logic needed

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
    abstract get_moves(game: Game, ignore_cell: Coordinate | null, king_pov: boolean): Coordinate[];
}

function sliding_piece_moves(game: Game, ignore_cell: Coordinate | null, directions: [number, number][], piece: ChessPiece, king_pov: boolean): Coordinate[] {

    const MOVES: Coordinate[] = [];

    directions.forEach(direction => {
        let current_column = piece.position.column + direction[0]!;
        let current_row = piece.position.row + direction[1];

        let blocked_path = false;

        while (!blocked_path && ((0 <= current_row && current_row < BOARD_SIZE) && (0 <= current_column && current_column < BOARD_SIZE))) {
            // The coordinates are valid within range of the board and no piece has been encountered yet
            
            const FETCHED_ROW = game.board[current_row];

            if (!FETCHED_ROW) {
                console.error('Row was within valid range, but didn\'t fetch a defined row', game);
                break;
            }

            const FETCHED_SQUARE = FETCHED_ROW[current_column];

            if (FETCHED_SQUARE) {
                // There is a piece on this square

                blocked_path = true;

                if ((piece.color !== FETCHED_SQUARE.color) || king_pov) {
                    // The piece in question has a different color, hence a valid capture
                    MOVES.push({column: current_column, row: current_row});

                    if (ignore_cell && ignore_cell.row === current_row && ignore_cell.column === current_column) {
                        blocked_path = false;
                    }
                }

            } else {
                // Square is empty
                MOVES.push({column: current_column, row: current_row});
            }
            
            current_column += direction[0];
            current_row += direction[1];
        }

    });

    return MOVES;
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

    override get_moves(game: Game, ignore_cell: Coordinate | null, king_pov: boolean): Coordinate[] {
        const DIRECTIONS: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        return sliding_piece_moves(game, ignore_cell, DIRECTIONS, this, king_pov);
    }
}

export class Knight extends ChessPiece {
    constructor(coordinate: Coordinate, color: Color) { super(coordinate, color); }
    clone(): ChessPiece {
        const CURRENT_POS = {row: this.position.row, column: this.position.column} as Coordinate;
        return new Knight(CURRENT_POS, this.color);
    }

    override get_moves(game: Game, _: Coordinate | null, king_pov: boolean): Coordinate[] {
        const POSITIONS: [number, number][] = [[2, -1], [2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2], [1, -2]]; // In this case the moves are just squares to check if they are free or occupied by opposing color

        const MOVES: Coordinate[] = [];

        POSITIONS.forEach(position => {
            const CURRENT_COLUMN = this.position.column + position[0];
            const CURRENT_ROW = this.position.row + position[1];

            if ((0 <= CURRENT_ROW && CURRENT_ROW < BOARD_SIZE) && (0 <= CURRENT_COLUMN && CURRENT_COLUMN < BOARD_SIZE)) {

                const FETCHED_ROW = game.board[CURRENT_ROW];

                if (FETCHED_ROW) {
                    const FETCHED_SQUARE = FETCHED_ROW[CURRENT_COLUMN];

                    if (!FETCHED_SQUARE || (FETCHED_SQUARE && FETCHED_SQUARE.color !== this.color) || king_pov) {
                        // Either square is free or occupied by an enemy
                        MOVES.push({column: CURRENT_COLUMN, row: CURRENT_ROW});
                    }
                    
                } else {
                    console.error('Row was within valid range, but didn\'t fetch a defined row', game);
                }
            }
        });

        return MOVES;
    }
}

export class Bishop extends ChessPiece {
    constructor(coordinate: Coordinate, color: Color) { super(coordinate, color); }
    clone(): ChessPiece {
        const CURRENT_POS = {row: this.position.row, column: this.position.column} as Coordinate;
        return new Bishop(CURRENT_POS, this.color);
    }

    override get_moves(game: Game, ignore_cell: Coordinate | null, king_pov: boolean): Coordinate[] {
        const DIRECTIONS: [number, number][] = [[1,1], [-1, 1], [-1, -1], [1, -1]];

        return sliding_piece_moves(game, ignore_cell, DIRECTIONS, this, king_pov);
    }
}

export class Queen extends ChessPiece {
    constructor(coordinate: Coordinate, color: Color) { super(coordinate, color); }
    clone(): ChessPiece {
        const CURRENT_POS = {row: this.position.row, column: this.position.column} as Coordinate;
        return new Queen(CURRENT_POS, this.color);
    }
    
    override get_moves(game: Game, ignore_cell: Coordinate | null, king_pov: boolean): Coordinate[] {
        const DIRECTIONS: [number, number][] = [[1,1], [-1, 1], [-1, -1], [1, -1], [-1, 0], [1, 0], [0, -1], [0, 1]];
        
        return sliding_piece_moves(game, ignore_cell, DIRECTIONS, this, king_pov);  
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

    override get_moves(game: Game, _: Coordinate | null): Coordinate[] {
        //! Castling logic needed


        const POSITIONS: [number, number][] = [[1,1], [-1, 1], [-1, -1], [1, -1], [-1, 0], [1, 0], [0, -1], [0, 1]];
        
        const MOVES: Coordinate[] = [];

        POSITIONS.forEach(position => {
            const CURRENT_COLUMN = this.position.column + position[0];
            const CURRENT_ROW = this.position.row + position[1];

        if ((0 <= CURRENT_ROW && CURRENT_ROW < BOARD_SIZE) && (0 <= CURRENT_COLUMN && CURRENT_COLUMN < BOARD_SIZE)) {

                const FETCHED_ROW = game.board[CURRENT_ROW];

                if (FETCHED_ROW) {
                    const FETCHED_SQUARE = FETCHED_ROW[CURRENT_COLUMN];

                    if (!FETCHED_SQUARE || (FETCHED_SQUARE && FETCHED_SQUARE.color !== this.color)) {
                        // Either square is free or occupied by an enemy
                        MOVES.push({column: CURRENT_COLUMN, row: CURRENT_ROW});
                    }
                    
                } else {
                    console.error('Row was within valid range, but didn\'t fetch a defined row', game);
                }
            }
        });

        return MOVES;
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

    override get_moves(game: Game, _: Coordinate | null, king_pov: boolean): Coordinate[] {
        //! El passant logic needed 

        const POSITIONS_CAPTURE: [number, number][] = [[1, 1], [-1, 1]];
        
        const MOVES: Coordinate[] = [];
        const DIRECTION = 1 * this.color;

        POSITIONS_CAPTURE.forEach(position => {
            const CURRENT_COLUMN = this.position.column + (position[0] * DIRECTION);
            const CURRENT_ROW = this.position.row + (position[1] * DIRECTION);

            if ((0 <= CURRENT_ROW && CURRENT_ROW < BOARD_SIZE) && (0 <= CURRENT_COLUMN && CURRENT_COLUMN < BOARD_SIZE)) {

                const FETCHED_ROW = game.board[CURRENT_ROW];

                if (FETCHED_ROW) {
                    const FETCHED_SQUARE = FETCHED_ROW[CURRENT_COLUMN];

                    if ((FETCHED_SQUARE && FETCHED_SQUARE.color !== this.color) || king_pov) {
                        // occupied by an enemy and can hence be captured
                        MOVES.push({column: CURRENT_COLUMN, row: CURRENT_ROW});
                    }
                    
                } else {
                    console.error('Row was within valid range, but didn\'t fetch a defined row', game);
                }
            }
        });


        let current_row = this.position.row + DIRECTION;
        let front_is_free = false;

        if ((0 <= current_row && current_row < BOARD_SIZE) && (0 <= this.position.column && this.position.column < BOARD_SIZE) && !king_pov) {
            // Pawn single move forward
            const FETCHED_ROW = game.board[current_row];

            if (FETCHED_ROW) {
                const FETCHED_SQUARE = FETCHED_ROW[this.position.column];

                if (!FETCHED_SQUARE) {
                    // unoccupied cell
                    MOVES.push({column: this.position.column, row: current_row});
                    front_is_free = true;
                }
                
            } else {
                console.error('Row was within valid range, but didn\'t fetch a defined row', game);
            }
        }

        if (front_is_free && !this.moved) {
            current_row += DIRECTION;

            if ((0 <= current_row && current_row < BOARD_SIZE) && (0 <= this.position.column && this.position.column < BOARD_SIZE)) {
                // Pawn double move forward
                const FETCHED_ROW = game.board[current_row];
    
                if (FETCHED_ROW) {
                    const FETCHED_SQUARE = FETCHED_ROW[this.position.column];
    
                    if (!FETCHED_SQUARE) {
                        // unoccupied cell
                        MOVES.push({column: this.position.column, row: current_row});
                    }
                    
                } else {
                    console.error('Row was within valid range, but didn\'t fetch a defined row', game);
                }
            }
        }

        // El passant logic
        if (game.last_double_step && (game.last_double_step.position.column === this.position.column + 1 || game.last_double_step.position.column === this.position.column - 1) && game.last_double_step.position.row === this.position.row && game.last_double_step.color !== this.color) {
            // There is a possible legal capture
            MOVES.push({column: game.last_double_step.position.column, row: game.last_double_step.position.row + DIRECTION})
        }

        return MOVES;
    }
}