'use strict'

// const EMPTY = '#'
const gBOARD_SIZE = 4
const MINE = '💥'
var gBoard


var countMinesEachCell
var countMines


var gLevel = {
    SIZE: gBOARD_SIZE,
    MINES: gBOARD_SIZE / 2
}


var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}





function onInit() {


    gBoard = buildBoard()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    // setMinesNegsCount(gBoard)

    console.table(gBoard)
}







function buildBoard() {
    const size = gBOARD_SIZE
    const board = []

    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: true
            }
            // if (board[i][j] === MINE) {

            //     board[i][j].isMine = true
            // }
            // if (j === 3 && i > 2 && i < size - 2) {
            //     board[i][j] = MINE
            // }
        }
    }
    board[1][1].isMine = true
    board[2][2].isMine = true
    // setMinesNegsCount(board)


    return board
}


function getClassName(location) {
    return `cell-${location.i}-${location.j}`
}

function renderBoard(board) {
    var elBody = document.querySelector('.board')
    var boardHTML = ''

    for (var i = 0; i < board.length; i++) {
        boardHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var cellClass = getClassName({ i, j })
            // console.log(cellClass);
            if (cell.isMine === true) cellClass += 'mine'
            boardHTML += `<td data-i=${i} data-j=${j} onclick="onCellClicked(this,${i},${j})" title="cell${0 + i},${0 + j}" class=cell ${cellClass}">`
            if (cell.isMine === true) {
                boardHTML += MINE
            }


            boardHTML += countMines

            boardHTML += '</td>'
        }
        boardHTML += '</tr>'
    }
    elBody.innerHTML = boardHTML
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j].minesAroundCount = countMinesAroundCell(board, i, j)
            console.log(board[i][j].minesAroundCount)
        }
    }
}

function countMinesAroundCell(board, row, col) {
    var countMines = 0;
    for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < board.length
                && j >= 0 && j < board[row].length
                && !(i === row && j === col)) {

                if (board[i][j].isMine) {
                    countMines++
                }
            }
        }
    }
    return countMines
}



// function onCellClicked(elCell, i, j) {
//     // if (cell.isMine) return

//     setMinesNegsCount(gBoard, i, j)
//     // console.log(elCell, i, j);
//     console.table(setMinesNegsCount(gBoard, i, j))



// }



