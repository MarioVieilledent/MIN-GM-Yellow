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
let canvas_bezier_holder = document.getElementById('bezier-curves-canvas-holder');
let canvas_bezier = document.getElementById('canvas-ex1');
let ctx_bezier = canvas_bezier.getContext('2d');
ctx_bezier.canvas.width = width;
ctx_bezier.canvas.height = height;

ctx_bezier.fillStyle = BG_CANVAS_COLOR;
ctx_bezier.fillRect(0, 0, width, height);

// Observer to resize the canvas when window is resized
function outputsize() {
    width = canvasHolder.offsetWidth - 60;
    height = canvasHolder.offsetHeight - 60;
    ctx_bezier.canvas.width = width;
    ctx_bezier.canvas.height = height;
}
// outputsize();
// new ResizeObserver(outputsize).observe(canvasHolder);

mousePressed = ''; // If the mouse is pressed or not (to move points)
mousePos = [0.0, 0.0]; // Position of mouse for moving points

/**
 * Draws the known elements for the Bezier curve (control polygons and its 4 points)
 */
function drawBasicsBezrier() {
    ctx_bezier.fillStyle = '#444342';
    ctx_bezier.fillRect(0, 0, width, height);

    // Draw of 4 control points
    drawPoint(ctx_bezier, B00, 9, WHITE);
    drawPoint(ctx_bezier, B01, 9, WHITE);
    drawPoint(ctx_bezier, B02, 9, WHITE);
    drawPoint(ctx_bezier, B03, 9, WHITE);

    // Draw of 3 lines
    drawLine(ctx_bezier, B00, B01, WHITE);
    drawLine(ctx_bezier, B01, B02, WHITE);
    drawLine(ctx_bezier, B02, B03, WHITE);
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
canvas_bezier.addEventListener('mousedown', () => {
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

canvas_bezier.addEventListener('mouseup', () => {
    mousePressed = '';
}, false);

/**
 * When user clicked on a control point:
 * 1) Modify coordinate of the point moved
 * 2) Calculate the whole new Bezier curve
 */
function manageMouse(event) {
    mousePos = getMousePos(canvas_bezier, event);
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