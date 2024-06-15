document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('chessboard');

    //! TODO:
    // Idea for pinning moves
    // A piece needs to be checked for its moving will result in a check
    // Board will know when a active check exists, it will only allow moves to avoid check or block check
    // Need to handle edge case where piece could capture the checking piece
    //1. Add Checks
    //2. Add Add logic for forced check moves
    //3. Add Castling (also check logic)
    //4. Add Pawn Special Move (also check logic)
    //5. Add Opposite pawn movement logic
    //6. Flip board function 

    if (board) {

        board.dataset['highlightedCell'] = '';
        board.dataset['direction'] = '1'

        // Generate each cell of the board
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const cell = document.createElement('div');
                cell.id = `${col}-${row}`;
                cell.classList.add('cell');
                
                if ((row + col) % 2 === 0) {
                    cell.classList.add('white');
                } else {
                    cell.classList.add('black');
                }
                
                board.appendChild(cell);
            }
        }
    }

    const startBoard: { [key: string]: string } = {
        "0-0" : "rook",
        "1-0" : "knight",
        "2-0" : "bishop",
        "3-0" : "queen", 
        "4-0" : "king",
        "5-0" : "bishop",
        "6-0" : "knight",
        "7-0" : "rook",
        "0-1" : "pawn",
        "1-1" : "pawn",
        "2-1" : "pawn",
        "3-1" : "pawn", 
        "4-1" : "pawn",
        "5-1" : "pawn",
        "6-1" : "pawn",
        "7-1" : "pawn",
        "0-7" : "rook",
        "1-7" : "knight",
        "2-7" : "bishop",
        "3-7" : "queen", 
        "4-7" : "king",
        "5-7" : "bishop",
        "6-7" : "knight",
        "7-7" : "rook",
        "0-6" : "pawn",
        "1-6" : "pawn",
        "2-6" : "pawn",
        "3-6" : "pawn", 
        "4-6" : "pawn",
        "5-6" : "pawn",
        "6-6" : "pawn",
        "7-6" : "pawn",
    };

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const pieceName = startBoard[`${col}-${row}`]
            if (pieceName !== undefined) {
                const cell = document.getElementById(`${col}-${row}`)
                if (cell) {
                    const color = row<5 ? 'black' : 'white';
                    const piece = document.createElement('img');
                    piece.classList.add('piece');
                    piece.src = `./assets/${pieceName}-${color[0]}.svg`;
                    piece.alt = `${color} ${pieceName}`;
                    piece.dataset['positionX'] = `${col}`;
                    piece.dataset['positionY'] = `${row}`;
                    piece.dataset['piece'] = `${pieceName}`;
                    piece.dataset['color'] = `${color}`;
                    if (pieceName === 'pawn') {
                        piece.dataset['firstMove'] = '1';
                    }
                    cell.appendChild(piece);
                }
            }
        }
    }

    // Add Click event to all pieces on board
    const pieces = document.querySelectorAll('.piece');
    pieces.forEach(piece => {
        piece.addEventListener('click', handlePieceClick);
    });

    // Add click event to all cells
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
});

function handlePieceClick(event: Event) {
    const clickedPiece = event.target as HTMLElement;
    
    const board = document.getElementById('chessboard');
    if (!board) {
        console.error('couldn\'t get the Chessboard Element');
        return;
    }
    
    // Get the what the current highlighted cell on the board is
    const highlighted_cell = board.dataset['highlightedCell'];
    if (highlighted_cell === undefined) {
        console.error('Failed to retrieve data of highlighted cell from chessboard', board);
        return;
    } 
    
    if (highlighted_cell.length === 0) {
        // There are no actively highlighted cells on the board
        event.stopPropagation(); // Prevent other events from getting triggered

        // Get the position for the clicked piece
        const posX = parseInt(clickedPiece.dataset['positionX'] ?? "-1", 10);
        const posY = parseInt(clickedPiece.dataset['positionY'] ?? "-1", 10);
        if (posX === -1 || posY === -1) {
            console.error(`Getting the clicked piece's coordinates failed (x,y: ${posX},${posY})`, clickedPiece);
            return;
        }

        clickedPiece.classList.add('selected');
        board.dataset['highlightedCell'] = `${posX}-${posY}`;

        // Display the pieces legal moves
        displayMoves(clickedPiece);
    }
}

function getPossibleMoves(piece: HTMLElement, overLookKing: Boolean): Number[][] {
    let cellLists: Number[][] = [];
    
    const pieceType = piece.dataset['piece'];
    if (!pieceType) {
        console.error('The provided piece has no label for itself', piece);
        return [];
    }

    const posX = parseInt(piece.dataset['positionX'] ?? "-1", 10);
    const posY = parseInt(piece.dataset['positionY'] ?? "-1", 10);
    if (posX === -1 || posY === -1) {
        console.error(`Getting the clicked piece's coordinates failed (x,y: ${posX},${posY})`, piece);
        return [];
    }
    
    if (pieceType === 'king') { //! Add king blocked moves later
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                const cell = document.getElementById(`${x+posX-1}-${y+posY-1}`);
                if (cell) {
                    cellLists.push([x+posX-1, y+posY-1]);
                }
            }
        }
    } else if (pieceType === 'rook') {

        let lastPos = [posX, posY];
        while (true) {
            lastPos[1]--;
            const cell = document.getElementById(`${lastPos[0]}-${lastPos[1]}`);
            if (!cell) {
                break; // We are out of bounds
            }
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            cellLists.push([Number(lastPos[0]), Number(lastPos[1])]);
            if (overLookKing && cellOccupant && cellOccupant.dataset['piece'] === 'king' && piece.dataset['color'] !== cellOccupant.dataset['color']) {
                continue;
            } else if (cellOccupant) {break};
        }

        lastPos = [posX, posY];

        while (true) {
            lastPos[0]++;
            const cell = document.getElementById(`${lastPos[0]}-${lastPos[1]}`);
            if (!cell) {
                break; // We are out of bounds
            }
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            cellLists.push([Number(lastPos[0]), Number(lastPos[1])]);
            
            if (overLookKing && cellOccupant && cellOccupant.dataset['piece'] === 'king' && piece.dataset['color'] !== cellOccupant.dataset['color']) {
                continue;
            } else if (cellOccupant) {break};
        }

        lastPos = [posX, posY];

        while (true) {
            lastPos[1]++;
            const cell = document.getElementById(`${lastPos[0]}-${lastPos[1]}`);
            if (!cell) {
                break; // We are out of bounds
            }
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            cellLists.push([Number(lastPos[0]), Number(lastPos[1])]);
            if (overLookKing && cellOccupant && cellOccupant.dataset['piece'] === 'king' && piece.dataset['color'] !== cellOccupant.dataset['color']) {
                continue;
            } else if (cellOccupant) {break};
        }

        lastPos = [posX, posY];

        while (true) {
            lastPos[0]--;
            const cell = document.getElementById(`${lastPos[0]}-${lastPos[1]}`);
            if (!cell) {
                break; // We are out of bounds
            }
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            cellLists.push([Number(lastPos[0]), Number(lastPos[1])]);
            if (overLookKing && cellOccupant && cellOccupant.dataset['piece'] === 'king' && piece.dataset['color'] !== cellOccupant.dataset['color']) {
                continue;
            } else if (cellOccupant) {break};
        }
    } else if (pieceType === 'bishop') {

        let lastPos = [posX, posY];
        while (true) {
            lastPos[1]--;
            lastPos[0]++;
            const cell = document.getElementById(`${lastPos[0]}-${lastPos[1]}`);
            if (!cell) {
                break; // We are out of bounds
            }
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            cellLists.push([Number(lastPos[0]), Number(lastPos[1])]);
            if (overLookKing && cellOccupant && cellOccupant.dataset['piece'] === 'king' && piece.dataset['color'] !== cellOccupant.dataset['color']) {
                continue;
            } else if (cellOccupant) {break};
        }

        lastPos = [posX, posY];

        while (true) {
            lastPos[1]++
            lastPos[0]++;
            const cell = document.getElementById(`${lastPos[0]}-${lastPos[1]}`);
            if (!cell) {
                break; // We are out of bounds
            }
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            cellLists.push([Number(lastPos[0]), Number(lastPos[1])]);
            if (overLookKing && cellOccupant && cellOccupant.dataset['piece'] === 'king' && piece.dataset['color'] !== cellOccupant.dataset['color']) {
                continue;
            } else if (cellOccupant) {break};
        }

        lastPos = [posX, posY];

        while (true) {
            lastPos[1]++;
            lastPos[0]--;
            const cell = document.getElementById(`${lastPos[0]}-${lastPos[1]}`);
            if (!cell) {
                break; // We are out of bounds
            }
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            cellLists.push([Number(lastPos[0]), Number(lastPos[1])]);
            if (overLookKing && cellOccupant && cellOccupant.dataset['piece'] === 'king' && piece.dataset['color'] !== cellOccupant.dataset['color']) {
                continue;
            } else if (cellOccupant) {break};
        }

        lastPos = [posX, posY];

        while (true) {
            lastPos[1]--;
            lastPos[0]--;
            const cell = document.getElementById(`${lastPos[0]}-${lastPos[1]}`);
            if (!cell) {
                break; // We are out of bounds
            }
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            cellLists.push([Number(lastPos[0]), Number(lastPos[1])]);
            if (overLookKing && cellOccupant && cellOccupant.dataset['piece'] === 'king' && piece.dataset['color'] !== cellOccupant.dataset['color']) {
                continue;
            } else if (cellOccupant) {break};
        }

    } else if (pieceType === 'queen') {
        let lastPos = [posX, posY];
        while (true) {
            lastPos[1]--;
            const cell = document.getElementById(`${lastPos[0]}-${lastPos[1]}`);
            if (!cell) {
                break; // We are out of bounds
            }
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            cellLists.push([Number(lastPos[0]), Number(lastPos[1])]);
            if (overLookKing && cellOccupant && cellOccupant.dataset['piece'] === 'king' && piece.dataset['color'] !== cellOccupant.dataset['color']) {
                continue;
            } else if (cellOccupant) {break};
        }

        lastPos = [posX, posY];

        while (true) {
            lastPos[0]++;
            const cell = document.getElementById(`${lastPos[0]}-${lastPos[1]}`);
            if (!cell) {
                break; // We are out of bounds
            }
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            cellLists.push([Number(lastPos[0]), Number(lastPos[1])]);
            if (overLookKing && cellOccupant && cellOccupant.dataset['piece'] === 'king' && piece.dataset['color'] !== cellOccupant.dataset['color']) {
                continue;
            } else if (cellOccupant) {break};
        }

        lastPos = [posX, posY];

        while (true) {
            lastPos[1]++;
            const cell = document.getElementById(`${lastPos[0]}-${lastPos[1]}`);
            if (!cell) {
                break; // We are out of bounds
            }
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            cellLists.push([Number(lastPos[0]), Number(lastPos[1])]);
            if (overLookKing && cellOccupant && cellOccupant.dataset['piece'] === 'king' && piece.dataset['color'] !== cellOccupant.dataset['color']) {
                continue;
            } else if (cellOccupant) {break};
        }

        lastPos = [posX, posY];

        while (true) {
            lastPos[0]--;
            const cell = document.getElementById(`${lastPos[0]}-${lastPos[1]}`);
            if (!cell) {
                break; // We are out of bounds
            }
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            cellLists.push([Number(lastPos[0]), Number(lastPos[1])]);
            if (overLookKing && cellOccupant && cellOccupant.dataset['piece'] === 'king' && piece.dataset['color'] !== cellOccupant.dataset['color']) {
                continue;
            } else if (cellOccupant) {break};
        }

        lastPos = [posX, posY];
        while (true) {
            lastPos[1]--;
            lastPos[0]++;
            const cell = document.getElementById(`${lastPos[0]}-${lastPos[1]}`);
            if (!cell) {
                break; // We are out of bounds
            }
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            cellLists.push([Number(lastPos[0]), Number(lastPos[1])]);
            if (overLookKing && cellOccupant && cellOccupant.dataset['piece'] === 'king' && piece.dataset['color'] !== cellOccupant.dataset['color']) {
                continue;
            } else if (cellOccupant) {break};
        }

        lastPos = [posX, posY];

        while (true) {
            lastPos[1]++
            lastPos[0]++;
            const cell = document.getElementById(`${lastPos[0]}-${lastPos[1]}`);
            if (!cell) {
                break; // We are out of bounds
            }
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            cellLists.push([Number(lastPos[0]), Number(lastPos[1])]);
            if (overLookKing && cellOccupant && cellOccupant.dataset['piece'] === 'king' && piece.dataset['color'] !== cellOccupant.dataset['color']) {
                continue;
            } else if (cellOccupant) {break};
        }

        lastPos = [posX, posY];

        while (true) {
            lastPos[1]++;
            lastPos[0]--;
            const cell = document.getElementById(`${lastPos[0]}-${lastPos[1]}`);
            if (!cell) {
                break; // We are out of bounds
            }
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            cellLists.push([Number(lastPos[0]), Number(lastPos[1])]);
            if (overLookKing && cellOccupant && cellOccupant.dataset['piece'] === 'king' && piece.dataset['color'] !== cellOccupant.dataset['color']) {
                continue;
            } else if (cellOccupant) {break};
        }

        lastPos = [posX, posY];

        while (true) {
            lastPos[1]--;
            lastPos[0]--;
            const cell = document.getElementById(`${lastPos[0]}-${lastPos[1]}`);
            if (!cell) {
                break; // We are out of bounds
            }
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            cellLists.push([Number(lastPos[0]), Number(lastPos[1])]);
            if (overLookKing && cellOccupant && cellOccupant.dataset['piece'] === 'king' && piece.dataset['color'] !== cellOccupant.dataset['color']) {
                continue;
            } else if (cellOccupant) {break};
        }
    } else if (pieceType === 'knight') {
        let cell = document.getElementById(`${posX-1}-${posY-2}`);
        if (cell) {
                cellLists.push([posX-1, posY-2]);
        }

        cell = document.getElementById(`${posX+1}-${posY-2}`);
        if (cell) {
                cellLists.push([posX+1, posY-2]);
        }

        cell = document.getElementById(`${posX+2}-${posY-1}`);
        if (cell) {
                cellLists.push([posX+2, posY-1]);
        }

        cell = document.getElementById(`${posX+2}-${posY+1}`);
        if (cell) {
                cellLists.push([posX+2, posY+1]);
        }

        cell = document.getElementById(`${posX+1}-${posY+2}`);
        if (cell) {
                cellLists.push([posX+1, posY+2]);
        }

        cell = document.getElementById(`${posX-1}-${posY+2}`);
        if (cell) {
                cellLists.push([posX-1, posY+2]);
        }

        cell = document.getElementById(`${posX-2}-${posY+1}`);
        if (cell) {
                cellLists.push([posX-2, posY+1]);
        }

        cell = document.getElementById(`${posX-2}-${posY-1}`);
        if (cell) {
                cellLists.push([posX-2, posY-1]);
        }
    } else if (pieceType === 'pawn') {
        const board = document.getElementById('chessboard');
        if (!board) {
            console.error(`couldn't get the board element`);
            return [[]];
        }
        const boardDir = parseInt(board.dataset['direction'] ?? "0", 10)
        const colorDir = piece.dataset['color'] === 'white' ? 1 : -1
        let cell = document.getElementById(`${posX}-${posY-1*boardDir*colorDir}`);
        if (cell) {
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            if (!cellOccupant) {
                cellLists.push([posX, posY-1*boardDir*colorDir]);
                if (parseInt(piece.dataset['firstMove'] ?? "0", 10)) {
                    cell = document.getElementById(`${posX}-${posY-2*boardDir*colorDir}`);
                    if (cell) {
                        const cellOccupant = cell.querySelector('.piece') as HTMLElement;
                        if (!cellOccupant) {
                            cellLists.push([posX, posY-2*boardDir*colorDir]);
                        } 
                    }
                }
            } 
        }

        cell = document.getElementById(`${posX-1}-${posY-1*boardDir*colorDir}`);
        if (cell) {
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            if (cellOccupant && cellOccupant.dataset['color'] !== piece.dataset['color']) {
                cellLists.push([posX-1, posY-1*boardDir*colorDir]);
            } 
        }

        cell = document.getElementById(`${posX+1}-${posY-1*boardDir*colorDir}`);
        if (cell) {
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            if (cellOccupant && cellOccupant.dataset['color'] !== piece.dataset['color']) {
                cellLists.push([posX+1, posY-1*boardDir*colorDir]);
            } 
        }


    }
    return cellLists;
}

function displayMoves(piece: HTMLElement) {

    let cellLists: Number[][] = [];
    
    if (piece.dataset['piece'] === 'king') {
        const allPieces = document.querySelectorAll('.piece');
        let tempList = getPossibleMoves(piece, false).map(coord => coord.join('-'));
        let allOpponentMoves: String[] = [];
        
        allPieces.forEach(p => {
            const htmlElement = p as HTMLElement;
            if (piece.dataset['color'] !== htmlElement.dataset['color']) {
                allOpponentMoves = [...new Set([...allOpponentMoves, ...getPossibleMoves(htmlElement, true).map(coord => coord.join('-'))])];
            }
        });
        
        tempList = tempList.filter(value => !allOpponentMoves.includes(value));
        tempList.forEach(s => {
            let value = s.split('-');
            cellLists.push([parseInt(value[0] ?? '-1', 10), parseInt(value[1] ?? '-1', 10)]);
        });
    } else {
        cellLists = getPossibleMoves(piece, false);
    }

    cellLists.forEach(coordinate => {
        const dot = document.createElement('div');
        if (dot) {
            dot.classList.add('dot');
            dot.addEventListener('click', handleDotClick);
            dot.dataset['positionX'] = `${coordinate[0]}`;
            dot.dataset['positionY'] = `${coordinate[1]}`;
            dot.dataset['fromPiece'] = `${piece.dataset['piece']}`;
            const cell = document.getElementById(`${coordinate[0]}-${coordinate[1]}`);
            if (cell) {

                const cellOccupant = cell.querySelector('.piece') as HTMLElement;
                if (cellOccupant && cellOccupant.dataset['color'] !== piece.dataset['color']) {
                    // an enemy is located on this cell
                    dot.classList.add('capture');
                    cell.appendChild(dot);
                } else if (!cellOccupant) {
                    // empty cell
                    cell.appendChild(dot);
                }
            }
        }
    });
}

function handleCellClick() {
    const board = document.getElementById('chessboard');
    if (!board) {
        console.error('couldn\'t get the Chessboard Element');
        return;
    }

    const highlighted_cell = board.dataset['highlightedCell'];
    if (highlighted_cell === undefined) {
        console.error('Failed to retrieve data of highlighted cell from chessboard', board);
        return;
    }

    const cell = document.getElementById(highlighted_cell);
    if (cell) {
        const cellPiece = cell.querySelector('.piece');
        if (cellPiece) {
            cellPiece.classList.remove('selected');        
            board.dataset['highlightedCell'] = '';
            
            const dots = document.querySelectorAll('.dot');

            dots.forEach(dot => {
                dot.remove();    
            });
        }
    }
}
    
function handleDotClick(event: Event) {
    event.stopPropagation(); 

    const clickedDot = event.target as HTMLElement;

    const originPiece = document.querySelector('.selected') as HTMLImageElement;
    if (!originPiece) {
        console.error('failed to find a element with the class "selected"', clickedDot);
        return;
    }

    const dotX = clickedDot.dataset['positionX'];
    const dotY = clickedDot.dataset['positionY'];

    if (dotX === undefined) {
        console.error('Failed to retrieve a dots X position', clickedDot);
        return;
    }

    if (dotY === undefined) {
        console.error('Failed to retrieve a dots y position', clickedDot);
        return;
    }

    const newCell = document.getElementById(`${dotX}-${dotY}`);
    if (!newCell) {
        console.error('For some reason no such cell exists', clickedDot);
        return;
    }

    // Promote pawn to queen
    if (clickedDot.dataset['fromPiece'] === 'pawn') {
        originPiece.dataset['firstMove'] = '0';

        const board = document.getElementById('chessboard');
        if (!board) {
            console.error(`couldn't get the board element`);
            return;
        }

        const boardDir = parseInt(board.dataset['direction'] ?? "0", 10)
        const colorDir = originPiece.dataset['color'] === 'white' ? 1 : -1
        const correctEnd = boardDir*colorDir
        if (correctEnd === 0) {
            console.error('Something went wrong when trying to retrieve the boardDir');
            return;
        }

        if ((dotY === '0' && correctEnd === 1) || (dotY === '7' && correctEnd === -1)) {
            originPiece.dataset['firstMove'] = '';
            originPiece.dataset['piece'] = 'queen'
            originPiece.src = `./assets/queen-${(originPiece.dataset['color'] ?? 'w')[0]}.svg`;
        }
    }

    originPiece.classList.remove('selected');
    originPiece.dataset['positionX'] = dotX;
    originPiece.dataset['positionY'] = dotY;
    

    const board = document.getElementById(`chessboard`) as HTMLElement;
    if (board) {
        board.dataset['highlightedCell'] = '';
    }
    
    if (clickedDot.classList.contains('capture')) {
        const enemyPiece = newCell.querySelector('.piece');
        if (enemyPiece) {
            enemyPiece.remove();
        }        
    }
    
    newCell.appendChild(originPiece);

    const dots = document.querySelectorAll('.dot');

    dots.forEach(dot => {
        dot.remove();    
    });
} 