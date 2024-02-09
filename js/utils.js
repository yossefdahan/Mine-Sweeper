function playMineSound() {
    const sound = new Audio('./sound/doh.mp3')
    sound.play()
}

function playMineSound2() {
    const sound = new Audio('./sound/no.mp3')
    sound.play()
}

function playMineSound3() {
    const sound = new Audio('./sound/haha.mp3')
    sound.play()
}

function playMineSound4() {
    const sound = new Audio('./sound/thats-ok.mp3')
    sound.play()
}

function playMineSound5() {
    const sound = new Audio('./sound/i-am-champ.mp3')
    sound.play()
}

function playMineSound6() {
    const sound = new Audio('./sound/grave.mp3')
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

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

function renderCell2(cellI, cellJ, val) {
    const elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
    elCell.innerHTML = val
}