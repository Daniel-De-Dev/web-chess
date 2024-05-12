
document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('chessboard');

    if (board) {

        board.dataset['highlightedCell'] = "";

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
    let test = document.getElementById('4-4');

    if (test) {
        const img = document.createElement('img');
        img.classList.add('piece');
        img.src = './assets/king-w.svg';
        img.alt = 'white king';
        img.dataset['positionX'] = '4';
        img.dataset['positionY'] = '4';
        img.dataset['piece'] = 'king';
        img.dataset['color'] = 'white';
        test.appendChild(img);
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
    
    // Get the position for the clicked piece
    const posX = parseInt(clickedPiece.dataset['positionX'] ?? "-1", 10);
    const posY = parseInt(clickedPiece.dataset['positionY'] ?? "-1", 10);
    if (posX === -1 || posY === -1) {
        console.error(`Getting the clicked piece's coordinates failed (x,y: ${posX},${posY})`, clickedPiece);
        return;
    }
    
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
        clickedPiece.classList.add('selected');
        board.dataset['highlightedCell'] = `${posX}-${posY}`;

        // Display the pieces legal moves
        displayLegalMoves(clickedPiece);

        return;
    }
}

function displayLegalMoves(piece: HTMLElement) {

    let cellLists: Number[][] = [];
    const pieceType = piece.dataset['piece'];
    if (!pieceType) {
        console.error('The provided piece has no label for itself', piece);
        return;
    }

    const posX = parseInt(piece.dataset['positionX'] ?? "-1", 10);
    const posY = parseInt(piece.dataset['positionY'] ?? "-1", 10);
    if (posX === -1 || posY === -1) {
        console.error(`Getting the clicked piece's coordinates failed (x,y: ${posX},${posY})`, piece);
        return;
    }

    if (pieceType === "king") {
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                if (y === x && x === 1) { //! Check for bounds 
                    continue;
                }
                
                cellLists.push([x+posX-1, y+posY-1]);

            }
        }
    }
    
    // Sliding piece

    // Non-Sliding

    cellLists.forEach(coordinate => {
        const dot = document.createElement('div');
        if (dot) {
            dot.classList.add('dot');
            dot.addEventListener('click', handleDotClick);
            dot.dataset['positionX'] = `${coordinate[0]}`;
            dot.dataset['positionY'] = `${coordinate[1]}`;
            const cell = document.getElementById(`${coordinate[0]}-${coordinate[1]}`);
            if (cell) {
                cell.appendChild(dot);
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

    const originPiece = document.querySelector('.selected') as HTMLElement;
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

    originPiece.classList.remove('selected');
    originPiece.dataset['positionX'] = dotX;
    originPiece.dataset['positionY'] = dotY;
    

    const board = document.getElementById(`chessboard`) as HTMLElement;
    if (board) {
        board.dataset['highlightedCell'] = '';
    }
    

    newCell.appendChild(originPiece);

    const dots = document.querySelectorAll('.dot');

    dots.forEach(dot => {
        dot.remove();    
    });
}