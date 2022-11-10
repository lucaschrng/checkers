//construction of board

let boardSize = 8;

let checkboard = document.querySelector('.checkboard');
let scores = document.querySelectorAll('.score p');
let instructions = document.querySelector('.instructions');

for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
        if (i % 2 === 0) {
            if (j % 2 === 1) {
                checkboard.innerHTML += '<div class="tile black piece' + (i * boardSize + j) + '"><div class="light-piece"></div><div class="brown-piece"></div></div>';              
            } else {
                checkboard.innerHTML += '<div class="tile white piece' + (i * boardSize + j) + '"></div>';
            }       
        } else {
            if (j % 2 === 0) {
                checkboard.innerHTML += '<div class="tile black piece' + (i * boardSize + j) + '"><div class="light-piece"></div><div class="brown-piece"></div></div>';              
            } else {
                checkboard.innerHTML += '<div class="tile white piece' + (i * boardSize + j) + '"></div>';
            }  
        }
    }
}

//variables initialisation

let tiles = document.querySelectorAll('.tile');
let whiteTurn = true;
let previewPiece;
let previewMoves = [];
let lightPoints = 0;
let brownPoints = 0;
let gameOver = false;

let board = [
    // 0: unplayable tile
    // 1: white piece
    // 2: dark piece
    // 3: empty tile
    // 4: white preview
    // 5: dark preview
    // 6: white queen
    // 7: dark queen
    // [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    // [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    // [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    // [3, 0, 3, 0, 3, 0, 3, 0, 3, 0],
    // [0, 3, 0, 3, 0, 3, 0, 3, 0, 3],
    // [3, 0, 3, 0, 3, 0, 3, 0, 3, 0],
    // [0, 3, 0, 3, 0, 3, 0, 3, 0, 3],
    // [2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
    // [0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
    // [2, 0, 2, 0, 2, 0, 2, 0, 2, 0]
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [3, 0, 3, 0, 3, 0, 3, 0],
    [0, 3, 0, 3, 0, 3, 0, 3],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
]

//class initialisation

class Piece {
    constructor(index) {
        this.index = index;
        this.column = index % boardSize;
        this.row = Math.floor(index / boardSize);
        this.color = board[this.row][this.column];
        this.direction = this.color === 1 ? 1:-1;
        this.targets = [];
        this.possibleMoves = this.getPossibleMoves();
    }

    getPossibleMoves() {

        let moves = []

        if (this.color === 1 || this.color === 2) {
    
            if (this.row + this.direction >= 0 && this.row + this.direction <= boardSize) {
                if (board[this.row + this.direction][this.column - 1] === 3) moves.push([(this.row + this.direction) * boardSize + this.column - 1]);
                if (board[this.row + this.direction][this.column + 1] === 3) moves.push([(this.row + this.direction) * boardSize + this.column + 1]);
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

        if (row + direction * 2 >= 0 && row + direction * 2 < boardSize) {

            if (column - 1 >=  0 && column - 1 < boardSize)
            if (board[row + direction][column - 1] === oppositeColor) {
                if (board[row + direction * 2][column - 2] === 3) possibleCaptures.push(referencePath.concat([(row + direction * 2) * boardSize + column - 2]));
            }
            if (board[row + direction][column + 1] === oppositeColor) {
                if (board[row + direction * 2][column + 2] === 3) possibleCaptures.push(referencePath.concat([(row + direction * 2) * boardSize + column + 2]));
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

let piece = new Piece(0);
let selecetdPiece = new Piece(0);

//add event listeners

tiles.forEach((tile, index) => {
    tile.addEventListener('click', () => {

        if (!gameOver) {
            if (previewMoves.includes(index)) {
                play(piece, index);
            } else {
                selecetdPiece = new Piece(index);
    
                if ((selecetdPiece.color === 1 && whiteTurn) || (selecetdPiece.color === 2 && !whiteTurn)) {
                    piece = selecetdPiece;
                    preview();
                }
            }
        } else {
            updateInstructions();
        }
    })
})

updateBoard();
updateInstructions();

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
                board[move.row][move.column] = pieceA.color;

                if (Math.abs(departurePiece.row - move.row) > 1) {
                    let targetRow = (departurePiece.row + move.row) / 2;
                    let targetColumn = (departurePiece.column + move.column) / 2;
    
                    board[targetRow][targetColumn] = 3;
                }
            
                previewMoves = [];

                departurePiece = move;
            
                updateBoard();
            })
        }
    })

    whiteTurn = !whiteTurn;

    updateInstructions();
}

function updateBoard() {

    lightPoints = boardSize / 2 * 3;
    brownPoints = boardSize / 2 * 3;

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {

            selector = '.piece' + (i * boardSize + j);

            if (board[i][j] === 1) {
                document.querySelector(selector).classList.add('light');
                document.querySelector(selector).classList.remove('brown');
                document.querySelector(selector).classList.remove('preview-light');
                document.querySelector(selector).classList.remove('preview-brown');

                lightPoints--;
            }

            else if (board[i][j] === 2) {
                document.querySelector(selector).classList.remove('light');
                document.querySelector(selector).classList.add('brown');
                document.querySelector(selector).classList.remove('preview-light');
                document.querySelector(selector).classList.remove('preview-brown');

                brownPoints--;
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

    scores[0].innerHTML = lightPoints;
    scores[1].innerHTML = brownPoints;

    if (lightPoints === boardSize / 2 * 3 || brownPoints === boardSize / 2 * 3) {
        gameOver = true;
    }
}

function updateInstructions() {
    if (!gameOver) {
        if (whiteTurn) {
            instructions.classList.add('light-turn');
            instructions.classList.remove('brown-turn');
            instructions.classList.remove('light-win');
            instructions.classList.remove('brown-win');
        } else {
            instructions.classList.remove('light-turn');
            instructions.classList.add('brown-turn');
            instructions.classList.remove('light-win');
            instructions.classList.remove('brown-win');
        }
    } else {
        if (lightPoints < 15) {
            instructions.classList.remove('light-turn');
            instructions.classList.remove('brown-turn');
            instructions.classList.add('light-win');
            instructions.classList.remove('brown-win');
        } else {
            instructions.classList.remove('light-turn');
            instructions.classList.remove('brown-turn');
            instructions.classList.remove('light-win');
            instructions.classList.add('brown-win');
        }
    }
}