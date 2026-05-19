if (typeof document !== 'undefined') {
    const { body } = document
    const scoreFontFamily = window.getComputedStyle(body).fontFamily

    //canvas codes
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) {
        throw new Error('2D context is not supported in this browser.')
    }
    const width = window.innerWidth
    const height = window.innerHeight

    //paddle code
    const paddleHeight = 150
    const paddleWidth = 20
    let paddleRightY = (height - paddleHeight) / 2
    let paddleLeftY = (height - paddleHeight) / 2
    //global variables
    let ballX = width / 2
    let ballY = height / 2
    const ballRadius = 15
    // score
    let playerScore = 0
    let botScore = 0
    const winningScore = 7

    //generating canvas
    const renderCanvas = () => {
        //canvas background
        context.fillStyle = 'black'
        context.fillRect( 0, 0, width, height)
        //paddle color
        context.fillStyle = 'white'
        //left paddle
        context.fillRect(30, paddleLeftY, paddleWidth, paddleHeight)
        //right paddle
        context.fillRect(width - paddleWidth - 30, paddleRightY, paddleWidth, paddleHeight)
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
    createCanvas()
}
