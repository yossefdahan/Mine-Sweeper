'use strict'
// const FLAG = '🍺'
const MINE = '💥'
const EMPTY = ''
var gBoard

var gLevel = {
    SIZE: 4,
    MINES: 2
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
    const board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    for (var i = 0; i < gLevel.MINES; i++) {
        const randomRow = getRandomInt(0, board.length)
        const randomCol = getRandomInt(0, board.length)
        if (!board[randomRow][randomCol].isMine) {
            board[randomRow][randomCol].isMine = true
        }
    }


    // board[getRandomInt(0, board.length)][getRandomInt(0, board.length)].isMine = true

    // board[getRandomInt(0, board.length)][getRandomInt(0, board.length)].isMine = true
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
            if (cell.isMine) cellClass += 'MINE'

            boardHTML += `<td data-i=${i} data-j=${j} oncontextmenu="onCellMarked(this,${i},${j})" onclick="onCellClicked(this,${i},${j})" title="cell${0 + i},${0 + j}" class=cell ${cellClass}">`
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




// const noContext = document.querySelector('.noContextMenu')
// noContext.addEventListener("contextmenu", (e) => {
//     e.preventDefault()
// })



function onCellClicked(elCell, i, j) {
    const cell = gBoard[i][j]

    if (!cell.isShown && !cell.isMarked) {
        revealNegs(i, j)
        // expandShown(gBoard, elCell, i, j)

        // elCell.classList.remove('cell')

        if (cell.isMine) {
            renderCell(i, j, MINE)
            cell.isShown = true
            playMineSound()
        } else {
            renderCell(i, j, cell.minesAroundCount)

        }
        // checkGameOver()
        // gGame.shownCount++
    }
}

function checkGameOver() {


}

function renderCell(cellI, cellJ) {
    const elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
    elCell.classList.remove('cell')

}

function revealNegs(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue

            if (gBoard[i][j].isMine || gBoard[i][j].isMarked) continue
            gBoard[i][j].isShown = true
            renderCell(i, j)
        }
    }
}
// elCell.addEventListener('contextmenu',onCellMarked(elCell))
const div = document.querySelector('.main-board')
div.addEventListener("contextmenu", (e) => { e.preventDefault() })


function onCellMarked(elCell, i, j) {
    // var currCell = gBoard[i][j]
    if (gBoard[i][j].isShown) return
    if (gBoard[i][j].isMine && gBoard[i][j].isShown) return
    var elFlag = elCell.classList.contains('flag')
    // const elFlag = document.querySelector('.flag')
    if (!elFlag) {
        console.log(gBoard[i][j]);
        // elCell.innerHTML = ''
        elCell.classList.remove('cell')
        elCell.innerText = ''
        elCell.classList.add('flag')
        gBoard[i][j].isMarked = true
        // renderCell(currCell)

    } else {
        console.log('hi');
        // elCell.innerHTML = FLAG
        elCell.classList.add('cell')
        elCell.classList.remove('flag')
        if (gBoard[i][j].isMine) {
            console.log(gBoard[i][j].isMine);
            elCell.innerText = MINE
            // renderCell2(i, j, MINE)
            console.log(elCell);

        } else if (gBoard[i][j].minesAroundCount) {
            elCell.innerText = gBoard[i][j].minesAroundCount
        } else {
            elCell.innerText = EMPTY
        }
        // elCell.innerText = ''
        // elCell.innerText = gBoard[i][j].minesAroundCount
        gBoard[i][j].isMarked = false

    }
    console.log("Cell clicked!")



}
function renderCell2(cellI, cellJ, val) {
    const elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
    elCell.innerHTML = val
}
// function onRightClick(event) {



//     console.log('hi');
// }

function onChangeLevel(size) {
    if (size === 16) {
        gLevel.SIZE = 4
        gLevel.MINES = 2
    } else if (size === 64) {
        gLevel.SIZE = 8
        gLevel.MINES = 14
    } else {
        gLevel.SIZE = 12
        gLevel.MINES = 32
    }
    onInit()
}

function minesLeft() {
    var currMinesCount = gLevel.MINES

}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

function playMineSound() {
    const sound = new Audio('sound/doh.mp3')
    sound.play()
}