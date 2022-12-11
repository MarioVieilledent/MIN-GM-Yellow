/**
 * This file is not the core of exercise, it just supports the display.
 * 
 * This file provide function to display points, lines, arrow and curve
 * it is also in charge of animation and interaction with the curve.
 */

// Animation
const fps = 60.0; // Refresh rate for the animations
let delay = 1000.0 / fps; // Delay in ms between each frame
let reverse = false; // Once t reached 1, t goes back to 0 (reverse is then true)

let alreadyInit = false; // Init only once Bézier curves animation
let interval; // Animation of Bézier curve


// Main object with which the animation and the interaction is made
let bezierCurve = new BezierCurve;

/**
 * Function called when user open the page for Bézier curves
 */
function initBezrierCurves() {
    if (!alreadyInit) {
        alreadyInit = true;
        // First step, we calculate once the first Bezier curve
        bezierCurve.DeCasteljau();

        // Setup of an infinite loop with delay for animation
        interval = setInterval(() => {
            drawIntermediates(bezierCurve.t);
            !reverse && bezierCurve.t < 1.0 ? bezierCurve.t += bezierCurve.step : reverse = true;
            reverse && bezierCurve.t > 0.0 ? bezierCurve.t -= bezierCurve.step : reverse = false;
        }, delay);
    }
}

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
function drawBasicsBezier() {
    ctx_bezier.fillStyle = '#444342';
    ctx_bezier.fillRect(0, 0, width, height);

    // Draw of 4 control points
    drawPoint(ctx_bezier, bezierCurve.B00, controlPointRadius, GREY);
    drawPoint(ctx_bezier, bezierCurve.B01, controlPointRadius, GREY);
    drawPoint(ctx_bezier, bezierCurve.B02, controlPointRadius, GREY);
    drawPoint(ctx_bezier, bezierCurve.B03, controlPointRadius, GREY);

    // Draw Bernstein polynomial for each control point
    drawPoint(ctx_bezier, bezierCurve.B00, controlPointRadius * Math.abs(bezierCurve.Bpol30(bezierCurve.t)), WHITE);
    drawPoint(ctx_bezier, bezierCurve.B01, controlPointRadius * Math.abs(bezierCurve.Bpol31(bezierCurve.t)), WHITE);
    drawPoint(ctx_bezier, bezierCurve.B02, controlPointRadius * Math.abs(bezierCurve.Bpol32(bezierCurve.t)), WHITE);
    drawPoint(ctx_bezier, bezierCurve.B03, controlPointRadius * Math.abs(bezierCurve.Bpol33(bezierCurve.t)), WHITE);


    // Draw of 3 lines
    drawLine(ctx_bezier, bezierCurve.B00, bezierCurve.B01, WHITE);
    drawLine(ctx_bezier, bezierCurve.B01, bezierCurve.B02, WHITE);
    drawLine(ctx_bezier, bezierCurve.B02, bezierCurve.B03, WHITE);
}


/**
 * Given a t, draws intermediate points, lines and the tangent vector
 */
function drawIntermediates(t) {
    drawBasicsBezier(); // Draws the control points
    updateDom(); // Displays values (like value of t) into the web page

    // Gets index for the list with rounding t * steps into an integer
    let index = Math.round(t * bezierCurve.steps);
    if (index < 0) { index = 0 }
    if (index >= bezierCurve.curve.length) { index = bezierCurve.curve.length - 1 }

    // Retrieves all intermediate points and tangent vector stored
    let B10 = bezierCurve.curve[index][0];
    let B11 = bezierCurve.curve[index][1];
    let B12 = bezierCurve.curve[index][2];
    let B20 = bezierCurve.curve[index][3];
    let B21 = bezierCurve.curve[index][4];
    let B30 = bezierCurve.curve[index][5];
    let tangentVector = bezierCurve.curve[index][6];

    // Draws B1 points and lines
    drawLine(ctx_bezier, B10, B11, BLUE);
    drawLine(ctx_bezier, B11, B12, BLUE);
    drawPoint(ctx_bezier, B10, 5, BLUE);
    drawPoint(ctx_bezier, B11, 5, BLUE);
    drawPoint(ctx_bezier, B12, 5, BLUE);

    // Draws B2 points and tangent line
    drawLine(ctx_bezier, B20, B21, GREEN);
    drawPoint(ctx_bezier, B20, 5, GREEN);
    drawPoint(ctx_bezier, B21, 5, GREEN);

    // Draws B3 point
    drawPoint(ctx_bezier, B30, 5, RED);

    // Draws the tangent vector
    // The display of tangent vector is an arrow starting from B30 and pointing to B30 + tangentVector
    if (reverse) {
        // If the animation is going backwards (from t=1 to t=0), the arrow should be in the opposite direction, same length
        drawArrow(ctx_bezier, B30, [B30[0] - tangentVector[0], B30[1] - tangentVector[1]], YELLOW);
    } else {
        drawArrow(ctx_bezier, B30, [B30[0] + tangentVector[0], B30[1] + tangentVector[1]], YELLOW);
    }

    // Draw of the Bézier curve
    drawBezierCurve(ctx_bezier, bezierCurve);
}

/**
 * Updates the HTML document to display numerical values
 */
function updateDom() {
    value_t.innerHTML = (bezierCurve.t).toFixed(2);

    value_B00.innerHTML = (`[${bezierCurve.B00[0]}, ${bezierCurve.B00[1]}]`);
    value_B01.innerHTML = (`[${bezierCurve.B01[0]}, ${bezierCurve.B01[1]}]`);
    value_B02.innerHTML = (`[${bezierCurve.B02[0]}, ${bezierCurve.B02[1]}]`);
    value_B03.innerHTML = (`[${bezierCurve.B03[0]}, ${bezierCurve.B03[1]}]`);
}

/**
 * Event listener for mouse (to move the control points around)
 */
canvas_bezier.addEventListener('mousedown', () => {
    if (getDistance(mousePos, bezierCurve.B00) < controlPointRadius) {
        mousePressed = 'B00';
    }
    if (getDistance(mousePos, bezierCurve.B01) < controlPointRadius) {
        mousePressed = 'B01';
    }
    if (getDistance(mousePos, bezierCurve.B02) < controlPointRadius) {
        mousePressed = 'B02';
    }
    if (getDistance(mousePos, bezierCurve.B03) < controlPointRadius) {
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
        case 'B00': bezierCurve.B00 = mousePos; bezierCurve.DeCasteljau(); break;
        case 'B01': bezierCurve.B01 = mousePos; bezierCurve.DeCasteljau(); break;
        case 'B02': bezierCurve.B02 = mousePos; bezierCurve.DeCasteljau(); break;
        case 'B03': bezierCurve.B03 = mousePos; bezierCurve.DeCasteljau(); break;
    }
}

/**
 * Return mouse position on canvas
 */
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return [evt.clientX - rect.left, evt.clientY - rect.top];
}