'use strict'

const MINE = '💥'
const EMPTY = ''
var gBoard
var gCountMines
var gTimerInterval
const elNormalImg = document.querySelector('.homer-img')
const normalImg = elNormalImg.src
const div = document.querySelector('.main-board')
div.addEventListener("contextmenu", (e) => { e.preventDefault() })

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
        gCountMines++
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

function onCellClicked(elCell, i, j) {
    gGame.isOn = true
    startTimer()
    const cell = gBoard[i][j]
    const elNormalImg = document.querySelector('.homer-img')
    var normalImg = elNormalImg.src
    if (!cell.isShown && !cell.isMarked) {
        revealNegs(i, j)
        elNormalImg.src = 'img/reveal.jpg'
        setTimeout(() => {
            elNormalImg.src = normalImg
        }, 1000)

        if (cell.isMine) {
            renderCell(i, j, MINE)
            cell.isShown = true
            gCountMines--

            elNormalImg.src = 'img/mine.jpg'
            setTimeout(() => {
                elNormalImg.src = normalImg
            }, 1000)
            playMineSound()

        } else {
            renderCell(i, j, cell.minesAroundCount)
        }
        checkGameOver()
    }
}

function checkGameOver() {
    const elImg = document.querySelector('.homer-img')

    if (gCountMines === gGame.markedCount && gGame.shownCount === (gLevel.SIZE ** 2 - gCountMines)) {
        gGame.isOn = false
        elImg.src = 'img/win.jpg'
        setTimeout(() => {
            elImg.src = normalImg
        }, 4000)
        playMineSound5()

    } else if (gCountMines === 0) {

        playMineSound6()
    }

}

function renderCell(cellI, cellJ) {
    const elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
    elCell.classList.remove('cell')

}

function revealNegs(cellI, cellJ) {
    var count = 1
    const showCount = document.querySelector('.show-count')
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue

            if (gBoard[i][j].isMine || gBoard[i][j].isMarked) continue
            if (gBoard[i][j].isShown) continue
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
    if (gBoard[i][j].isMine && gBoard[i][j].isShown) return
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

function renderCell2(cellI, cellJ, val) {
    const elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
    elCell.innerHTML = val
}

function onChangeLevel(size) {
    if (size === 16) {
        gLevel.SIZE = 4
        gLevel.MINES = 2
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
    const markedCount = document.querySelector('.mark-count')
    const showCount = document.querySelector('.show-count')
    gGame.shownCount = 0
    gGame.markedCount = 0
    showCount.innerText = gGame.shownCount
    markedCount.innerText = gGame.markedCount
    gGame.isOn = false
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

function playMineSound2() {
    const sound = new Audio('sound/no.mp3')
    sound.play()
}

function playMineSound3() {
    const sound = new Audio('sound/haha.mp3')
    sound.play()
}

function playMineSound4() {
    const sound = new Audio('sound/thats-ok.mp3')
    sound.play()
}

function playMineSound5() {
    const sound = new Audio('sound/i-am-champ.mp3')
    sound.play()
}

function playMineSound6() {
    const sound = new Audio('sound/grave.mp3')
    sound.play()
}

function startTimer() {

    if (gTimerInterval) clearInterval(gTimerInterval)

    var startTime = Date.now()
    gTimerInterval = setInterval(() => {
        const timeDiff = Date.now() - startTime

        const seconds = getFormatSeconds(timeDiff)
        const milliSeconds = getFormatMilliSeconds(timeDiff)

        document.querySelector('span.seconds').innerText = seconds
        document.querySelector('span.milli-seconds').innerText = milliSeconds

    }, 10)
}

function getFormatSeconds(timeDiff) {
    const seconds = Math.floor(timeDiff / 1000)
    return (seconds + '').padStart(2, '0')
}

function getFormatMilliSeconds(timeDiff) {
    const milliSeconds = new Date(timeDiff).getMilliseconds()
    return (milliSeconds + '').padStart(3, '0')
}