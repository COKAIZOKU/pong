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

    // player wins
    const title = document.createElement('h1')
    title.textContent = `${winner} WINS`
    title.className = 'game-over__title'

    // play again
    const playAgainBtn = document.createElement('button')
    playAgainBtn.className = 'game-over__play-again'
    playAgainBtn.append(document.createTextNode('\u2014 '))
    'PLAY AGAIN'.split('').forEach((letter, index) => {
      if (letter === ' ') {
        playAgainBtn.append(document.createTextNode(' '))
        return
      }
      const letterSpan = document.createElement('span')
      letterSpan.textContent = letter
      letterSpan.className = 'game-over__play-again-letter'
      letterSpan.style.setProperty('--letter-delay', `${index * 0.05}s`)
      playAgainBtn.append(letterSpan)
    })
    playAgainBtn.append(document.createTextNode(' \u2014'))
    playAgainBtn.addEventListener('click', onPlayAgain)

    const settings = document.createElement('div')
    settings.className = 'game-over__settings'

    // unbeatable button true/false
    const unbeatableLabel = document.createElement('span')
    unbeatableLabel.textContent = 'UNBEATABLE BOT'
    unbeatableLabel.className = 'game-over__setting-label'

    const unbeatableBtn = document.createElement('button')
    unbeatableBtn.className = 'game-over__setting-button'
    const createSettingValue = (value: string) => {
      const valueSpan = document.createElement('span')
      valueSpan.textContent = value
      valueSpan.className = 'game-over__setting-value'
      return valueSpan
    }
    let currentValue = createSettingValue(getIsUnbeatable() ? 'TRUE' : 'FALSE')

    // slide animation
    let isToggleAnimating = false
    unbeatableBtn.append(currentValue)
    unbeatableBtn.addEventListener('click', () => {
      if (isToggleAnimating) {
        return
      }
      isToggleAnimating = true
      const nextValue = createSettingValue(onToggleUnbeatable() ? 'TRUE' : 'FALSE')
      nextValue.classList.add('game-over__setting-value--enter')
      unbeatableBtn.append(nextValue)
      requestAnimationFrame(() => {
        currentValue.classList.add('game-over__setting-value--exit')
        nextValue.classList.remove('game-over__setting-value--enter')
      })
      window.setTimeout(() => {
        currentValue.remove()
        currentValue = nextValue
        isToggleAnimating = false
      }, 200)
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
