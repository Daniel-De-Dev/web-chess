import { ChessPieces, Color } from '../interfaces/Types.js';

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
}

export class Rook extends ChessPiece {
    constructor(color: Color) { super('rook', color); }
    clone(): ChessPiece {
        return new Rook(this.color);
    }
}

export class Knight extends ChessPiece {
    constructor(color: Color) { super('knight', color); }
    clone(): ChessPiece {
        return new Knight(this.color);
    }
}

export class Bishop extends ChessPiece {
    constructor(color: Color) { super('bishop', color); }
    clone(): ChessPiece {
        return new Bishop(this.color);
    }
}

export class Queen extends ChessPiece {
    constructor(color: Color) { super('queen', color); }
    clone(): ChessPiece {
        return new Queen(this.color);
    }
}

export class King extends ChessPiece {
    constructor(color: Color) { super('king', color); }
    clone(): ChessPiece {
        return new King(this.color);
    }
}

export class Pawn extends ChessPiece {
    constructor(color: Color) { super('pawn', color); }
    clone(): ChessPiece {
        return new Pawn(this.color);
    }
}