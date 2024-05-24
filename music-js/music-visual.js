import * as THREE from '../style/three.module.js';
import { initTriangle } from './triangle.js';
import { initDraw } from './draw.js';
import { initSquare } from './square.js';

export function initMusicVisualization(audioContext, analyser, baseCanvas, audioElement, bgType, colour1, colour2, colour3, midTwist, visChoice, squareBig) {

  let songDuration; // Variable to store the duration of the song
  let rectWidth = 0;
  let interval;

  let triInst;
  let drawInst;
  let squInst;
  let squActive = false;

  // Get the button element
  //const playButton = document.getElementById('playButton');
  const bg_canvas = document.createElement("canvas");
  const bg = bg_canvas.getContext('2d');
  baseCanvas.appendChild(bg_canvas);

  // Set the canvas size
  bg_canvas.width = 1000;
  bg_canvas.height = 1000;

  bg_canvas.style.position = "absolute";
  bg_canvas.style.top = "0";
  bg_canvas.style.left = "100";


  // Set up the canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  baseCanvas.appendChild(canvas);

  // Set the canvas size
  canvas.width = 1000;
  canvas.height = 1000;

  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "100";

  audioElement.volume = 0.05;

  // Analyser settings
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  let centerX;
  let centerY;

  let bass = 0;
  let mid = 0;
  let high = 0; 


  function getFrequencyRangeAmount(dataArray, startFreq, endFreq) {
      // Calculate the index range corresponding to the frequency range
      const startIdx = Math.floor(startFreq / (audioContext.sampleRate / analyser.fftSize));
      const endIdx = Math.floor(endFreq / (audioContext.sampleRate / analyser.fftSize));
    
      // Calculate the sum of amplitude values within the frequency range
      let sum = 0;
      for (let i = startIdx; i <= endIdx; i++) {
        sum += dataArray[i] / 255; // Normalize the amplitude value to be in the range [0, 1]
      }
    
      // Calculate the average amplitude value within the frequency range
      const average = sum / (endIdx - startIdx + 1);
    
      return average;
  }

  // Animation loop
  function animate() {
      // Calculate bass, mid, and high amounts
      bass = getFrequencyRangeAmount(dataArray, 1, 150);
      mid = getFrequencyRangeAmount(dataArray, 150, 3000) * 1.2;
      high = getFrequencyRangeAmount(dataArray, 3500, 15000) * 1.2; 

      // Update dataArray with audio data
      analyser.getByteFrequencyData(dataArray);
      
      // Your 2D drawing code here
      visualization();

      // Repeat the animation
      requestAnimationFrame(animate);
  }

  // Start the animation loop
  audioElement.addEventListener('loadedmetadata', function() {
    audioElement.muted = false;
    audioElement.play();
    songDuration = audioElement.duration;
    rectWidth = canvas.width / songDuration;
    console.log(songDuration);
    interval = songDuration * 1000/82;
    console.log(interval);
    if (bgType == "dynamic") {
      bg.filter = "blur(3px)";
      drawDynamicBackground();
    } else if (bgType === "gradient") {
      gradientBackground();
    } else {
      simpleBackground();
    }
    animate();
  });


  // Function to draw the visualization
  function visualization() {
    switch(visChoice) {
      case "triangle":
        triInst = initTriangle(bass, mid, high, canvas, ctx);
        triInst.drawVisualization()
        break;
      case "draw":
        drawInst = initDraw(bass, mid, high, canvas, ctx, midTwist, centerX, centerY);
        drawInst.drawVisualization();
        const updatedCenter = drawInst.getCenter();
        centerX = updatedCenter.centerX;
        centerY = updatedCenter.centerY;
        break;
      case "square":
        if (!squInst) {
          squInst = initSquare(canvas, ctx, squareBig);
          setInterval(() => squInst.drawVisualization(), interval);
          squActive = false;
        } else {
          squInst.updateData(bass, mid, high);
        }
        break;
      default:
        console.log(`no valid visChoice ${visChoice}`);
    }
  }

  function downloadPic() {
    // Get the 2D context of the new canvas
    const combinedCanvas = document.createElement('canvas');
    const combinedContext = combinedCanvas.getContext('2d');
    
    // Set the size of the new canvas
    combinedCanvas.width = canvas.width; // Adjust the width to your canvas size
    combinedCanvas.height = canvas.height; // Adjust the height to your canvas size

    // Draw background canvas onto the combined canvas
    combinedContext.drawImage(bg_canvas, 0, 0);

    // Draw main canvas onto the combined canvas
    combinedContext.drawImage(canvas, 0, 0);

    // Create a data URL containing the content of the combined canvas
    const dataURL = combinedCanvas.toDataURL("image/png");

    // Create a download link
    const downloadLink = document.createElement("a");
    downloadLink.href = dataURL;
    downloadLink.download = "music_art.png";

    // Append the download link to the document
    document.body.appendChild(downloadLink);

    // Trigger a click on the download link
    downloadLink.click();

    // Remove the download link from the document
    document.body.removeChild(downloadLink);
  }

  // Function to remove the canvas
  function removeCanvas() {
    pauseSong();
    audioElement.load(); //reset audio element
    baseCanvas.removeChild(canvas);
    baseCanvas.removeChild(bg_canvas);
  }

  // Function to draw the dynamic background
  function drawDynamicBackground() {
    // Calculate the width of each rectangle based on the duration of the song

    let currentTime = 0;

    // Draw a rectangle every second
    const timer = setInterval(() => {
        // Calculate the color based on the current audio frame
        const hue = (bass + mid + high) / 3;
        const saturation = 0.6;
        const lightness = 0.5;

        console.log(rectWidth);

        // Use HSL color model for smooth color transitions
        const dynamicColor = `hsl(${360 * hue}, ${100 * saturation}%, ${100 * lightness}%)`;

        // Set the fill style to the dynamic color
        bg.fillStyle = dynamicColor;

        // Draw a rectangle at the current time
        bg.fillRect(currentTime, 0, rectWidth, bg_canvas.height);

        // Increment the time for the next rectangle
        currentTime += rectWidth;

        // stop drawing when the canvas is filled
        if (currentTime >= bg_canvas.width) {
            clearInterval(timer);
        }
    }, 1000); // draw every second
  }

  function gradientBackground() {
    // Create a linear gradient from top-left to bottom-right
    const gradient = bg.createLinearGradient(0, 0, bg_canvas.width, bg_canvas.height);
    gradient.addColorStop(0.3, colour1);
    gradient.addColorStop(1, colour2);

    // Fill the canvas with the gradient
    bg.fillStyle = gradient;
    bg.fillRect(0, 0, bg_canvas.width, bg_canvas.height);
  }

  function simpleBackground() {
    bg.fillStyle = colour3;
    bg.fillRect(0, 0, bg_canvas.width, bg_canvas.height);
  }


  // song handling 

  function pauseSong() {
    audioElement.pause();
  }

  function resumeSong() {
    audioElement.play();
  }

  function resetInst() {
    squInst = "";
    triInst = "";
    squInst = "";
  }

  // expose the removeCanvas function for external use
  return {
    removeCanvas,
    resetInst,
    downloadPic
  };
}
