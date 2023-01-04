/**
 * This file is not the core of exercise, it just supports the display.
 * 
 * This file provide function to display points, lines, arrow and curve
 * with color in the canvas context.
 */

let nurbs; // Nurb object that is displayed

let mousePressed_nurbs = -1; // If the mouse is pressed or not, and witch point is pressed
let mousePos_nurbs = [0.0, 0.0]; // Position of mouse for moving points

// User input for weights
const Wi_input_selector = document.getElementById('Wi_input_selector');

const localStorageWi = 'localStorageWi';

let WiOk = true;

// When user change weights
Wi_input_selector.addEventListener('change', event => {
    setUpNurbs();
    // Check if input is valid and change weights
    nurbs.w = format(event.target.value, Wi_input_selector);
    window.localStorage.setItem(localStorageWi, JSON.stringify(nurbs.w));
    setUpNurbs();
});

// Animation
let iNurbs = 0; // index for variable t
let reveresNurbs = false; // Direction of animation
const stepNurbs = 700; // Steps for t going from 0 to 1

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
    nurbs.b = [[100, 100], [400, 300], [150, 400], [200, 300]];
    Wi_input_selector.value = nurbs.w;

    // Set n and control points
    setUpNurbs();

    nurbs.rationalerDeCasteljau(0.5);

    const step = 0.01;

    // Setup of an infinite loop with delay for animation
    interval = setInterval(() => {
        // Resets canvas
        ctx_nurbs.fillStyle = '#444342';
        ctx_nurbs.fillRect(0, 0, width, height);

        if (UiOk) {
            // Draws the control points
            nurbs.b.forEach(controlPoint => {
                drawPoint(ctx_nurbs, controlPoint, 12, GREY);
            });

            // Draws control polygon
            for (let i = 0; i < nurbs.n; i++) {
                drawLine(ctx_nurbs, nurbs.b[i], nurbs.b[i + 1], WHITE);
            }

            // Saves all points of NURBS
            let pointsNurbs = [];
            for (let tIndex = 0; tIndex <= stepNurbs; tIndex++) {
                pointsNurbs.push(nurbs.rationalerDeCasteljau(tIndex / stepNurbs));
            }

            // Animation
            reveresNurbs && iNurbs > 0 ? iNurbs-- : reveresNurbs = false;
            !reveresNurbs && iNurbs < stepNurbs ? iNurbs++ : reveresNurbs = true;

            // Draws the moving point and its value for animation
            drawPoint(ctx_nurbs, pointsNurbs[iNurbs].bt[nurbs.n][0], 6, RED);
            drawText(ctx_nurbs, [pointsNurbs[iNurbs].bt[nurbs.n][0][0] - 15, pointsNurbs[iNurbs].bt[nurbs.n][0][1] - 12], `u=${(iNurbs / stepNurbs).toFixed(2)}`, 12, WHITE);

            // Draws intermediate points and lines
            for (let a = 1; a < nurbs.n; a++) {
                for (let b = 0; b <= nurbs.n - a - 1; b++) {
                    drawPoint(ctx_nurbs, pointsNurbs[iNurbs].bt[a][b], 4, BLUE);
                    drawPoint(ctx_nurbs, pointsNurbs[iNurbs].bt[a][b + 1], 4, BLUE);
                    drawLine(ctx_nurbs, pointsNurbs[iNurbs].bt[a][b], pointsNurbs[iNurbs].bt[a][b + 1], BLUE);
                }
            }

            // Draws the curve
            for (let i = 0; i < pointsNurbs.length - 1; i++) {
                drawLine(ctx_nurbs, pointsNurbs[i].bt[nurbs.n][0], pointsNurbs[i + 1].bt[nurbs.n][0], RED);
            }


            // Draws the tangent vector
            if (reveresNurbs) {
                drawArrow(ctx_nurbs, pointsNurbs[iNurbs].bt[nurbs.n][0],
                    [pointsNurbs[iNurbs].bt[nurbs.n][0][0] - pointsNurbs[iNurbs].tv[0],
                    pointsNurbs[iNurbs].bt[nurbs.n][0][1] - pointsNurbs[iNurbs].tv[1]],
                    YELLOW);
            } else {
                drawArrow(ctx_nurbs, pointsNurbs[iNurbs].bt[nurbs.n][0],
                    [pointsNurbs[iNurbs].bt[nurbs.n][0][0] + pointsNurbs[iNurbs].tv[0],
                    pointsNurbs[iNurbs].bt[nurbs.n][0][1] + pointsNurbs[iNurbs].tv[1]],
                    YELLOW);
            }
        }
    }, delay);
}

/**
 * Knowing the weights, sets up n value and d control points 
 */
function setUpNurbs() {
    // Change n so it's the number of weights
    nurbs.n = nurbs.w.length - 1;
    // Add or remove control points if needed
    while (nurbs.b.length > nurbs.n + 1) {
        nurbs.b.pop();
    }
    while (nurbs.b.length < nurbs.n + 1) {
        nurbs.b.push([Math.floor(Math.random() * width), Math.floor(Math.random() * height)]);
    }
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