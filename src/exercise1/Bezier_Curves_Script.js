/**
 * This file is not the core of exercise, it just supports the display.
 * 
 * This file provide function to display points, lines, arrow and curve
 * with color in the canvas context.
 * 
 * There's also the code allowing user to move points in the canvas.
 */

// Elements to update HTML content
let value_t = document.getElementById('value_t');
let value_B00 = document.getElementById('value_B00');
let value_B01 = document.getElementById('value_B01');
let value_B02 = document.getElementById('value_B02');
let value_B03 = document.getElementById('value_B03');

// Canvas and context to draw graphics in web page
let canvasHolder = document.getElementById('bezier-curves-canvas-holder');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let width = 800;
let height = 500;
ctx.canvas.width = width;
ctx.canvas.height = height;

ctx.fillStyle = '#444342';
ctx.fillRect(0, 0, width, height);

// Observer to resize the canvas when window is resized
function outputsize() {
    width = canvasHolder.offsetWidth - 60;
    height = canvasHolder.offsetHeight - 60;
    ctx.canvas.width = width;
    ctx.canvas.height = height;
}
// outputsize();
// new ResizeObserver(outputsize).observe(canvasHolder);

const RED = '#de6666';
const GREEN = '#66de66';
const BLUE = '#6666de';
const YELLOW = '#dede66';
const MAGENTA = '#de66de';
const CYAN = '#66dede';
const BLACK = '#666666';
const WHITE = '#dedede';

mousePressed = ''; // If the mouse is pressed or not (to move points)
mousePos = [0.0, 0.0]; // Position of mouse for moving points

/**
 * Draws the known elements for the Bezier curve (control polygons and its 4 points)
 */
function drawBasics() {
    ctx.fillStyle = '#444342';
    ctx.fillRect(0, 0, width, height);

    // Draw of 4 control points
    drawPoint(B00, 9, WHITE);
    drawPoint(B01, 9, WHITE);
    drawPoint(B02, 9, WHITE);
    drawPoint(B03, 9, WHITE);

    // Draw of 3 lines
    drawLine(B00, B01, WHITE);
    drawLine(B01, B02, WHITE);
    drawLine(B02, B03, WHITE);
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
    ctx.strokeStyle = color;
    ctx.moveTo(p1[0], p1[1])
    ctx.lineTo(p2[0], p2[1])
    ctx.stroke();
}

/**
 * Draw an arrow in the canvas given two points
 * Function from https://stackoverflow.com/questions/808826/draw-arrow-on-canvas-tag
 */
function drawArrow(p1, p2, color) {
    let headlen = 10; // length of head in pixels
    let dx = p2[0] - p1[0];
    let dy = p2[1] - p1[1];
    let angle = Math.atan2(dy, dx);
    ctx.moveTo(p1[0], p1[1]);
    ctx.strokeStyle = color;
    ctx.lineTo(p2[0], p2[1]);
    ctx.stroke();
    ctx.lineTo(p2[0] - headlen * Math.cos(angle - Math.PI / 6), p2[1] - headlen * Math.sin(angle - Math.PI / 6));
    ctx.stroke();
    ctx.moveTo(p2[0], p2[1]);
    ctx.lineTo(p2[0] - headlen * Math.cos(angle + Math.PI / 6), p2[1] - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}

/**
 * Draws only the curve (whole curve so no need of variable t)
 */
function drawCurve() {
    for (let i = 0; i < curve.length - 1; i++) {
        drawLine(curve[i][5], curve[i + 1][5], RED);
    }
}

/**
 * Updates the HTML document to display numerical values
 */
function updateDom() {
    value_t.innerHTML = (t).toFixed(2);

    value_B00.innerHTML = (`[${B00[0]}, ${B00[1]}]`);
    value_B01.innerHTML = (`[${B01[0]}, ${B01[1]}]`);
    value_B02.innerHTML = (`[${B02[0]}, ${B02[1]}]`);
    value_B03.innerHTML = (`[${B03[0]}, ${B03[1]}]`);
}

/**
 * Event listener for mouse (to move the control points around)
 */
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

/**
 * When user clicked on a control point:
 * 1) Modify coordinate of the point moved
 * 2) Calculate the whole new Bezier curve
 */
function manageMouse(event) {
    mousePos = getMousePos(canvas, event);
    switch (mousePressed) {
        case 'B00': B00 = mousePos; calculateBezierCurve(); break;
        case 'B01': B01 = mousePos; calculateBezierCurve(); break;
        case 'B02': B02 = mousePos; calculateBezierCurve(); break;
        case 'B03': B03 = mousePos; calculateBezierCurve(); break;
    }
}

/**
 * Return mouse position on canvas
 */
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