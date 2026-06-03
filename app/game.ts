if (typeof document !== 'undefined') {
    const { body } = document
    const scoreFontFamily = window.getComputedStyle(body).fontFamily
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

    //canvas codes
    const canvas = document.createElement('canvas')
    const ballImage = new Image()
    ballImage.src = '/ball.svg'
    const context = canvas.getContext('2d')
    if (!context) {
        throw new Error('2D context is not supported in this browser.')
    }
    const bottomGap = 100
    let width = window.innerWidth
    let height = window.innerHeight - bottomGap

    //paddle code
    const paddleHeight = 150
    const paddleWidth = 20
    const leftPaddleX = 30
    let rightPaddleX = width - paddleWidth - 30
    let paddleRightY = (height - paddleHeight) / 2
    let paddleLeftY = (height - paddleHeight) / 2
    let paddleBottomX = width / 2 - paddleWidth / 2
    let paddleTopX = width / 2 - paddleWidth / 2
    const paddleDiff = paddleWidth / 2
    let playerMoved = false
    let paddleContact = false
    let trajectoryX = 0
    //global variables
    let ballX = width / 2
    let ballY = height / 2
    const ballRadius = 19
    const baseBallSpeed = 20
    let speedY = 0
    let speedX = 0
    let computerSpeed = 30
    // score
    let playerScore = 0
    let botScore = 0
    const winningScore = 2
    let isNewGame = true
    let isGameOver = false
    const botAimDeadzone = 4
    const clampPaddleY = (value: number) => Math.max(0, Math.min(height - paddleHeight, value))
    const gameOver = () => {
      if(playerScore === winningScore || botScore === winningScore) {
        isGameOver = true
      }
    }
    const showGameOverMsg = (winner: string) => {
      gameOverDiv.textContent = ''
      const title = document.createElement('h1')
      title.textContent = `${winner} WINS`
      title.style.fontFamily = scoreFontFamily
      title.style.fontSize = '128px'
      title.style.fontWeight = '700'
      title.style.textAlign = 'center'
      title.style.color = 'white'
      title.style.margin = '0'
      title.style.lineHeight = '1'
      const playAgainBtn = document.createElement('button')
      playAgainBtn.textContent = '— PLAY AGAIN —'
      playAgainBtn.style.pointerEvents = 'auto'
      playAgainBtn.style.fontFamily = scoreFontFamily
      playAgainBtn.style.fontSize = '32px'
      playAgainBtn.style.fontWeight = '600'
      playAgainBtn.style.letterSpacing = '0.15em'
      playAgainBtn.style.margin = '0'
      playAgainBtn.style.marginTop = '-8px'
      playAgainBtn.style.padding = '0'
      playAgainBtn.style.border = '0'
      playAgainBtn.style.background = 'transparent'
      playAgainBtn.style.lineHeight = '1'
      playAgainBtn.addEventListener('click', startGame)
      gameOverDiv.append(title, playAgainBtn)
      body.appendChild(gameOverDiv)
    }
    const setBallVelocity = (direction: -1 | 1) => {
        const angle = (Math.random() * Math.PI) / 3 - Math.PI / 6
        speedX = direction * baseBallSpeed * Math.cos(angle)
        speedY = baseBallSpeed * Math.sin(angle)
    }
    const ballMove = () => {
        // Vertical Speed
        ballY += speedY
        // Horizontal Speed
        ballX += speedX
    }
    const ballReset = () => {
        ballX = width / 2
        ballY = height / 2
        setBallVelocity(Math.random() < 0.5 ? -1 : 1)
        paddleContact = false
    }
    const ballBoundaries = () => {
        // Bounce off Top/Bottom walls
        if (ballY - ballRadius <= 0 && speedY < 0) {
            speedY = -speedY
        }
        if (ballY + ballRadius >= height && speedY > 0) {
            speedY = -speedY
        }
        // Bounce off left paddle
        if (
            ballX - ballRadius <= leftPaddleX + paddleWidth &&
            ballX - ballRadius >= leftPaddleX &&
            ballY >= paddleLeftY &&
            ballY <= paddleLeftY + paddleHeight
        ) {
            const hitPosition = (ballY - (paddleLeftY + paddleHeight / 2)) / (paddleHeight / 2)
            speedY = hitPosition * baseBallSpeed
            speedX = Math.abs(speedX)
            ballX = leftPaddleX + paddleWidth + ballRadius
        }
        // Bounce off right paddle
        if (
            ballX + ballRadius >= rightPaddleX &&
            ballX + ballRadius <= rightPaddleX + paddleWidth &&
            ballY >= paddleRightY &&
            ballY <= paddleRightY + paddleHeight
        ) {
            const hitPosition = (ballY - (paddleRightY + paddleHeight / 2)) / (paddleHeight / 2)
            speedY = hitPosition * baseBallSpeed
            speedX = -Math.abs(speedX)
            ballX = rightPaddleX - ballRadius
        }
        // Score when ball passes left/right side
        if (ballX < 0) {
            ballReset()
            botScore++
        }
        if (ballX > width) {
            ballReset()
            playerScore++
        }
    }
    const botAI = () => {
        const predictBallYAtRightPaddle = () => {
            if (speedX <= 0) {
                return height / 2
            }
            const travelX = rightPaddleX - ballX
            if (travelX <= 0) {
                return ballY
            }
            const framesUntilIntercept = travelX / speedX
            const rawY = ballY + speedY * framesUntilIntercept
            const minY = ballRadius
            const maxY = height - ballRadius
            const playHeight = maxY - minY
            const period = playHeight * 2
            let foldedY = (rawY - minY) % period
            if (foldedY < 0) {
                foldedY += period
            }
            if (foldedY > playHeight) {
                foldedY = period - foldedY
            }
            return minY + foldedY
        }
        const targetY = predictBallYAtRightPaddle()
        const paddleCenter = paddleRightY + paddleHeight / 2
        const deltaY = targetY - paddleCenter
        if (Math.abs(deltaY) <= botAimDeadzone) {
            return
        }
        const step = Math.sign(deltaY) * Math.min(computerSpeed, Math.abs(deltaY))
        paddleRightY += step
        paddleRightY = clampPaddleY(paddleRightY)
    }

    //generating canvas
    const renderCanvas = () => {
        //canvas background
        context.fillStyle = '#0483F8'
        context.fillRect( 0, 0, width, height)
        const getMarkerOpacity = (paddleY: number) => {
            const distanceFromBottom = height - (paddleY + paddleHeight)
            const maxDistance = height - paddleHeight
            return Math.max(0.2, Math.min(1, 1 - (distanceFromBottom / maxDistance) * 0.8))
        }
        const getBallMarkerOpacity = () => {
            const distanceFromBottom = height - (ballY + ballRadius)
            const maxDistance = height - ballRadius
            return Math.max(0.2, Math.min(1, 1 - (distanceFromBottom / maxDistance) * 0.8))
        }
        //paddle markers
        context.save()
        context.filter = 'blur(3px)'
        context.beginPath()
        context.fillStyle = `rgba(0, 69, 245, ${getBallMarkerOpacity()})`
        context.ellipse(ballX, height - 9, 20, 5, 0, 0, 2 * Math.PI)
        context.fill()
        context.beginPath()
        context.fillStyle = `rgba(0, 69, 245, ${getMarkerOpacity(paddleLeftY)})`
        context.ellipse(leftPaddleX + paddleWidth / 2, height - 9, 12, 5, 0, 0, 2 * Math.PI)
        context.fill()
        context.beginPath()
        context.fillStyle = `rgba(0, 69, 245, ${getMarkerOpacity(paddleRightY)})`
        context.ellipse(rightPaddleX + paddleWidth / 2, height - 9, 12, 5, 0, 0, 2 * Math.PI)
        context.fill()
        context.restore()
        //paddle color
        context.fillStyle = 'black'
        //left paddle
        context.fillRect(leftPaddleX, paddleLeftY, paddleWidth, paddleHeight)
        //right paddle
        context.fillRect(rightPaddleX, paddleRightY, paddleWidth, paddleHeight)
        //ball
        if (ballImage.complete) {
            context.drawImage(ballImage, ballX - ballRadius, ballY - ballRadius, ballRadius * 2, ballRadius * 2)
        }
        // score
        context.fillStyle = 'white'
        context.font = `700 64px ${scoreFontFamily}`
        context.textAlign = 'right'
        context.fillText(String(playerScore), canvas.width / 2 - 20, 80)
        context.textAlign = 'left'
        context.fillText(String(botScore), canvas.width / 2 + 20, 80)
    }
    const createCanvas = () => {
        canvas.width = width
        canvas.height = height
        canvas.style.position = 'fixed'
        canvas.style.top = '0'
        canvas.style.left = '0'
        canvas.style.display = 'block'
        body.appendChild(canvas)
        renderCanvas()
    }
    const startGame = () => {
      const restartFromGameOver = isGameOver && !isNewGame
      //inside startGame function
      if (restartFromGameOver) {
        body.removeChild(gameOverDiv)
      }
      playerScore = 0
      botScore = 0
      paddleLeftY = (height - paddleHeight) / 2
      paddleRightY = (height - paddleHeight) / 2
      ballReset()
      renderCanvas()
      isGameOver = false
      isNewGame = false
      if (restartFromGameOver) {
        window.requestAnimationFrame(animate)
      }
    }
    const handleMouseMove = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect()
        const mouseY = event.clientY - rect.top
        paddleLeftY = clampPaddleY(mouseY - paddleHeight / 2)
        playerMoved = true
    }
    const handleResize = () => {
        width = window.innerWidth
        height = window.innerHeight - bottomGap
        rightPaddleX = width - paddleWidth - 30
        canvas.width = width
        canvas.height = height
        paddleLeftY = clampPaddleY(paddleLeftY)
        paddleRightY = clampPaddleY(paddleRightY)
        renderCanvas()
    }
    const animate = () => {
        if (isGameOver) {
            return
        }
        ballMove()
        ballBoundaries()
        botAI()
        gameOver()
        if (isGameOver) {
            const winner = playerScore === winningScore ? 'PLAYER' : 'BOT'
            showGameOverMsg(winner)
            return
        }
        renderCanvas()
        window.requestAnimationFrame(animate)
    }
    createCanvas()
    startGame()
    canvas.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    window.requestAnimationFrame(animate)
}
