'use strict'


const gBOARD_SIZE = 4
const MINE = '💥'
var gBoard
const EMPTY = ''

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
                isMarked: false
            }
        }
    }
    board[getRandomInt(0, board.length)][getRandomInt(0, board.length)].isMine = true

    board[getRandomInt(0, board.length)][getRandomInt(0, board.length)].isMine = true
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
            if (cell.isMine) cellClass += 'MINE'

            boardHTML += `<td data-i=${i} data-j=${j} onclick="onCellClicked(this,${i},${j})" title="cell${0 + i},${0 + j}" class=cell ${cellClass}">`
            if (cell.isMine) {
                boardHTML += MINE
            } else if (cell.minesAroundCount > 0) {
                boardHTML += cell.minesAroundCount
            } else if (cell.minesAroundCount === 0) {
                cell.minesAroundCount = EMPTY
            }
            boardHTML += '</td>'
        }
        boardHTML += '</tr>'
    }
    elBody.innerHTML = boardHTML
}

function setMinesNegsCount(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const countMine = countMinesAroundCell(board, i, j)
            board[i][j].minesAroundCount = countMine
        }
    }
}

function countMinesAroundCell(board, rowIdx, colIdx) {
    var countMines = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {

            if (i >= 0 && i < board.length
                && j >= 0 && j < board[rowIdx].length
                && !(i === rowIdx && j === colIdx)) {

                if (board[i][j].isMine) {
                    countMines++
                }
            }
        }
    }
    return countMines
}

function onCellClicked(elCell, i, j) {
    const cell = gBoard[i][j]


    if (!cell.isShown && !cell.isMarked) {
        elCell.classList.remove('cell')
        cell.isShown = true

        if (cell.isMine) {
            renderCell(elCell, MINE)
        } else {
            renderCell(elCell, cell.minesAroundCount)
            expandShown(gBoard, elCell, i, j)
            // expandShown(cell, elCell, i, j)
        }
        // checkGameOver()
        // gGame.shownCount++
    }
}

function checkGameOver() {


}

function renderCell(elCell, minesAroundCount) {
    elCell.innerHTML = minesAroundCount
}

function expandShown(board, elCell, rowIdx, colIdx) {
    // const rowIdx = board.length
    // const colIdx = board[0].length
    if (board[rowIdx][colIdx].isShown || board[rowIdx][colIdx].isMarked) {
        return
    }
    board[rowIdx][colIdx].isShown = true
    renderCell(elCell, board[rowIdx][colIdx].minesAroundCount)

    if (board[rowIdx][colIdx].minesAroundCount === 0) {
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (i >= 0 && i < rowIdx && j >= 0 && j < colIdx && !(i === rowIdx && j === colIdx)) {

                    expandShown(board, document.querySelector(`.cell-${i}-${j}`), i, j)
                }
            }
        }
    }
}

// function onCellMarked(elCell) {
//     // elCell = document.querySelector('.cell')
//     elCell.addEventListener("click")

//     console.log(elCell);
// }

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}



