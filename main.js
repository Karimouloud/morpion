//https://courses.hardcode.rs/?coupon=L8P5E5Q
const me = 'O'
const bot = 'X'
let player = bot
let turn = 0

const board = Array.from(Array(9).keys())

const cells = Array.from(document.querySelectorAll('.grid>*'))

const control = document.querySelector('.control')
const play = document.querySelector('.play')

const winList = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

const replay = () => {
    setTimeout(() => {
        window.location.reload()
    }, 2000)
}

const endGame = (isWin) => {
    console.log(isWin)
    winList[isWin.i].map(id => {
        const cell = document.getElementById(id)
        const color = isWin.player === me ? '#01ff16' : '#ff0000'
        cell.style.backgroundColor = color
        replay()
    })
    cells.map(cell => cell.removeEventListener('click', newTurn))
}

const checkWin = (board, player) => {
    const traces = board.reduce((a, vc, i) => vc === player ? a.concat(i) : a, [])
    
    let isWin = null
    
    for (let [i, win] of winList.entries()) {
        if (win.every(id => traces.indexOf(id) > -1)) {
            isWin = { i, player }
            break
        }
    }
    return isWin
}

const handleturn = (cell, player) => {
    cell.innerText = player
    board[cell.id] = player
    const isWin = checkWin(board, player)
    if (isWin) endGame(isWin)
}

const newTurn = (event) => {
    player = player === me ? bot : me
    handleturn(event.target, player)

    turn++
    if (turn === 9) replay()
}

const start = () => { 
    control.style.display = 'none'

    cells.map(cell  => {
        cell.innerText = ''
        cell.addEventListener('click', newTurn)
    })
}

play.addEventListener('click', start)