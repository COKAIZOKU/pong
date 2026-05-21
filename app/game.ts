if (typeof document !== 'undefined') {
    const { body } = document
    const scoreFontFamily = window.getComputedStyle(body).fontFamily

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
    let speedY = 0
    let speedX = 10
    let computerSpeed = 3
    // score
    let playerScore = 0
    let botScore = 0
    const winningScore = 7
    const ballMove = () => {
        // Vertical Speed
        ballY += - speedY
        // Horizontal Speed
        ballX += speedX
    }
    const ballReset = () => {
        ballX = width / 2
        ballY = height / 2
        speedY = 0
        speedX = -3
        paddleContact = false
    }
    const ballBoundaries = () => {
        // Bounce off Top/Bottom walls
        if (ballY - ballRadius < 0 && speedY > 0) {
            speedY = -speedY
        }
        if (ballY + ballRadius > height && speedY < 0) {
            speedY = -speedY
        }
        // Bounce off left paddle
        if (
            ballX - ballRadius <= leftPaddleX + paddleWidth &&
            ballX - ballRadius >= leftPaddleX &&
            ballY >= paddleLeftY &&
            ballY <= paddleLeftY + paddleHeight
        ) {
            speedX = -speedX
        }
        // Bounce off right paddle
        if (
            ballX + ballRadius >= rightPaddleX &&
            ballX + ballRadius <= rightPaddleX + paddleWidth &&
            ballY >= paddleRightY &&
            ballY <= paddleRightY + paddleHeight
        ) {
            speedX = -speedX
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
        if (playerMoved) {
            if (paddleTopX + paddleDiff < ballX) {
                paddleTopX += computerSpeed
            } else {
                paddleTopX -= computerSpeed
            }
        }
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
    const handleResize = () => {
        width = window.innerWidth
        height = window.innerHeight
        canvas.width = width
        canvas.height = height
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
    window.addEventListener('resize', handleResize)
    window.requestAnimationFrame(animate)
}
