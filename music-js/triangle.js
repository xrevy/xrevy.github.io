export function initTriangle(bass, mid, high, canvas, ctx) {

    // Function to draw the visualization
    function drawVisualization() {
        // important function to map a certain value from its own range to another
        const clampNumber = (num, inMin, inMax, outMin, outMax) =>
            ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

        const r = clampNumber(bass, 0, 0.8, 0, 255);
        const g = clampNumber(mid, 0, 0.7, 0, 255);
        const b = clampNumber(high, 0, 0.3, 0, 255);

        const bassY = clampNumber(bass, 0, 0.8, -200, 400);
        const midX = clampNumber(mid, 0, 0.7, -300, 450);
        const highX = clampNumber(high, 0, 0.4, -300, 200);
        const highY = clampNumber(high, 0, 0.3, -400, 130);

        const absAnalysis = 1 + (bass + mid + high) * 0.2;
        

        var path = new Path2D();
        path.moveTo(600 * absAnalysis + bass * 200, 550 + bassY); // bass point
        path.lineTo(400 * absAnalysis - midX, 550 - mid * 250);
        path.lineTo(500 * absAnalysis + highX, 450 - highY);
        path.closePath();

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.01)`;
        ctx.strokeStyle = "rgba(10, 10, 10, 0.3)";
        ctx.lineWidth = 1;

        // Stroke the path first
        ctx.stroke(path);

        // Then fill the path
        ctx.fill(path);
    }
    return {
        drawVisualization
    }
}