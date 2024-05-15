document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('chessboard');

    //! TODO:
    // Fix that a king can move backwards while still being checked (logic fault that he's blocking himself)
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

    // Add a test piece to the board //! TEMP
    const cell1 = document.getElementById('4-4');

    if (cell1) {
        const kingW = document.createElement('img');
        kingW.classList.add('piece');
        kingW.src = './assets/king-w.svg';
        kingW.alt = 'white king';
        kingW.dataset['positionX'] = '4';
        kingW.dataset['positionY'] = '4';
        kingW.dataset['piece'] = 'king';
        kingW.dataset['color'] = 'white';
        cell1.appendChild(kingW);
    }

    const cell2 = document.getElementById('0-0');

    if (cell2) {
        const kingB = document.createElement('img');
        kingB.classList.add('piece');
        kingB.src = './assets/king-b.svg';
        kingB.dataset['positionX'] = '0';
        kingB.dataset['positionY'] = '0';
        kingB.dataset['piece'] = 'king';
        kingB.dataset['color'] = 'black';
        cell2.appendChild(kingB);
    }

    const cell3 = document.getElementById('0-4');
    
    if (cell3) {
        const rookW = document.createElement('img');
        rookW.classList.add('piece');
        rookW.src = './assets/rook-w.svg';
        rookW.dataset['positionX'] = '0';
        rookW.dataset['positionY'] = '4';
        rookW.dataset['piece'] = 'rook';
        rookW.dataset['color'] = 'white';
        cell3.appendChild(rookW);
    }

    const cell4 = document.getElementById('2-2');
    
    if (cell4) {
        const bishopW = document.createElement('img');
        bishopW.classList.add('piece');
        bishopW.src = './assets/bishop-w.svg';
        bishopW.dataset['positionX'] = '2';
        bishopW.dataset['positionY'] = '2';
        bishopW.dataset['piece'] = 'bishop';
        bishopW.dataset['color'] = 'white';
        cell4.appendChild(bishopW);
    }

    const cell5 = document.getElementById('4-0');
    
    if (cell5) {
        const queenW = document.createElement('img');
        queenW.classList.add('piece');
        queenW.src = './assets/queen-w.svg';
        queenW.dataset['positionX'] = '4';
        queenW.dataset['positionY'] = '0';
        queenW.dataset['piece'] = 'queen';
        queenW.dataset['color'] = 'white';
        cell5.appendChild(queenW);
    }

    const cell6 = document.getElementById('1-2');
    
    if (cell6) {
        const queenW = document.createElement('img');
        queenW.classList.add('piece');
        queenW.src = './assets/knight-w.svg';
        queenW.dataset['positionX'] = '1';
        queenW.dataset['positionY'] = '2';
        queenW.dataset['piece'] = 'knight';
        queenW.dataset['color'] = 'white';
        cell6.appendChild(queenW);
    }

    const cell7 = document.getElementById('1-6');

    if (cell7) {
        const pawnW = document.createElement('img');
        pawnW.classList.add('piece');
        pawnW.src = './assets/pawn-w.svg';
        pawnW.dataset['positionX'] = '1';
        pawnW.dataset['positionY'] = '6';
        pawnW.dataset['firstMove'] = '1';
        pawnW.dataset['piece'] = 'pawn';
        pawnW.dataset['color'] = 'black';
        cell7.appendChild(pawnW);
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

function getPossibleMoves(piece: HTMLElement): Number[][] {
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
            if (cellOccupant) {break};
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
            if (cellOccupant) {break};
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
            if (cellOccupant) {break};
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
            if (cellOccupant) {break};
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
            if (cellOccupant) {break};
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
            if (cellOccupant) {break};
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
            if (cellOccupant) {break};
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
            if (cellOccupant) {break};
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
                if (cellOccupant) {break};
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
                if (cellOccupant) {break};
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
                if (cellOccupant) {break};
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
                if (cellOccupant) {break};
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
                if (cellOccupant) {break};
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
                if (cellOccupant) {break};
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
                if (cellOccupant) {break};
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
                if (cellOccupant) {break};
        }
    } else if (pieceType === 'knight') {
        let cell = document.getElementById(`${posX-1}-${posY-2}`);
        if (cell) {
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
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
        let cell = document.getElementById(`${posX}-${posY-1}`);
        if (cell) {
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            if (!cellOccupant) {
                cellLists.push([posX, posY-1]);
                if (parseInt(piece.dataset['firstMove'] ?? "0", 10)) {
                    cell = document.getElementById(`${posX}-${posY-2}`);
                    if (cell) {
                        const cellOccupant = cell.querySelector('.piece') as HTMLElement;
                        if (!cellOccupant) {
                            cellLists.push([posX, posY-2]);
                        } 
                    }
                }
            } 
        }

        cell = document.getElementById(`${posX-1}-${posY-1}`);
        if (cell) {
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            if (cellOccupant && cellOccupant.dataset['color'] !== piece.dataset['color']) {
                cellLists.push([posX-1, posY-1]);
            } 
        }

        cell = document.getElementById(`${posX+1}-${posY-1}`);
        if (cell) {
            const cellOccupant = cell.querySelector('.piece') as HTMLElement;
            if (cellOccupant && cellOccupant.dataset['color'] !== piece.dataset['color']) {
                cellLists.push([posX+1, posY-1]);
            } 
        }


    }
    return cellLists;
}

function displayMoves(piece: HTMLElement) {

    let cellLists: Number[][] = [];
    
    if (piece.dataset['piece'] === 'king') {
        const allPieces = document.querySelectorAll('.piece');
        let tempList = getPossibleMoves(piece).map(coord => coord.join('-'));
        let allOpponentMoves: String[] = [];
        
        allPieces.forEach(p => {
            const htmlElement = p as HTMLElement;
            if (piece.dataset['color'] !== htmlElement.dataset['color']) {
                allOpponentMoves = [...new Set([...allOpponentMoves, ...getPossibleMoves(htmlElement).map(coord => coord.join('-'))])];
            }
        });
        
        tempList = tempList.filter(value => !allOpponentMoves.includes(value));
        tempList.forEach(s => {
            let value = s.split('-');
            cellLists.push([parseInt(value[0] ?? '-1', 10), parseInt(value[1] ?? '-1', 10)]);
        });
    } else {
        cellLists = getPossibleMoves(piece);
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

    if (clickedDot.dataset['fromPiece'] === 'pawn') {
        originPiece.dataset['firstMove'] = '0';

        if (dotY === '0') {
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