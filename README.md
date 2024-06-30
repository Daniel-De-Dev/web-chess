# web-chess

## The chess game

### Implementation

#### Chess board

The board will be represented as 2D array, where `(0,0)` represents the bottom left corner of the board and
moving horizontally right increases the first index and moving vertically up increases the second index.
Resulting in the familiar coordinate system we love. The range of the `x` and `y` axis will be `0-7` which
will allow us to represent the board as the 8 by 8 square it is.

The `Board` type is defined as 2D array of `Squares`

#### Board Squares

The board squares represent the state of a given square within a board. It's defined as a type that either contains a `ChessPiece` object or is `null`.

#### Pieces

All chess pieces are their own class that inherits from the abstract class `ChessPiece`.
