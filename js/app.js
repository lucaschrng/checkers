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
let whiteTurn = true;
let piece;
let selecetd;
let previewPiece;
let previewMoves = [];
let targetColumn;
let targetRow;

let board = [
    // 0: unplayable tile
    // 1: white piece
    // 2: dark piece
    // 3: empty tile
    // 4: white preview
    // 5: dark preview
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
        this.column = index % 10;
        this.row = Math.floor(index / 10);
        this.color = board[this.row][this.column];
        this.direction = this.color === 1 ? 1:-1;
        this.targets = [];
        this.possibleMoves = this.getPossibleMoves();
    }

    getPossibleMoves() {

        let moves = []

        if (this.color === 1 || this.color === 2) {
    
            if (this.row + this.direction >= 0 && this.row + this.direction <= 10) {
                if (board[this.row + this.direction][this.column - 1] === 3) moves.push([(this.row + this.direction) * 10 + this.column - 1]);
                if (board[this.row + this.direction][this.column + 1] === 3) moves.push([(this.row + this.direction) * 10 + this.column + 1]);
            }

            this.getPossibleCaptures(this.row, this.column, this.color, this.direction, []).forEach(capture => {
                moves.push(capture);
            })
            
        }

        return moves;
    }

    getPossibleCaptures(row, column, color, direction, path) {

        let oppositeColor = color === 1 ? 2:1;

        let referencePath = path;

        let possibleCaptures = [];
        let possibleCaptures2 = [];

        if (row + direction * 2 >= 0 && row + direction * 2 < 10) {

            if (column - 1 >=  0 && column - 1 < 10)
            if (board[row + direction][column - 1] === oppositeColor) {
                if (board[row + direction * 2][column - 2] === 3) possibleCaptures.push(referencePath.concat([(row + direction * 2) * 10 + column - 2]));
            }
            if (board[row + direction][column + 1] === oppositeColor) {
                if (board[row + direction * 2][column + 2] === 3) possibleCaptures.push(referencePath.concat([(row + direction * 2) * 10 + column + 2]));
            }

            if (possibleCaptures !== []) {
                possibleCaptures.forEach(capture => {
                    let testPiece = new Piece(capture[capture.length - 1]);
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

        if (previewMoves.includes(index)) {
            play(piece, index);
        } else {
            piece = new Piece(index);
            console.log(piece.targets);

            if ((piece.color === 1 && whiteTurn) || (piece.color === 2 && !whiteTurn)) {
                preview();
            }
        }
    })
})

updateBoard();

function preview() {

    previewMoves = [];

    updateBoard();

    piece.possibleMoves.forEach(moves => {
        moves.forEach(move => {

            if (!previewMoves.includes(move)) {
                previewMoves.push(move);
            }
        })
    })

    previewMoves.forEach(move => {
        previewPiece = new Piece(move);
        board[previewPiece.row][previewPiece.column] = whiteTurn ? 4:5;
    })

    updateBoard();

    previewMoves.forEach(move => {
        previewPiece = new Piece(move);
        board[previewPiece.row][previewPiece.column] = 3;
    })
}

function play(pieceA, pointB) {

    departurePiece = new Piece(pieceA.index);

    pieceA.possibleMoves.forEach(moves => {
        if (moves.includes(pointB)) {
            moves.forEach(move => {

                move = new Piece(move);

                board[departurePiece.row][departurePiece.column] = 3;
                board[move.row][move.column] = whiteTurn ? 1:2;

                if (Math.abs(departurePiece.row - move.row) > 1) {
                    targetRow = (departurePiece.row + move.row) / 2;
                    targetColumn = (departurePiece.column + move.column) / 2;
    
                    board[targetRow][targetColumn] = 3;
                }
            
                previewMoves = [];

                departurePiece = move;
            
                updateBoard();
            })
        }
    })

    whiteTurn = !whiteTurn;
}

function updateBoard() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {

            selector = '.piece' + (i*10 + j);

            if (board[i][j] === 1) {
                document.querySelector(selector).classList.add('light');
                document.querySelector(selector).classList.remove('brown');
                document.querySelector(selector).classList.remove('preview-light');
                document.querySelector(selector).classList.remove('preview-brown');
            }

            else if (board[i][j] === 2) {
                document.querySelector(selector).classList.remove('light');
                document.querySelector(selector).classList.add('brown');
                document.querySelector(selector).classList.remove('preview-light');
                document.querySelector(selector).classList.remove('preview-brown');
            }

            else if (board[i][j] === 4) {
                document.querySelector(selector).classList.remove('light');
                document.querySelector(selector).classList.remove('brown');
                document.querySelector(selector).classList.add('preview-light');
                document.querySelector(selector).classList.remove('preview-brown');
            }

            else if (board[i][j] === 5) {
                document.querySelector(selector).classList.remove('light');
                document.querySelector(selector).classList.remove('brown');
                document.querySelector(selector).classList.remove('preview-light');
                document.querySelector(selector).classList.add('preview-brown');
            }

            else {
                document.querySelector(selector).classList.remove('light');
                document.querySelector(selector).classList.remove('brown');
                document.querySelector(selector).classList.remove('preview-light');
                document.querySelector(selector).classList.remove('preview-brown');
            }
        }
    }
}