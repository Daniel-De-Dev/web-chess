# web-chess

## The chess game

To begin with the main plan is to implement a functioning chess game, which then will be extended to support multiplayer.

### Implementation

#### Chess board

The board will be represented as 2D array, where the coordinate `row: 0` and `column: 0` represents the bottom left corner of the board. Moving horizontally right increases the `column` index and moving vertically up increases the `row` index.
Resulting in the familiar coordinate system we love. The range of the `column` and `row` axis will be `0-7` which
will allow us to represent the board as the 8 by 8 square it is.

![chessboard with coordinates](assets/chessboard_coordinate_illustration.svg)

The `Board` type is defined as 2D array of `Squares` which can either contain `null` or a `ChessPiece`

> **Note**: in cases where the coordinate is represented in the format `x,y` then interpret `column: x` and `row: y`

#### Flipping the board

In order to achieve the flipping of the board, which is a necessary feature for local games. I aimed for the simplistic method of just adding conditions for controlling the sequence in which the squares of the board get rendered. This way i can leave the actual matrix stored in the chess game object alone in the background, maintaining its integredy and simply clearing the screen and rendering the board in an opposite sequennce.

#### Board Squares

The board squares represent the state of a given square within a board. It's defined as a type that either contains a `ChessPiece` object or is `null`.

#### Pieces

All chess pieces are their own class that inherits from the abstract class `ChessPiece`.
