
document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('chessboard');

    if (board) {
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

    let test = document.getElementById('4-4');

    if (test) {
        const img = document.createElement('img');
        img.classList.add('piece');
        img.src = './assets/king-w.svg';
        img.alt = 'white king';
        test.appendChild(img);
    }
})