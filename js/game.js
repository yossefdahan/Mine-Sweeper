'use strict'

const MINE = '💥'
const EMPTY = ''
var gBoard
var gMines = []
var gEmptyPoss
var gTimerInterval
var gMinesCopy
var gLifeLeft = 3
const div = document.querySelector('.main-board')
div.addEventListener("contextmenu", (e) => { e.preventDefault() })
const elNormalImg = document.querySelector('.homer-img')
const normalImg = elNormalImg.src

var gLevel = {
    SIZE: 4,
    MINES: 3
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    gBoard = buildBoard()

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
    return board
}

function getEmptyPos(indexI, indexJ) {
    gEmptyPoss = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j]
            if (!currCell.isMine && gBoard[indexI][indexJ] !== currCell) {
                gEmptyPoss.push({ i, j })

            }
        }
    }
    const randIdx = getRandomInt(0, gEmptyPoss.length)
    return gEmptyPoss[randIdx]
}

function getRandomMines(board, i, j) {
    for (var index = 0; index < gLevel.MINES; index++) {
        getRandomMine(board, i, j)
    }
    gMinesCopy = gLevel.MINES
}

function getRandomMine(board, i, j) {
    const emptyPos = getEmptyPos(i, j)
    if (!emptyPos) return

    const mine = {
        location: {
            i: emptyPos.i,
            j: emptyPos.j
        },
    }

    gMines.push(mine)
    gBoard[mine.location.i][mine.location.j].isMine = true
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

function onCellClicked(elCell, i, j) {

    if (gGame.shownCount === 0) {
        getRandomMines(gBoard, i, j)
        setMinesNegsCount(gBoard)
        renderBoard(gBoard)
        minesLeft()
        gGame.isOn = true
        startTimer()
    }
    const cell = gBoard[i][j]
    const showCount = document.querySelector('.show-count')
    const elNormalImg = document.querySelector('.homer-img')
    var normalImg = elNormalImg.src

    if (!cell.isShown && !cell.isMarked && !cell.isMine) {
        elNormalImg.src = './img/reveal.jpg'
        setTimeout(() => {
            elNormalImg.src = normalImg
        }, 1000)



        if (!cell.minesAroundCount) {

            revealNegs(i, j)
        } else {
            cell.isShown = true

            gGame.shownCount++
            showCount.innerText = gGame.shownCount
        }


    }
    if (cell.isMine) {
        const elMinesLeft = document.querySelector('.mines-left')
        const elLifeLeft = document.querySelector('.life-left')
        gLifeLeft--
        elLifeLeft.innerText = gLifeLeft
        renderCell(i, j, MINE)
        cell.isShown = true
        gMinesCopy--
        elMinesLeft.innerText = gMinesCopy
        elNormalImg.src = './img/mine.jpg'
        setTimeout(() => {
            elNormalImg.src = normalImg
        }, 1000)
        playMineSound()
    } else {
        renderCell(i, j, cell.minesAroundCount)
    }
    checkGameOver()
}

function revealAllMines() {
    for (let i = 0; i < gMines.length; i++) {
        renderCell(gMines[i].location.i, gMines[i].location.j)
    }
}

function checkGameOver() {
    const elImg = document.querySelector('.homer-img')

    if (gLevel.MINES === gGame.markedCount || gGame.shownCount === (gLevel.SIZE ** 2 - gLevel.MINES)) {
        gGame.isOn = false
        elImg.src = './img/win.jpg'
        setTimeout(() => {
            elImg.src = normalImg
        }, 4000)
        playMineSound5()
        clearInterval(gTimerInterval)
        openPopUp()
    }
    if (gLifeLeft === 0 || gMinesCopy === 0) {
        revealAllMines()
        clearInterval(gTimerInterval)
        playMineSound6()
        openPopUp()
    }
}

function renderCell(cellI, cellJ) {
    const elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
    elCell.style.cursor = 'not-allowed'
    elCell.classList.remove('cell')
    elCell.classList.add('shown')
}

function revealNegs(cellI, cellJ) {

    var count = 0
    const showCount = document.querySelector('.show-count')
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            // if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue

            if (gBoard[i][j].isShown || gBoard[i][j].isMarked || gBoard[i][j].isMine) continue
            count++

            gBoard[i][j].isShown = true
            renderCell(i, j)

        }
    }
    gGame.shownCount += count
    showCount.innerText = gGame.shownCount
}

function onCellMarked(elCell, i, j) {
    const markedCount = document.querySelector('.mark-count')

    if (gBoard[i][j].isShown) return
    // if (gBoard[i][j].isMine) return
    var elFlag = elCell.classList.contains('flag')

    if (!elFlag) {
        elCell.classList.remove('cell')
        elCell.innerText = ''
        elCell.classList.add('flag')
        gBoard[i][j].isMarked = true
        gGame.markedCount++
    } else {
        elCell.classList.add('cell')
        elCell.classList.remove('flag')
        if (gBoard[i][j].isMine) {
            elCell.innerText = MINE
            gGame.markedCount--
        } else if (gBoard[i][j].minesAroundCount) {
            elCell.innerText = gBoard[i][j].minesAroundCount
            gGame.markedCount--
        } else {
            elCell.innerText = EMPTY
            gGame.markedCount--
        }
        gBoard[i][j].isMarked = false
    }
    markedCount.innerText = gGame.markedCount
}

function onChangeLevel(size) {
    if (size === 16) {
        gLevel.SIZE = 4
        gLevel.MINES = 3
        playMineSound3()
    } else if (size === 64) {
        gLevel.SIZE = 8
        gLevel.MINES = 14
        playMineSound4()
    } else {
        gLevel.SIZE = 12
        gLevel.MINES = 32
        playMineSound2()
    }
    onInit()
}

function resetGame() {
    const elMarkedCount = document.querySelector('.mark-count')
    const elShowCount = document.querySelector('.show-count')
    gLifeLeft = 3
    gMinesCopy = 0
    gGame.shownCount = 0
    gGame.markedCount = 0
    elShowCount.innerText = gGame.shownCount
    elMarkedCount.innerText = gGame.markedCount
    gGame.isOn = false
    clearInterval(gTimerInterval)
    closePopUp()
    onInit()

}

function openPopUp() {
    document.querySelector('.pop-up').style.display = 'block'
    document.querySelector('.pop-up-content').innerText = 'PLEASE, NOOO!!!'

}

function closePopUp() {
    document.querySelector('.pop-up').style.display = 'none'
}

function minesLeft() {
    const elMinesLeft = document.querySelector('.mines-left')
    elMinesLeft.innerText = gMinesCopy
    if (!gMinesCopy) {
        playMineSound6()
    }

}

