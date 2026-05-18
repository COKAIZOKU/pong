if (typeof document !== 'undefined') {
    const { body } = document

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
    const paddleWidth = 15
    let paddleRightY = 225
    let paddleLeftY = 225

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
    }
    const createCanvas = () => {
        canvas.width = width
        canvas.height = height
        body.appendChild(canvas)
        renderCanvas()
    }
    createCanvas()
}
