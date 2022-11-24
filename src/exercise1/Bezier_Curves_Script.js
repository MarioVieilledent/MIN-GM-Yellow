/**
 * Not core of exercises, just better display.
 * 
 * This file provides additional variables and functions
 * in order to display properly Bezier curves, and provides
 * some interaction (move points with the mouse).
 */

// Elements to update HTML content
let value_t = document.getElementById('value_t');
let value_B00 = document.getElementById('value_B00');
let value_B01 = document.getElementById('value_B01');
let value_B02 = document.getElementById('value_B02');
let value_B03 = document.getElementById('value_B03');

// Canvas and context to draw graphics in web page
let canvas = document.getElementById('canvas');
const width = 800;
const height = 500;
let ctx = canvas.getContext('2d');

ctx.fillStyle = '#444342';
ctx.fillRect(0, 0, width, height);

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

    // Draw of curve
    drawCurve();
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
 * 
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