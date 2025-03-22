import fs from 'fs';
import { createCanvas } from 'canvas';

const sizes = [16, 48, 128];

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#4F46E5'; // Indigo color
  ctx.fillRect(0, 0, size, size);

  // Clock circle
  ctx.beginPath();
  ctx.arc(size/2, size/2, size*0.4, 0, Math.PI * 2);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = size * 0.1;
  ctx.stroke();

  // Clock hands
  ctx.beginPath();
  ctx.moveTo(size/2, size/2);
  ctx.lineTo(size/2, size*0.3); // Hour hand
  ctx.strokeStyle = 'white';
  ctx.lineWidth = size * 0.08;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(size/2, size/2);
  ctx.lineTo(size*0.7, size/2); // Minute hand
  ctx.strokeStyle = 'white';
  ctx.lineWidth = size * 0.06;
  ctx.stroke();

  // Save the icon
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/icon${size}.png`, buffer);
}

// Create public directory if it doesn't exist
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// Generate icons for all sizes
sizes.forEach(generateIcon);
console.log('Icons generated successfully!'); 