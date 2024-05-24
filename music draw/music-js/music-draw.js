import * as THREE from '../src/three.module.js';

//file path to audio file
const filePath = "../music-files/Down With All The Sober Freaks - Mashup Germany (Tracey Video Remix).mp3"

// Get the button element
const playButton = document.getElementById('playButton');

// Set up the canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

// Set the canvas size
canvas.width = 1000;
canvas.height = 1000;

// Set the background color to black
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);




// Web Audio API setup
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();

// Connect audio source to analyser
const audioElement = new Audio(filePath);
audioElement.volume = 0.01;
const audioSource = audioContext.createMediaElementSource(audioElement);
audioSource.connect(analyser);
analyser.connect(audioContext.destination);

// Analyser settings
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// initial line properties
let rotationSpeed = 0;
let lineLengthM = 0; // minimun length
let lineLengthH = 0;

let angle = 0;
let angle2 = Math.PI;  // Start the second endpoint at a right angle
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

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
    bass = getFrequencyRangeAmount(dataArray, 20, 200);
    mid = getFrequencyRangeAmount(dataArray, 200, 2000);
    high = getFrequencyRangeAmount(dataArray, 2000, 5000); 

    // Update dataArray with audio data
    analyser.getByteFrequencyData(dataArray);

    // Calculate rotation speed based on bass
    rotationSpeed = bass * 0.1; // Adjust multiplier for desired speed

    // Calculate line length based on mid and high sounds
    lineLengthM = mid * 700; // Adjust multiplier for desired length
    lineLengthH = high * 700

    // Your 2D drawing code here
    drawVisualization();

    // Repeat the animation
    requestAnimationFrame(animate);
}

// Start the animation loop
audioElement.muted = false;
audioElement.play();
animate();

// Function to draw the visualization
function drawVisualization() {
  // Your drawing logic based on audio data
  ctx.fillStyle = 'rgba(0, 0, 0, 0.005)'; // Adjust alpha for fading effect
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  let posX = 50 + canvas.width * bass * 1.4;
  let posY = 50 + canvas.height * high * 5; 

  console.log(high);

  // Calculate line end point
  const endX = posX + lineLengthM * Math.cos(angle);
  const endY = posY + lineLengthM * Math.sin(angle);
  const beginX = posX + lineLengthH * Math.cos(angle2);
  const beginY = posY + lineLengthH * Math.sin(angle2);

  // Calculate color based on rotation angle
  const hue = (angle % (2 * Math.PI)) / (2 * Math.PI);
  const saturation = 1;
  const lightness = 0.5;

  angle += 0.02;
  angle2 += 0.02;

  // Use HSL color model for smooth color transitions
  const color = `hsl(${360 * hue}, ${100 * saturation}%, ${100 * lightness}%)`;

  // Decrease alpha for the first line to make it more vague
  const alpha = angle < Math.PI / 2 ? 0.1 : 1;

  // Draw the line
  ctx.beginPath();
  ctx.moveTo(beginX, beginY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.globalAlpha = alpha;
  ctx.stroke();
  ctx.globalAlpha = 1; // Reset globalAlpha to avoid affecting other drawings
}