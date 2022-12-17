/**
 * This file is not the core of exercise, it just supports the display.
 * 
 * This file provide function to display points, lines, arrow and curve
 * with color in the canvas context.
 */

let nurbs; // Nurb object that is displayed

mousePressed_nurbs = -1; // If the mouse is pressed or not, and witch point is pressed
mousePos_nurbs = [0.0, 0.0]; // Position of mouse for moving points

// User input for weights
const Wi_input_selector = document.getElementById('Wi_input_selector');

const localStorageWi = 'localStorageWi';

let WiOk = true;

Wi_input_selector.addEventListener('change', event => {
    nurbs.w = format(event.target.value, Wi_input_selector);
    window.localStorage.setItem(localStorageWi, JSON.stringify(nurbs.w));
});

// Canvas and context to draw graphics in web page
let canvas_nurbs_holder = document.getElementById('nurbs-canvas-holder');
let canvas_nurbs = document.getElementById('canvas-ex4');
let ctx_nurbs = canvas_nurbs.getContext('2d');
ctx_nurbs.canvas.width = width;
ctx_nurbs.canvas.height = height;

ctx_nurbs.fillStyle = BG_CANVAS_COLOR;
ctx_nurbs.fillRect(0, 0, width, height);

/**
 * Function that create the nurbs to display
 */
function initNurbs() {
    nurbs = new NURBS();

    // Get saved values in localStorage

    nurbs.n = 3;
    nurbs.w = getWeightsLocalStorage();
    nurbs.b = [[100, 100], [200, 600], [700, 300], [400, 300]];

    Wi_input_selector.value = nurbs.w;

    nurbs.rationalerDeCasteljau(0.5);

    const step = 0.01;

    // Setup of an infinite loop with delay for animation
    interval = setInterval(() => {
        // Resets canvas
        ctx_nurbs.fillStyle = '#444342';
        ctx_nurbs.fillRect(0, 0, width, height);

        // Draws the control points
        nurbs.b.forEach(controlPoint => {
            drawPoint(ctx_nurbs, controlPoint, 12, GREY);
        });

        // Draw the NURBS
        if (UiOk) {
            for (let t = 0.0; t < 1; t += step) {
                drawLine(ctx_nurbs, nurbs.rationalerDeCasteljau(t)[3][0], nurbs.rationalerDeCasteljau(t + step)[3][0], RED);
            }
        }
    }, delay);
}

function getWeightsLocalStorage() {
    let lsw = localStorage.getItem(localStorageWi);
    if (lsw) {
        return JSON.parse(lsw);
    } else {
        return [1, 2, 2, 1];
    }
}

/**
 * Event listener for mouse (to move the control points around)
 */
canvas_nurbs.addEventListener('mousedown', () => {
    nurbs.b.forEach((bi, index) => {
        if (getDistance(mousePos_nurbs, bi) < controlPointRadius) {
            mousePressed_nurbs = index;
        }
    });
}, false);

canvas_nurbs.addEventListener('mouseup', () => {
    mousePressed_nurbs = -1;
}, false);

/**
 * When user clicked on a control point:
 * 1) Modify coordinate of the point moved
 * 2) Calculate the whole new Bezier curve
 */
function manageMouse_nurbs(event) {
    mousePos_nurbs = getmousePos_nurbs(event);
    nurbs.b[mousePressed_nurbs] = mousePos_nurbs;
}

/**
 * Return mouse position on canvas
 */
function getmousePos_nurbs(evt) {
    let rect = canvas_nurbs.getBoundingClientRect();
    return [evt.clientX - rect.left, evt.clientY - rect.top];
}