let reverse = false;

const fps = 60.0; // Refresh rate for the animations
let delay = 1000.0 / fps;

let max = 300; // Number of steps to go from t=0 to t=1 for animations (each step is 1 frame)

let t = 0; // Variable modeling time or any x, B points are calculated depending on t: B(t)

// Set of the interval for animations
let interval = setInterval(() => {
    drawBezier(t);
    if (!reverse && t <= max) {
        t++;
    } else {
        reverse = true;
    }
    if (reverse && t >= 0) {
        t--;
    } else {
        reverse = false;
    }
}, delay);

// Elements to update HTML content
let value_t = document.getElementById('value_t');

// Canvans and context to draw graphics in web page
let canvas = document.getElementById('canvas');
const width = 800;
const height = 500;
let ctx = canvas.getContext('2d');

ctx.fillStyle = '#444342';
ctx.fillRect(0, 0, width, height);

const red = '#de6666';
const green = '#66de66';
const blue = '#6666de';

mousePressed = ''; // If the mouse is pressed or not (to move points)
mousePos = [0.0, 0.0]; // Position of mouse for moving points

// 4 control points
let B00 = [40, 40];
let B01 = [100, 12];
let B02 = [310, 250];
let B03 = [200, 400];

/**
 * Draw all points for Bézier curve (B1, B2 and B3)
 */
function drawBezier(t) {
    drawBasics();
    updateDom();

    B10 = [B00[0] + t * (B01[0] - B00[0]) / max, B00[1] + t * (B01[1] - B00[1]) / max];
    B11 = [B01[0] + t * (B02[0] - B01[0]) / max, B01[1] + t * (B02[1] - B01[1]) / max];
    B12 = [B02[0] + t * (B03[0] - B02[0]) / max, B02[1] + t * (B03[1] - B02[1]) / max];

    drawLine(B10, B11, blue);
    drawLine(B11, B12, blue);
    drawPoint(B10, 5, blue);
    drawPoint(B11, 5, blue);
    drawPoint(B12, 5, blue);

    B20 = [B10[0] + t * (B11[0] - B10[0]) / max, B10[1] + t * (B11[1] - B10[1]) / max];
    B21 = [B11[0] + t * (B12[0] - B11[0]) / max, B11[1] + t * (B12[1] - B11[1]) / max];

    drawLine(B20, B21, green);
    drawPoint(B20, 5, green);
    drawPoint(B21, 5, green);

    B30 = [B20[0] + t * (B21[0] - B20[0]) / max, B20[1] + t * (B21[1] - B20[1]) / max];

    drawPoint(B30, 5, red);
}

/**
 * Draws the known elements for the Bézier curve (control polygons and its 4 points)
 */
function drawBasics() {
    ctx.fillStyle = '#444342';
    ctx.fillRect(0, 0, width, height);

    drawLine(B00, B01);
    drawLine(B01, B02);
    drawLine(B02, B03);

    drawPoint(B00, 9, red);
    drawPoint(B01, 9, red);
    drawPoint(B02, 9, red);
    drawPoint(B03, 9, red);
}

/**
 * Draws a point in the canvas given x and y
 * @param {*} point, array of two numbers [x, y]
 * @param {*} radius of the point (number)
 * @param {*} color, hex value for the point's color
 */
function drawPoint(point, radius, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(point[0], point[1], radius, 0.0, 2.0 * Math.PI);
    ctx.fill();
}

/**
 * Draw a line in the canvas given two points
 */
function drawLine(p1, p2, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(p1[0], p1[1])
    ctx.lineTo(p2[0], p2[1])
    ctx.stroke();
}

/**
 * Updates the HTML document to display numerical values
 */
function updateDom() {
    value_t.innerHTML = (t / max).toFixed(2);
}

canvas.addEventListener('mousedown', () => {
    if (getDistance(mousePos, B00) < 10) {
        mousePressed = 'B00';
    }
    if (getDistance(mousePos, B01) < 10) {
        mousePressed = 'B01';
    }
    if (getDistance(mousePos, B02) < 10) {
        mousePressed = 'B02';
    }
    if (getDistance(mousePos, B03) < 10) {
        mousePressed = 'B03';
    }
}, false);

canvas.addEventListener('mouseup', () => {
    mousePressed = '';
}, false);

function manageMouse(event) {
    mousePos = getMousePos(canvas, event);
    switch (mousePressed) {
        case 'B00': B00 = mousePos; break;
        case 'B01': B01 = mousePos; break;
        case 'B02': B02 = mousePos; break;
        case 'B03': B03 = mousePos; break;
    }
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return [evt.clientX - rect.left, evt.clientY - rect.top];
}

/**
 * Return distance between two points
 */
function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2[0] - p1[0], 2.0) + Math.pow(p2[1] - p1[1], 2.0));
}