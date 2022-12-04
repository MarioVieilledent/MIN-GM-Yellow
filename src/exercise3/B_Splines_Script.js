/**
 * This file is not the core of exercise, it just supports the display.
 * 
 * This file provide function to display points, lines, arrow and curve
 * with color in the canvas context.
 */

// Canvas and context to draw graphics in web page
let canvas_splines_holder = document.getElementById('bezier-curves-canvas-holder');
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
const Di_input_selector = document.getElementById('Di_input_selector');

// User inputs

// Display in the HTML DOM the values for n, ui and di
n_input_selector.value = '' + n;
Ui_input_selector.value = Ui.join(', ');
Di_input_selector.value = Di.join(', ');

let UiOk = false;
let DiOk = false;

Ui = format(JSON.stringify(Ui), Ui_input_selector);
Di = format(JSON.stringify(Di), Di_input_selector);
drawBSplines();

// Get event on change of these inputs
n_input_selector.addEventListener('change', event => {
    n = parseInt(event.target.value);
    Di = format(JSON.stringify(Di), Di_input_selector); // After changing n, check of Di again
    drawBSplines();
});

Ui_input_selector.addEventListener('change', event => {
    Ui = format(event.target.value, Ui_input_selector);
    Di = format(JSON.stringify(Di), Di_input_selector); // After changing Ui, check of Di again
    drawBSplines();
});

Di_input_selector.addEventListener('change', event => {
    Di = format(event.target.value, Di_input_selector);
    drawBSplines();
});

/**
 * Displays the graph and B-spline
 */
function drawBSplines() {
    // Checks if Ui and Di values are conform
    if (UiOk && DiOk) {
        // Calculates scales transformations
        plotGraph();

        // Resets canvas
        resetSplineCanvas();

        // Draws abscissa lines and details
        drawAbscissa();

        calculEpsilons();

        // Draws control points
        for (let i = 0; i < Di.length; i++) {
            drawPoint(ctx_splines, scalePoint([epsilons[i], Di[i]]), 5, BLUE);
        }

        // Draws lines between control points
        for (let i = 0; i < Di.length - 1; i++) {
            drawLine(ctx_splines, scalePoint([epsilons[i], Di[i]]), scalePoint([epsilons[i + 1], Di[i + 1]]), BLUE);
        }
    }
}

/**
 * Plot graph depending on given values
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
 * Draws abscissa and its details
 */
function drawAbscissa() {
    // Draws abscissa
    drawArrow(ctx_splines, [width / 2, graphHeight], [12, graphHeight], WHITE);
    drawArrow(ctx_splines, [width / 2, graphHeight], [width - 12, graphHeight], WHITE);

    // Draws marks
    let abscissaStep = 1;
    for (let i = Ui[0]; i <= Ui[Ui.length - 1]; i += abscissaStep) {
        setTimeout(() => { // REMOVES A BUG, I don't understand where does this bug comes from
            drawLine(ctx_splines, [scaleX(i), graphHeight - 6], [scaleX(i), graphHeight + 6], WHITE);
        }, i * 10);
    }

    // Puts Ui values under abscissa
    Ui.forEach(u => {
        drawText(ctx_splines, [scaleX(u), graphHeight + 24], u + '', WHITE);
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
 * Function of checking and parsing user input
 * for values of u and d (that I called Ui and Di)
 * 
 * I hope final grade does not take in consideration quality of code...
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


                // Third check, for Di, check that there's the right amount of values
            } else if (domElem === Di_input_selector) {
                if (temp.length > 0 && temp.length === Ui.length - n + 1) {
                    domElem.style.border = 'none';
                    DiOk = true;
                    return temp; // All checks ok
                } else {
                    // There's not the right amount of ds
                    domElem.style.border = '1px solid red';
                    DiOk = false;
                    return temp;
                }
            }
        } else {
            // Not all element of array are numbers
            domElem.style.border = '1px solid red';
            UiOk = false; DiOk = false;
            return [];
        }
    } catch (e) { // If user input is not a valid JSON
        domElem.style.border = '1px solid red';
        UiOk = false; DiOk = false;
        return [];
    }
}