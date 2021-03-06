const me = 'O'
const bot = 'X'
//let player = bot
//let turn = 0

const board = Array.from(Array(9).keys())

const cells = Array.from(document.querySelectorAll('.grid>*'))

const control = document.querySelector('.control')
const play = document.querySelector('.play')
const info = document.querySelector('.info')

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
    gameResult(isWin.player === me ? 'Gagné !' : 'Perdu..')
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

const minimax = (boardCopie, player) => {
    const placeDispo = placesDisponibles(boardCopie)

    if (checkWin(boardCopie, me)) {
        return {score: -10}
    } else if (checkWin(boardCopie, bot)) {
        return {score: 10}
    } else if (placeDispo.length === 0) {
        return {score: 0}
    }

    const coups = []

    placeDispo.map((place, i) => {
        const coup = {}
        
        coup.index = boardCopie[place]

        boardCopie[place] = player

        if (player === bot) {
            const result = minimax(boardCopie, me)
            coup.score = result.score
        } else {
            const result = minimax(boardCopie, bot)
            coup.score = result.score
        }

        boardCopie[place] = coup.index

        coups.push(coup)
    })

    let meilleurCoup

    if (player === bot) {
        let bestScore = -11
        coups.map((coup, i) => {
            if (coup.score > bestScore) {
                bestScore = coup.score
                meilleurCoup = i
            }
        })
    } else {
        let bestScore = 11
        coups.map((coup, i) => {
            if (coup.score < bestScore) {
                bestScore = coup.score
                meilleurCoup = i
            }
        })
    }

    return coups[meilleurCoup]
}

const placesDisponibles = () => board.filter(cell => typeof cell === 'number')

const bestPlace = () => {
    //const random = Math.floor(Math.random() * placesDispo().length)
    //return cells[placesDispo()[random]]
    return cells[minimax(board, bot).index]
}

const gameResult = (result) => {
    control.style.display='block'
    play.style.display ='none'
    info.innerText = result
    replay()
}

const checkNul = () => {
    if (placesDisponibles().length === 0) {
        cells.map(cell => {
            cell.removeEventListener('click', newTurn)
        })
        gameResult('Nul')
        return true
    }
    return false
}

const newTurn = (event) => {
    //player = player === me ? bot : me
    handleturn(event.target, me)
    if(!checkNul()) handleturn(bestPlace(), bot)
    

    //turn++
    //if (turn === 9) replay()
}

const start = () => { 
    control.style.display = 'none'

    cells.map(cell  => {
        cell.innerText = ''
        cell.addEventListener('click', newTurn)
    })
}

play.addEventListener('click', start)