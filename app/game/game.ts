import { createGameOverScreen } from './game-over'

if (typeof document !== 'undefined') {
    const { body } = document

    // score
    const scoreFontFamily = window.getComputedStyle(body).fontFamily

    // canvas
    const canvas = document.createElement('canvas')

    // ball
    const ballImage = new Image()
    ballImage.src = '/ball.png'
    const context = canvas.getContext('2d')
    if (!context) {
        throw new Error('2D context is not supported in this browser.')
    }
    // shadows
    const createBlurredMarker = (radiusX: number, radiusY: number, blur: number) => {
        const markerCanvas = document.createElement('canvas')
        const padding = blur * 3
        markerCanvas.width = (radiusX + padding) * 2
        markerCanvas.height = (radiusY + padding) * 2
        const markerContext = markerCanvas.getContext('2d')
        if (!markerContext) {
            throw new Error('2D context is not supported in this browser.')
        }
        markerContext.filter = `blur(${blur}px)`
        markerContext.fillStyle = '#0045F5'
        markerContext.beginPath()
        markerContext.ellipse(markerCanvas.width / 2, markerCanvas.height / 2, radiusX, radiusY, 0, 0, 2 * Math.PI)
        markerContext.fill()
        return markerCanvas
    }
    const ballMarker = createBlurredMarker(20, 5, 3)
    const paddleMarker = createBlurredMarker(10, 5, 3)
    const bottomGap = 100
    const playableBottomMargin = 10
    let width = window.innerWidth
    let height = window.innerHeight - bottomGap

    // paddle
    const paddleHeight = 150
    const paddleWidth = 20
    const leftPaddleX = 30
    let rightPaddleX = width - paddleWidth - 30
    let paddleRightY = (height - paddleHeight) / 2
    let paddleLeftY = (height - paddleHeight) / 2
    let playerMoved = false
    // ball
    let ballX = width / 2
    let ballY = height / 2
    const ballRadius = 19
    const baseBallSpeed = 20
    let speedY = 0
    let speedX = 0
    let computerSpeed = 30
    const beatableComputerSpeed = 10
    // score
    let playerScore = 0
    let botScore = 0
    const winningScore = 2
    let isNewGame = true
    let isGameOver = false
    const botAimDeadzone = 15
    const clampPaddleY = (value: number) => Math.max(0, Math.min(height - playableBottomMargin - paddleHeight, value))

    // settings
    let isUnbeatable = true
    let beatableAiFrameCount = 0

    // gameover
    const gameOver = () => {
      if(playerScore === winningScore || botScore === winningScore) {
        isGameOver = true
      }
    }
    // ball
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
    }
    const ballBoundaries = () => {
        // Bounce off Top/Bottom walls
        if (ballY - ballRadius <= 0 && speedY < 0) {
            speedY = -speedY
        }
        if (ballY + ballRadius >= height - playableBottomMargin && speedY > 0) {
            ballY = height - playableBottomMargin - ballRadius
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
    // AIbot
    const unbeatableBotAI = () => {
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
            const maxY = height - playableBottomMargin - ballRadius
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
    const beatableBotAI = () => {
        if (playerMoved) {
            const paddleCenter = paddleRightY + paddleHeight / 2
            const deltaY = ballY - paddleCenter
            if (Math.abs(deltaY) <= botAimDeadzone) {
                return
            }
            const step = Math.sign(deltaY) * Math.min(beatableComputerSpeed, Math.abs(deltaY))
            paddleRightY += step
            paddleRightY = clampPaddleY(paddleRightY)
        }
    }
    const botAI = () => {
        if (isUnbeatable) {
            unbeatableBotAI()
        } else {
            beatableAiFrameCount += 1
            if (beatableAiFrameCount % 1 === 0) {
                beatableBotAI()
            }
        }
    }

    // canvas
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
        // shadows
        context.save()
        context.globalAlpha = getBallMarkerOpacity()
        context.drawImage(ballMarker, ballX - ballMarker.width / 2, height - 9 - ballMarker.height / 2)
        context.globalAlpha = getMarkerOpacity(paddleLeftY)
        context.drawImage(paddleMarker, leftPaddleX + paddleWidth / 2 - paddleMarker.width / 2, height - 9 - paddleMarker.height / 2)
        context.globalAlpha = getMarkerOpacity(paddleRightY)
        context.drawImage(paddleMarker, rightPaddleX + paddleWidth / 2 - paddleMarker.width / 2, height - 9 - paddleMarker.height / 2)
        context.restore()
        // paddle
        context.fillStyle = 'black'
        //left paddle
        context.fillRect(leftPaddleX, paddleLeftY, paddleWidth, paddleHeight)
        //right paddle
        context.fillRect(rightPaddleX, paddleRightY, paddleWidth, paddleHeight)
        // ball
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
    // canvas
    const createCanvas = () => {
        canvas.width = width
        canvas.height = height
        canvas.className = 'game-canvas'
        body.appendChild(canvas)
        renderCanvas()
    }
    // gameover
    const startGame = () => {
      const restartFromGameOver = isGameOver && !isNewGame
      //inside startGame function
      if (restartFromGameOver) {
        gameOverScreen.hide()
      }
      playerScore = 0
      botScore = 0
      paddleLeftY = (height - paddleHeight) / 2
      paddleRightY = (height - paddleHeight) / 2
      playerMoved = false
      ballReset()
      renderCanvas()
      isGameOver = false
      isNewGame = false
      if (restartFromGameOver) {
        window.requestAnimationFrame(animate)
      }
    }
    // paddle
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
    // canvas
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
            gameOverScreen.show(winner)
            return
        }
        renderCanvas()
        window.requestAnimationFrame(animate)
    }
    const gameOverScreen = createGameOverScreen({
      body,
      getIsUnbeatable: () => isUnbeatable,
      onToggleUnbeatable: () => {
        isUnbeatable = !isUnbeatable
        return isUnbeatable
      },
      onPlayAgain: startGame,
    })
    createCanvas()
    startGame()
    canvas.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    window.requestAnimationFrame(animate)
}
