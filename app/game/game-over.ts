type GameOverScreenOptions = {
  body: HTMLElement
  fontFamily: string
  getIsUnbeatable: () => boolean
  onToggleUnbeatable: () => boolean
  onPlayAgain: () => void
}

export const createGameOverScreen = ({
  body,
  fontFamily,
  getIsUnbeatable,
  onToggleUnbeatable,
  onPlayAgain,
}: GameOverScreenOptions) => {
  const gameOverDiv = document.createElement('div')
  gameOverDiv.style.backgroundColor = 'transparent'
  gameOverDiv.style.width = '100vw'
  gameOverDiv.style.height = '100vh'
  gameOverDiv.style.position = 'fixed'
  gameOverDiv.style.left = '0'
  gameOverDiv.style.top = '0'
  gameOverDiv.style.display = 'flex'
  gameOverDiv.style.flexDirection = 'column'
  gameOverDiv.style.alignItems = 'center'
  gameOverDiv.style.justifyContent = 'center'
  gameOverDiv.style.gap = '5px'
  gameOverDiv.style.pointerEvents = 'none'

  const show = (winner: string) => {
    gameOverDiv.textContent = ''
    const title = document.createElement('h1')
    title.textContent = `${winner} WINS`
    title.style.fontFamily = fontFamily
    title.style.fontSize = '128px'
    title.style.fontWeight = '700'
    title.style.textAlign = 'center'
    title.style.color = 'white'
    title.style.margin = '0'
    title.style.lineHeight = '1'
    const playAgainBtn = document.createElement('button')
    playAgainBtn.textContent = '\u2014 PLAY AGAIN \u2014'
    playAgainBtn.style.pointerEvents = 'auto'
    playAgainBtn.style.fontFamily = fontFamily
    playAgainBtn.style.fontSize = '32px'
    playAgainBtn.style.fontWeight = '600'
    playAgainBtn.style.letterSpacing = '0.15em'
    playAgainBtn.style.margin = '0'
    playAgainBtn.style.marginTop = '-8px'
    playAgainBtn.style.padding = '0'
    playAgainBtn.style.border = '0'
    playAgainBtn.style.background = 'transparent'
    playAgainBtn.style.lineHeight = '1'
    playAgainBtn.addEventListener('click', onPlayAgain)
    const settings = document.createElement('div')
    settings.style.display = 'flex'
    settings.style.alignItems = 'center'
    settings.style.gap = '16px'
    settings.style.pointerEvents = 'auto'
    const unbeatableLabel = document.createElement('span')
    unbeatableLabel.textContent = 'UNBEATABLE BOT'
    unbeatableLabel.style.fontFamily = fontFamily
    unbeatableLabel.style.fontSize = '24px'
    unbeatableLabel.style.fontWeight = '600'
    unbeatableLabel.style.color = 'white'
    const unbeatableBtn = document.createElement('button')
    unbeatableBtn.textContent = getIsUnbeatable() ? 'TRUE' : 'FALSE'
    unbeatableBtn.style.background = 'transparent'
    unbeatableBtn.style.color = 'black'
    unbeatableBtn.style.fontFamily = fontFamily
    unbeatableBtn.style.fontSize = '24px'
    unbeatableBtn.style.fontWeight = '600'
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

