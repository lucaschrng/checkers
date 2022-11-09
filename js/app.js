let checkboard = document.querySelector('.checkboard');

for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        if (i % 2 === 0) {
            if (j % 2 === 1) {
                checkboard.innerHTML += '<div class="pieces piece' + (i * 10 + j) + ' column' + i + ' row' + j + '"><div class="light-piece"></div><div class="brown-piece"></div></div>';              
            } else {
                checkboard.innerHTML += '<div class="pieces piece' + (i * 10 + j) + ' column' + i + ' row' + j + '"></div>';
            }       
        } else {
            if (j % 2 === 0) {
                checkboard.innerHTML += '<div class="pieces piece' + (i * 10 + j) + ' column' + i + ' row' + j + '"><div class="light-piece"></div><div class="brown-piece"></div></div>';              
            } else {
                checkboard.innerHTML += '<div class="pieces piece' + (i * 10 + j) + ' column' + i + ' row' + j + '"></div>';
            }  
        }
    }

}

let board = [
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
]

updateBoard();

function updateBoard() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {

            selector = '.piece' + (i*10 + j);

            if (board[i][j] === 1) {
                document.querySelector(selector).classList.add('light');
            }

            else if (board[i][j] === 2) {
                document.querySelector(selector).classList.add('brown');
            }

            else {
                document.querySelector(selector).classList.remove('light');
                document.querySelector(selector).classList.remove('brown');
            }
        }
    }
}

function checkMove(column, row, color) {
    if (color) {
        
    }
}