if (typeof document !== 'undefined') {
    const { body } = document
    const scoreFontFamily = window.getComputedStyle(body).fontFamily
    const gameOverDiv = document.createElement('div')

    //canvas codes
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) {
        throw new Error('2D context is not supported in this browser.')
    }
    let width = window.innerWidth
    let height = window.innerHeight

    //paddle code
    const paddleHeight = 150
    const paddleWidth = 20
    const leftPaddleX = 30
    const rightPaddleX = width - paddleWidth - 30
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
    const ballRadius = 15
    const baseBallSpeed = 16
    let speedY = 0
    let speedX = 0
    let computerSpeed = 12
    // score
    let playerScore = 0
    let botScore = 0
    const winningScore = 7
    let isNewGame = true
    let isGameOver = false
    const clampPaddleY = (value: number) => Math.max(0, Math.min(height - paddleHeight, value))
    const gameOver = () => {
      if(playerScore === winningScore || botScore === winningScore) {
        isGameOver = true
      }
    }
    const showGameOverMsg = (winner: string) => {
      //hide canvas
      canvas.hidden = true
      gameOverDiv.textContent = ''
      const title = document.createElement('h1')
      title.textContent = `${winner} Wins!!!`
      const playAgainBtn = document.createElement('button')
      playAgainBtn.setAttribute('onclick', 'startGame()')
      playAgainBtn.textContent = 'Play Again'
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
            playerScore++
        }
        if (ballX > width) {
            ballReset()
            botScore++
        }
    }
    const botAI = () => {
        const paddleCenter = paddleRightY + paddleHeight / 2
        if (paddleCenter < ballY) {
            paddleRightY += computerSpeed
        } else if (paddleCenter > ballY) {
            paddleRightY -= computerSpeed
        }
        paddleRightY = clampPaddleY(paddleRightY)
    }

    //generating canvas
    const renderCanvas = () => {
        //canvas background
        context.fillStyle = 'black'
        context.fillRect( 0, 0, width, height)
        //paddle color
        context.fillStyle = 'white'
        //left paddle
        context.fillRect(leftPaddleX, paddleLeftY, paddleWidth, paddleHeight)
        //right paddle
        context.fillRect(rightPaddleX, paddleRightY, paddleWidth, paddleHeight)
        //ball
        context.beginPath()
        context.arc(ballX, ballY, ballRadius, 2 * Math.PI, Number(false))
        context.fillStyle = 'white'
        context.fill()
        // score
        context.font = `700 64px ${scoreFontFamily}`
        context.textAlign = 'right'
        context.fillText(String(playerScore), canvas.width / 2 - 20, 80)
        context.textAlign = 'left'
        context.fillText(String(botScore), canvas.width / 2 + 20, 80)
    }
    const createCanvas = () => {
        canvas.width = width
        canvas.height = height
        body.appendChild(canvas)
        renderCanvas()
    }
    const startGame = () => {
      //inside startGame function
      if (isGameOver && !isNewGame) {
        body.removeChild(gameOverDiv)
        canvas.hidden = false
      }
      isGameOver = false
      isNewGame = false
    }
    const handleMouseMove = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect()
        const mouseY = event.clientY - rect.top
        paddleLeftY = clampPaddleY(mouseY - paddleHeight / 2)
        playerMoved = true
    }
    const handleResize = () => {
        width = window.innerWidth
        height = window.innerHeight
        canvas.width = width
        canvas.height = height
        paddleLeftY = clampPaddleY(paddleLeftY)
        paddleRightY = clampPaddleY(paddleRightY)
        renderCanvas()
    }
    const animate = () => {
        ballMove()
        ballBoundaries()
        botAI()
        renderCanvas()
        window.requestAnimationFrame(animate)
    }
    createCanvas()
    startGame()
    ballReset()
    canvas.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    window.requestAnimationFrame(animate)
}
