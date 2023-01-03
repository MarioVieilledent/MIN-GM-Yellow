/**
 * This file is not the core of exercise, it just supports the display.
 * 
 * This file provide function to display points, lines, arrow and curve
 * with color in the canvas context.
 */

// Local Storage (save Ui, Di, and n values)
const localStorageUI = 'localStorageUI';
// const localStorageDI = 'localStorageDI';
const localStorageN = 'localStorageN';

// n value (stored in localStorage)
let n = 2;
let nSaved = window.localStorage.getItem(localStorageN);
nSaved ? n = parseInt(nSaved) : {};

// Ui values (stored in localStorage)
let Ui = [];
let UiSaved = window.localStorage.getItem(localStorageUI);
UiSaved ? Ui = JSON.parse(UiSaved) : Ui = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// Animation
let uIndex = 0; // Index for parameter u for animation
let reverseBSpline = false; // Animation going in two directions
let BSplineStep = 0.1; // Step between each frame

// Canvas and context to draw graphics in web page
let canvas_splines_holder = document.getElementById('b-splines-canvas-holder');
let canvas_splines = document.getElementById('canvas-ex3');
let ctx_splines = canvas_splines.getContext('2d');
ctx_splines.canvas.width = width;
ctx_splines.canvas.height = height;

ctx_splines.fillStyle = BG_CANVAS_COLOR;
ctx_splines.fillRect(0, 0, width, height);

// Plotting the graph into the canvas
let xRange = 0.0; // x range of scaled graph
let yRange = 0.0; // y range of scaled graph
let xMin = 0.0;
let xMax = 0.0;
let yMin = 0.0;
let yMax = 0.0;
let aX = 0.0; // slope for abscissa transformation of graph
let bX = 0.0; // y-intercept for abscissa transformation of graph
let aY = 0.0; // slope for ordinate transformation of graph
let bY = 0.0; // y-intercept for ordinate transformation of graph
const ProportionOfHeightForGraph = 0.8; // Between 0 and 1,
// the rest is for the bottom part of the canvas (display of Ui)
let graphHeight = ProportionOfHeightForGraph * height;

// Dom input of user input 
const n_input_selector = document.getElementById('n_input_selector');
const Ui_input_selector = document.getElementById('Ui_input_selector');

let alreadyInitBSpline = false;

mousePressed_bSplines = -1; // If the mouse is pressed or not, and witch point is pressed
mousePos_bSplines = [0.0, 0.0]; // Position of mouse for moving points

let UiOk = true; // If input is valid, process the calculus

// Get event on change of these inputs
n_input_selector.addEventListener('change', event => {
    n = parseInt(event.target.value);
    window.localStorage.setItem(localStorageN, JSON.stringify(n));
    drawBSplines();
});

Ui_input_selector.addEventListener('change', event => {
    Ui = format(event.target.value, Ui_input_selector);
    window.localStorage.setItem(localStorageUI, JSON.stringify(Ui));
    drawBSplines();
});

/**
 * Create n randoms D control points
 */
function createRandomDi() {
    Di = [];
    for (let i = 0; i < (Ui.length - n + 1); i++) {
        Di.push([
            scaleX(epsilons[i]),
            Math.floor(Math.random() * (graphHeight - controlPointRadius - 12))
        ]);
    }
}

/**
 * Function called when user open the page for Bézier curves
 */
function initBSplines() {
    if (!alreadyInitBSpline) {
        alreadyInitBSpline = true;

        // Display in the HTML DOM the values for n, ui and di
        n_input_selector.value = '' + n;
        Ui_input_selector.value = Ui.join(', ');

        // Ui = format(JSON.stringify(Ui), Ui_input_selector);
        drawBSplines();

        // Setup of an infinite loop for recalculating BSpline and display animation
        interval = setInterval(() => {
            if (UiOk) {
                // Clears the canvas, draws control points and connecting lines
                drawBSplineBasics();

                // Calculates and store all points of the B-Spline
                const db = calculateDeBoor();

                // Draws the B-Spline with all points
                for (let i = 0; i < db.cp.length - 2; i++) {
                    drawLine(ctx_splines, db.cp[i][n][0], db.cp[i + 1][n][0], RED);
                }

                // Draws intermediate points and lines
                for (let a = 1; a < n; a++) {
                    for (let b = 0; b <= n - a - 1; b++) {
                        drawPoint(ctx_splines, db.cp[uIndex][a][b], 4, BLUE);
                        drawPoint(ctx_splines, db.cp[uIndex][a][b + 1], 4, BLUE);
                        drawLine(ctx_splines, db.cp[uIndex][a][b], db.cp[uIndex][a][b + 1], BLUE);
                    }
                }

                // Draws moving point with its value
                drawPoint(ctx_splines, db.cp[uIndex][n][0], 6, RED);
                drawText(ctx_splines, [db.cp[uIndex][n][0][0] - 15, db.cp[uIndex][n][0][1] - 12], `u=${db.uv[uIndex].toFixed(2)}`, 12, WHITE);

                // Draws the tangent vector
                if (reverseBSpline) {
                    drawArrow(ctx_splines, db.cp[uIndex][n][0],
                        [db.cp[uIndex][n][0][0] - db.tv[uIndex][0], db.cp[uIndex][n][0][1] - db.tv[uIndex][1]],
                        YELLOW);
                } else {
                    drawArrow(ctx_splines, db.cp[uIndex][n][0],
                        [db.cp[uIndex][n][0][0] + db.tv[uIndex][0], db.cp[uIndex][n][0][1] + db.tv[uIndex][1]],
                        YELLOW);
                }

                // Increment or decrement uIndex for animation
                !reverseBSpline && uIndex < db.tv.length - 1 ? uIndex++ : reverseBSpline = true;
                reverseBSpline && uIndex > 0 ? uIndex-- : reverseBSpline = false;
            }
        }, delay);
    }
}

/**
 * Clears the canvas, draws control points and connecting lines
 */
function drawBSplineBasics() {
    ctx_splines.fillStyle = '#444342';
    ctx_splines.fillRect(0, 0, width, graphHeight - 6);

    // Display control points
    Di.forEach(d => {
        drawPoint(ctx_splines, d, 12, GREY);
    });

    // Display lines between control points
    for (let i = 0; i < Di.length - 1; i++) {
        drawLine(ctx_splines, Di[i], Di[i + 1], GREY);
    }
}

/**
 * Displays the graph and B-spline recalculating every steps
 * Works as an update when user change some input
 */
function drawBSplines() {
    // Checks if Ui and Di values are conform
    if (UiOk) {
        // Calculates once epsilons
        calculEpsilons();

        // Calculates scales transformations
        plotGraph();

        // Create randomly some control points
        createRandomDi();

        // Resets canvas
        resetSplineCanvas();

        // Draws abscissa lines and details
        drawAbscissa();
    }
}

/**
 * Get linear transformation values to switch between two coordinate systems
 * 
 * 1) Coordinate of the canvas (used by control points)
 * 2) Coordinate deduced by the min and max of Uis and Dis values
 * 
 * Caution, the wheel has been reinvented here
 */
function plotGraph() {
    xRange = Ui[Ui.length - 1] - Ui[0];
    xMin = Ui[0] - (xRange / 12);
    xMax = Ui[Ui.length - 1] + (xRange / 12);
    yRange = Math.max(...Di) - Math.min(...Di);
    yMin = Math.min(...Di) - (yRange / 12);
    yMax = Math.max(...Di) + (yRange / 12);
    bX = xMin;
    aX = (xMax - xMin) / width;
    bY = yMax
    aY = (yMin - yMax) / graphHeight;
}

/**
 * Resets canvas for b-spline before redrawing it
 */
function resetSplineCanvas() {
    ctx_splines.fillStyle = '#444342';
    ctx_splines.fillRect(0, 0, width, height);
}

/**
 * Draws abscissa horizontal line under the spline,
 * puts Uis values and epsilons as triangles
 */
function drawAbscissa() {
    // Draws abscissa
    drawArrow(ctx_splines, [width / 2, graphHeight], [12, graphHeight], WHITE);
    drawArrow(ctx_splines, [width / 2, graphHeight], [width - 12, graphHeight], WHITE);

    // Draws marks
    let abscissaStep = 1;
    for (let i = Ui[0]; i <= Ui[Ui.length - 1]; i += abscissaStep) {
        setTimeout(() => { // REMOVES A BUG, I don't understand where does this bug comes from
            drawLine(ctx_splines, [scaleX(i), graphHeight - 3], [scaleX(i), graphHeight + 3], WHITE);
        }, i * 10);
    }

    // Puts Ui values under abscissa
    Ui.forEach(u => {
        drawText(ctx_splines, [scaleX(u) - 4, graphHeight + 24], u + '', 16, WHITE);
    });

    // Puts Epsilons values under abscissa
    epsilons.forEach(e => {
        drawTriangle(ctx_splines, [scaleX(e), graphHeight], GREY);
        drawText(ctx_splines, [scaleX(e) - 4, graphHeight + 48], e.toFixed(1) + '', 12, WHITE);
    });
}

/**
 * Scale point to display it on the canvas
 */
function scalePoint(point) {
    return [scaleX(point[0]), scaleY(point[1])];
}

/**
 * Scale abscissa
 */
function scaleX(value) {
    return (value - bX) / aX;
}

/**
 * Scale ordinate
 */
function scaleY(value) {
    return (value - bY) / aY;
}

/**
 * Function that checks and parses user input for Uis
 * 
 * Uis should be in JSON format of a list, or a list without without brackets
 * Uis should have increasing or equals values
 * 
 * @param {*} str the string to check and parse
 * @param {*} domElem the dom input elem to update with red color if wrong input
 * @returns an array with numbers if all checks are ok, an empty array in the other case
 */
function format(str, domElem) {
    str = str.replace(/ /g, ''); // Removes extra spaces before and after string
    if (str[0] != '[') str = `[${str}`; // Adds [ at the beginning of string if no
    if (str[str.length - 1] != ']') str += ']'; // Adds [ at the end of string if no

    // First check, user input is a valid JSON
    try {
        domElem.style.border = 'none';
        let temp = JSON.parse(str);

        // Second check, user input contains only numbers
        if (temp.reduce((result, current) => { return result && typeof current === 'number' }, true)) {

            // Third check, for Ui, check that for all n, un+1 >= un
            if (domElem === Ui_input_selector) {
                let c = true;
                for (let i = 1; i < temp.length; i++) {
                    if (temp[i - 1] > temp[i]) { c = false }
                }
                if (c) {
                    domElem.style.border = 'none';
                    UiOk = true;
                    return temp; // All checks ok
                } else {
                    // There's u values "decreasing"
                    domElem.style.border = '1px solid red';
                    UiOk = false;
                    return [];
                }
            } else if (domElem === Wi_input_selector) {
                domElem.style.border = 'none';
                WiOk = true;
                return temp;
            }
        } else {
            // Not all element of array are numbers
            domElem.style.border = '1px solid red';
            if (domElem !== Wi_input_selector) {
                UiOk = false;
            } else {
                WiOk = false;
            }
            return [];
        }
    } catch (e) { // If user input is not a valid JSON
        domElem.style.border = '1px solid red';
        if (domElem !== Wi_input_selector) {
            UiOk = false;
        } else {
            WiOk = false;
        }
        return [];
    }
}

/**
 * Event listener for mouse (to move the control points around)
 */
canvas_splines.addEventListener('mousedown', () => {
    Di.forEach((d, index) => {
        if (getDistance(mousePos_bSplines, d) < controlPointRadius) {
            mousePressed_bSplines = index;
        }
    });
}, false);

canvas_splines.addEventListener('mouseup', () => {
    mousePressed_bSplines = -1;
}, false);

/**
 * When user clicked on a control point:
 * 1) Modify coordinate of the point moved
 * 2) Calculate the whole new Bezier curve
 */
function manageMouse_bSplines(event) {
    mousePos_bSplines = getmousePos_bSplines(event);
    if (mousePressed_bSplines >= 0 && mousePos_bSplines[1] < graphHeight - controlPointRadius - 12) {
        Di[mousePressed_bSplines] = mousePos_bSplines;
    }
}

/**
 * Return mouse position on canvas
 */
function getmousePos_bSplines(evt) {
    let rect = canvas_splines.getBoundingClientRect();
    return [evt.clientX - rect.left, evt.clientY - rect.top];
}