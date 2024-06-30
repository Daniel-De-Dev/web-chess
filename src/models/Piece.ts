import { Color } from '../interfaces/Types.js';

/**
 * Represents a chess piece.
 */
export abstract class ChessPiece {
    abstract clone(): ChessPiece;
}

export class Rook extends ChessPiece {
    type = 'rook';
    constructor(public color: Color) { super(); }
    clone(): ChessPiece {
        return new Rook(this.color);
    }
}

export class Knight extends ChessPiece {
    type = 'knight';
    constructor(public color: Color) { super(); }
    clone(): ChessPiece {
        return new Knight(this.color);
    }
}

export class Bishop extends ChessPiece {
    type = 'bishop';
    constructor(public color: Color) { super(); }
    clone(): ChessPiece {
        return new Bishop(this.color);
    }
}

export class Queen extends ChessPiece {
    type = 'queen';
    constructor(public color: Color) { super(); }
    clone(): ChessPiece {
        return new Queen(this.color);
    }
}

export class King extends ChessPiece {
    type = 'king';
    constructor(public color: Color) { super(); }
    clone(): ChessPiece {
        return new King(this.color);
    }
}

export class Pawn extends ChessPiece {
    type = 'pawn';
    constructor(public color: Color) { super(); }
    clone(): ChessPiece {
        return new Pawn(this.color);
    }
}