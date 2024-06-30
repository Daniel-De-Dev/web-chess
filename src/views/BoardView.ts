import { ChessBoard } from "../interfaces/Types.js";

export function draw_board(board_element: HTMLElement, board: ChessBoard) {
    let i = 0;
    board.forEach(row => {
        row.forEach(_ => {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            if (i % 2 === 0) {
                cell.classList.add('white');
            } else {
                cell.classList.add('black');
            }
            board_element.appendChild(cell);
            i++;
        });
        i++;
    });
}