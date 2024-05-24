export function initSquare(canvas, ctx, squareBig) {
    // Calculate the interval between each square placement
    let bass;
    let mid;
    let high;

    let maxSize;

    if (squareBig) {
        maxSize = 220;
    } else {
        maxSize = 90;
    }

    // Counter for tracking the current square placement
    let squareX = 1;
    let squareY = 1;

    // Function to draw the visualization
    function drawVisualization() {

        const clampNumber = (num, inMin, inMax, outMin, outMax) =>
            ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

        const g = clampNumber(bass, 0, 0.8, 0, 255);
        const b = clampNumber(mid, 0, 0.7, 0, 255);
        const r = clampNumber(high, 0, 0.5, 0, 255);


        const absAnalysis = bass + mid + high;
        console.log(absAnalysis);

        const nextPosX = 50 * squareX *2;
        const nextPosY = 50 * squareY *2;
        //const squareSize = 30 * absAnalysis * 1.6;
        const squareSize = clampNumber(absAnalysis, 0, 1.7, 10, maxSize);


        // Calculate the position of the current square
        const x = nextPosX - squareSize/2;
        const y = nextPosY - squareSize/2;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.6)`;
        ctx.fillRect(x, y, squareSize, squareSize);
        
        // for enxt pos
        nextPos();
    }

    function nextPos() {
        squareX ++;
        const nextPosX = 50 * squareX *2;
        if (nextPosX > canvas.width -50) {
            squareX = 1;
            squareY ++;
        }
        console.log(squareX);
        const nextPosY = 50 * squareY *2;
        if (nextPosY > canvas.height -50) {
            squareY = 15;
        }
        console.log(squareY);
    }

    function updateData(bassNew, midNew, highNew) {
        bass = bassNew;
        mid = midNew;
        high = highNew;
    }
    return {
        drawVisualization,
        updateData
    }

    // Set interval for periodic visualization updates
    //const intervalId = setInterval(drawVisualization, 2000);
}