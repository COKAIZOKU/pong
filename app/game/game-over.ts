type GameOverScreenOptions = {
  body: HTMLElement
  getIsUnbeatable: () => boolean
  onToggleUnbeatable: () => boolean
  onPlayAgain: () => void
}

export const createGameOverScreen = ({
  body,
  getIsUnbeatable,
  onToggleUnbeatable,
  onPlayAgain,
}: GameOverScreenOptions) => {
  const gameOverDiv = document.createElement('div')
  gameOverDiv.className = 'game-over'

  const show = (winner: string) => {
    gameOverDiv.textContent = ''

    const title = document.createElement('h1')
    title.textContent = `${winner} WINS`
    title.className = 'game-over__title'

    const playAgainBtn = document.createElement('button')
    playAgainBtn.textContent = '\u2014 PLAY AGAIN \u2014'
    playAgainBtn.className = 'game-over__play-again'
    playAgainBtn.addEventListener('click', onPlayAgain)

    const settings = document.createElement('div')
    settings.className = 'game-over__settings'

    const unbeatableLabel = document.createElement('span')
    unbeatableLabel.textContent = 'UNBEATABLE BOT'
    unbeatableLabel.className = 'game-over__setting-label'

    const unbeatableBtn = document.createElement('button')
    unbeatableBtn.textContent = getIsUnbeatable() ? 'TRUE' : 'FALSE'
    unbeatableBtn.className = 'game-over__setting-button'
    unbeatableBtn.addEventListener('click', () => {
      unbeatableBtn.textContent = onToggleUnbeatable() ? 'TRUE' : 'FALSE'
    })

    settings.append(unbeatableLabel, unbeatableBtn)
    gameOverDiv.append(title, playAgainBtn, settings)
    body.appendChild(gameOverDiv)
  }

  const hide = () => {
    if (gameOverDiv.parentNode === body) {
      body.removeChild(gameOverDiv)
    }
  }

  return { hide, show }
}
