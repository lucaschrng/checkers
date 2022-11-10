//construction of board

let checkboard = document.querySelector('.checkboard');

for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        if (i % 2 === 0) {
            if (j % 2 === 1) {
                checkboard.innerHTML += '<div class="tile black piece' + (i * 10 + j) + ' column' + j + ' row' + i + '"><div class="light-piece"></div><div class="brown-piece"></div></div>';              
            } else {
                checkboard.innerHTML += '<div class="tile white piece' + (i * 10 + j) + ' column' + j + ' row' + i + '"></div>';
            }       
        } else {
            if (j % 2 === 0) {
                checkboard.innerHTML += '<div class="tile black piece' + (i * 10 + j) + ' column' + j + ' row' + i + '"><div class="light-piece"></div><div class="brown-piece"></div></div>';              
            } else {
                checkboard.innerHTML += '<div class="tile white piece' + (i * 10 + j) + ' column' + j + ' row' + i + '"></div>';
            }  
        }
    }

}

//variables initialisation

let tiles = document.querySelectorAll('.tile');
let lastClick;
let whiteTurn = true;
let color;
let moveLevel;
let enemyPosition;
let emptyTiles;
let piece;

let board = [
    // 0: unplayable tile
    // 1: white piece
    // 2: dark piece
    // 3: empty tile
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [3, 0, 3, 0, 3, 0, 3, 0, 3, 0],
    [0, 3, 0, 3, 0, 3, 0, 3, 0, 3],
    [3, 0, 3, 0, 3, 0, 3, 0, 3, 0],
    [0, 3, 0, 3, 0, 3, 0, 3, 0, 3],
    [2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
]

//class initialisation

class Piece {
    constructor(index) {
        this.index = index;
        this.column = getColumn(index);
        this.row = getRow(index);
        this.color = getColor(index);
        this.direction = this.color === 1 ? 1:-1;
        this.possibleMoves = [];
    }

    getPossibleMoves() {

        if (this.color === 1 || this.color === 2) {
    
            if (this.row + this.direction >= 0 && this.row + this.direction <= 10) {
                if (board[this.row + this.direction][this.column - 1] === 3) this.possibleMoves.push([(this.row + this.direction) * 10 + this.column - 1]);
                if (board[this.row + this.direction][this.column + 1] === 3) this.possibleMoves.push([(this.row + this.direction) * 10 + this.column + 1]);
            }

            this.getPossibleCaptures(this.row, this.column, this.color, this.direction, []).forEach(capture => {
                this.possibleMoves.push(capture);
            })
            
        }

        return this.possibleMoves;
    }

    getPossibleCaptures(row, column, color, direction, path) {

        let oppositeColor = color === 1 ? 2:1;

        let referencePath = path;

        let possibleCaptures = [];
        let possibleCaptures2 = [];

        if (row + direction * 2 >= 0 && row + direction * 2 <= 10) {

            if (board[row + direction][column - 1] === oppositeColor) {
                if (board[row + direction * 2][column - 2] === 3) possibleCaptures.push(referencePath.concat([(row + direction * 2) * 10 + column - 2]));
            }
            if (board[row + direction][column + 1] === oppositeColor) {
                if (board[row + direction * 2][column + 2] === 3) possibleCaptures.push(referencePath.concat([(row + direction * 2) * 10 + column + 2]));
            }

            if (possibleCaptures !== []) {
                possibleCaptures.forEach(capture => {
                    let testPiece = new Piece(capture[capture.length - 1]);
                    console.log(testPiece);
                    testPiece.getPossibleCaptures(testPiece.row, testPiece.column, color, direction, capture).forEach(capture2 => {
                        possibleCaptures2.push(capture2);
                    })
                })
            }
        }

        possibleCaptures2.forEach(capture => {
            possibleCaptures.push(capture);
        })

        return possibleCaptures;
    }
}

//add event listeners

tiles.forEach((tile, index) => {
    tile.addEventListener('click', () => {
        lastClick = index;
        piece = new Piece(index);
        console.log(piece.getPossibleMoves());
    })
})

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

function getColumn(index) {
    return index % 10;
}

function getRow(index) {
    return Math.floor(index / 10);
}

function getColor(index) {
    column = getColumn(index);
    row = getRow(index);
    return board[row][column];
}