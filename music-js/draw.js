export function initDraw(bass, mid, high, canvas, ctx, midTwist, centerX, centerY) {
    // Set the initial center position
    let baseCenterX = 0;
    let baseCenterY = 0;

    const clampNumber = (num, inMin, inMax, outMin, outMax) =>
            ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

    // Function to draw the visualization
    function drawVisualization() {

        // calculate new line point based on audio data
        //let endX = baseCenterX + bass * canvas.width * 1.2;
        //let endY = baseCenterY + high * canvas.height * 1.7;

        let endX = clampNumber(bass, 0, 0.85, 0, canvas.width);
        let endY = clampNumber(high, 0, 0.5, 0, canvas.height);

        //let endX = baseCenterX + bass * canvas.width * 1.2 + 50 * Math.sin(0.1 * bass);
        //let endY = baseCenterY + high * canvas.height * 1.7 + 50 * Math.cos(0.1 * high);

        // to be sure the lines don't go over the canvas
        if (endX > 1000) {
        endX = 1000;
        }
        if (endY > 1000) {
        endY = 1000;
        }
        if (midTwist) {
            if (mid > bass) {
                endX = canvas.width - endX;
            }
        }

        const randVal = Math.random() * 100;
        let soundAmt;

        if (randVal < 4) {
            soundAmt = mid * 7;
        } else if (randVal > 96) {
            soundAmt = high * 7;
        } else {
            soundAmt = mid * 4 - bass * 0.5 + high * 0.7;
        }
        console.log(high);

        // calculate colour based on sound analysis
        const hue = clampNumber(soundAmt, 0, 4, 0, 360);
        
        const saturation = clampNumber(bass, 0, 1, 0, 100);
        const lightness = clampNumber(high, 0, 0.5, 0, 100);
        //const lightness = high *2;

        // HSL colour mode for better customization possibilities
        const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

        // set alpha based on sound data
        const alpha = (bass * 0.3 + mid * 0.6 + high);

        ctx.lineJoin = "round";
        ctx.globalAlpha = alpha;
        // Draw the line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.stroke();

        // Update the center position for the next frame
        centerX = endX;
        centerY = endY;        
    }

    // to make new firstpoint accessable for the next iteration
    function getCenter() {
        // Return the updated center position
        return { centerX, centerY };
    }

    return {
        drawVisualization,
        getCenter,
        // Include the current center position in the returned object
        currentCenter: { centerX, centerY }
    };
}