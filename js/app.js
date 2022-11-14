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

// let anim = anime({
//     targets: '.piece17 .light-piece',
//     translate: '9vh 9vh',
//     duration: 500,
//     easing: 'easeInOutSine'
// })

// setTimeout(() => {
//     anim.pause;
//     document.querySelector('.piece17 .light-piece').style.translate = '0 0';
// }, 500);

//variables initialisation

let tiles = document.querySelectorAll('.tile');
let whiteTurn = true;
let oppositeColor;
let previewPiece;
let previewMoves = [];
let lightPoints = 0;
let brownPoints = 0;
let gameOver = false;
let tileStates = ['light', 'brown', 'preview-light', 'preview-brown', 'light-queen', 'brown-queen'];
let instructionsStates = ['light-turn', 'brown-turn', 'light-win', 'brown-win'];

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
    [2, 0, 2, 0, 2, 0, 2, 0]
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

        if (this.color === 6 || this.color === 7) {
            this.direction = 1;
        }

        if (this.color === 1 || this.color === 2 || this.color === 6 || this.color === 7) {
    
            if (this.row + this.direction >= 0 && this.row + this.direction < boardSize) {
                if (board[this.row + this.direction][this.column - 1] === 3) moves.push([(this.row + this.direction) * boardSize + this.column - 1]);
                if (board[this.row + this.direction][this.column + 1] === 3) moves.push([(this.row + this.direction) * boardSize + this.column + 1]);
            }

            if (this.color === 6 || this.color === 7) {
                if (this.row - 1 >= 0 && this.row - 1 < boardSize) {
                    if (board[this.row - this.direction][this.column - 1] === 3) moves.push([(this.row - this.direction) * boardSize + this.column - 1]);
                    if (board[this.row - this.direction][this.column + 1] === 3) moves.push([(this.row - this.direction) * boardSize + this.column + 1]);
                }
            }

            this.getPossibleCaptures(this.row, this.column, this.color, this.direction, []).forEach(capture => {
                moves.push(capture);
            })

        }

        return moves;
    }

    getPossibleCaptures(row, column, color, direction, path) {

        oppositeColor = [];

        if (color === 1 || color === 6) {
            oppositeColor = [2, 7]
        }
        if (color === 2 || color === 7) {
            oppositeColor = [1, 6]
        }

        let possibleCaptures = [];
        let possibleCaptures2 = [];

        if (row + direction * 2 >= 0 && row + direction * 2 < boardSize) {

            if (column - 2 >=  0 && column - 2 < boardSize) {
                if (oppositeColor.includes(board[row + direction][column - 1])) {
                    if (board[row + direction * 2][column - 2] === 3 && !path.includes((row + direction * 2) * boardSize + column - 2)) possibleCaptures.push(path.concat([(row + direction * 2) * boardSize + column - 2]));
                }
            }
    
            if (column + 2 >=  0 && column + 2 < boardSize) {
                if (oppositeColor.includes(board[row + direction][column + 1])) {
                    if (board[row + direction * 2][column + 2] === 3 && !path.includes((row + direction * 2) * boardSize + column + 2)) possibleCaptures.push(path.concat([(row + direction * 2) * boardSize + column + 2]));
                }
            }
        }
        
        if (color === 6 || color === 7) {

            if (row - direction * 2 >= 0 && row - direction * 2 < boardSize) {
                
            if (column - 2 >=  0 && column - 2 < boardSize) {
                if (oppositeColor.includes(board[row - direction][column - 1])) {
                    if (board[row - direction * 2][column - 2] === 3 && !path.includes((row - direction * 2) * boardSize + column - 2)) possibleCaptures.push(path.concat([(row - direction * 2) * boardSize + column - 2]));
                }
            }
    
            if (column + 2 >=  0 && column + 2 < boardSize) {
                if (oppositeColor.includes(board[row - direction][column + 1])) {
                    if (board[row - direction * 2][column + 2] === 3 && !path.includes((row - direction * 2) * boardSize + column + 2)) possibleCaptures.push(path.concat([(row - direction * 2) * boardSize + column + 2]));
                }
            }
            }
        }

        if (possibleCaptures !== []) {
            possibleCaptures.forEach((capture) => {
                let testPiece = new Piece(capture[capture.length - 1]);
                testPiece.getPossibleCaptures(testPiece.row, testPiece.column, color, direction, capture).forEach(capture2 => {
                    possibleCaptures2.push(capture2);
                })
            })
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
    
                if (((selecetdPiece.color === 1 || selecetdPiece.color === 6) && whiteTurn) || ((selecetdPiece.color === 2 || selecetdPiece.color === 7) && !whiteTurn)) {
                    piece = selecetdPiece;
                    preview();
                }
            }
        } else {
            updateInstructions();
        }
    })

    tile.addEventListener('mouseenter', () => {

        let hoverPiece = new Piece(index);

        if (((hoverPiece.color === 1 || hoverPiece.color === 6) && whiteTurn) || ((hoverPiece.color === 2 || hoverPiece.color === 7) && !whiteTurn)) {

            if (hoverPiece.possibleMoves.length !== 0) {
                document.querySelector('.piece' + index).classList.add('pointer');
            }
        }
    })

    tile.addEventListener('mouseleave', () => {
        document.querySelector('.piece' + index).classList.remove('pointer');
    })
})

updateBoard();
updateInstructions();

function preview() {

    previewMoves = [];

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

    checkboard.style.zIndex = -1;

    departurePiece = new Piece(pieceA.index);

    let movingPath = [];

    pieceA.possibleMoves.forEach(moves => {
        if (moves[moves.length - 1] === pointB) {
            movingPath = moves.length > movingPath.length ? moves:movingPath;
        }
    })

    updateBoard();

    let selectors = [];
    let selectorIndex = 0;
    let direction;

    movingPath.forEach((move, index) => {

        setTimeout(() => {
            move = new Piece(move);

            let movingPieceSelector = '.piece' + departurePiece.index + (whiteTurn ? ' .light-piece':' .brown-piece');
            document.querySelector(movingPieceSelector).style.zIndex = '3';

            selectors.push(movingPieceSelector);

            let difference = departurePiece.index - move.index;
            console.log(difference);
            let distance = 9;

            if (difference === 9) {
                direction = '-' + distance + 'vh -' + distance + 'vh';
            } else if (difference === 7) {
                direction = distance + 'vh -' + distance + 'vh';
            } else if (difference === 18) {
                direction = '-' + 2*distance + 'vh -' + 2*distance + 'vh';
            } else if (difference === 14) {
                direction = 2*distance + 'vh -' + 2*distance + 'vh';
            } else if (difference === -9) {
                direction = distance + 'vh ' + distance + 'vh';
            } else if (difference === -7) {
                direction = '-' + distance + 'vh ' + distance + 'vh';
            } else if (difference === -18) {
                direction = 2*distance + 'vh ' + 2*distance + 'vh';
            } else if (difference === -14) {
                direction = '-' + 2*distance + 'vh ' + 2*distance + 'vh';
            }
    
            anime({
                targets: movingPieceSelector,
                translate: direction,
                duration: 300,
                easing: 'easeOutSine'
            });

            setTimeout(() => {
                document.querySelector(selectors[selectorIndex]).style.translate = null;
                document.querySelector(selectors[selectorIndex]).style.zIndex = null;

                selectorIndex++;
        
                departurePiece = move;
            
                updateBoard();
            }, 310);
                
            board[departurePiece.row][departurePiece.column] = 3;
            board[move.row][move.column] = pieceA.color;
    
            if (Math.abs(departurePiece.row - move.row) > 1) {

                let targetRow = (departurePiece.row + move.row) / 2;
                let targetColumn = (departurePiece.column + move.column) / 2;

                capturedPieceSelector = '.piece' + (targetRow * boardSize + targetColumn) + (!whiteTurn ? ' .light-piece':' .brown-piece');

                anime({
                    targets: capturedPieceSelector,
                    opacity: 0,
                    duration: 100,
                    delay: 200,
                    easing: 'easeOutSine'
                })

                setTimeout(() => {
                    document.querySelector(capturedPieceSelector).style.opacity = null;
                    board[targetRow][targetColumn] = 3;
                    updateBoard();
                }, 310);
            }

        }, index * 500);
    })

    setTimeout(() => {
        whiteTurn = !whiteTurn;
        checkboard.style.zIndex = null;
        updateInstructions();
    }, movingPath.length * 500);
}

function updateBoard() {

    console.log(board);

    lightPoints = boardSize / 2 * 3;
    brownPoints = boardSize / 2 * 3;

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {

            let selector = '.piece' + (i * boardSize + j);
            let tile = document.querySelector(selector);

            if (board[i][j] === 1 && i === boardSize - 1) {
                board[i][j] = 6;
                brownPoints--;
                addClass(tile, 'light-queen', tileStates);
            }

            else if (board[i][j] === 2 && i === 0) {
                board[i][j] = 7;
                lightPoints--;
                addClass(tile, 'brown-queen', tileStates);
            }

            else if (board[i][j] === 1) {
                addClass(tile, 'light', tileStates);
                brownPoints--;
            }

            else if (board[i][j] === 2) {
                addClass(tile, 'brown', tileStates);
                lightPoints--;
            }

            else if (board[i][j] === 4) {
                addClass(tile, 'preview-light', tileStates);
            }

            else if (board[i][j] === 5) {
                addClass(tile, 'preview-brown', tileStates);
            }

            else if (board[i][j] === 6) {
                addClass(tile, 'light-queen', tileStates);
                brownPoints--;
            }

            else if (board[i][j] === 7) {
                addClass(tile, 'brown-queen', tileStates);
                lightPoints--;
            }

            else {
                addClass(tile, 'removeAll', tileStates);
            }
        }
    }

    scores[0].innerHTML = lightPoints;
    scores[1].innerHTML = brownPoints;

    if (lightPoints === boardSize / 2 * 3 || brownPoints === boardSize / 2 * 3) {
        gameOver = true;
    }
}

function addClass(element, classOption, classOptions) {
    classOptions.forEach(state => {
        if (state === classOption) {
            element.classList.add(state);
        } else {
            element.classList.remove(state);
        }
    })
}

function updateInstructions() {
    if (!gameOver) {
        if (whiteTurn) {
            addClass(instructions, 'light-turn', instructionsStates);
        } else {
            addClass(instructions, 'brown-turn', instructionsStates);
        }
    } else {
        if (lightPoints === boardSize / 2 * 3) {
            addClass(instructions, 'light-win', instructionsStates);
        } else {
            addClass(instructions, 'brown-win', instructionsStates);
        }
    }
}