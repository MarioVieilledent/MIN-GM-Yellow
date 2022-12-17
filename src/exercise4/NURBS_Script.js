/**
 * This file is not the core of exercise, it just supports the display.
 * 
 * This file provide function to display points, lines, arrow and curve
 * with color in the canvas context.
 */

// Canvas and context to draw graphics in web page
let canvas_nurbs_holder = document.getElementById('nurbs-canvas-holder');
let canvas_nurbs = document.getElementById('canvas-ex4');
let ctx_nurbs = canvas_nurbs.getContext('2d');
ctx_nurbs.canvas.width = width;
ctx_nurbs.canvas.height = height;

ctx_nurbs.fillStyle = BG_CANVAS_COLOR;
ctx_nurbs.fillRect(0, 0, width, height);

/**
 * Event listener for mouse (to move the control points around)
 */
canvas_nurbs.addEventListener('mousedown', () => {
}, false);

canvas_nurbs.addEventListener('mouseup', () => {
}, false);

/**
 * When user clicked on a control point:
 * 1) Modify coordinate of the point moved
 * 2) Calculate the whole new Bezier curve
 */
function manageMouse_nurbs(event) {
}

/**
 * Return mouse position on canvas
 */
function getmousePos_nurbs(evt) {
}