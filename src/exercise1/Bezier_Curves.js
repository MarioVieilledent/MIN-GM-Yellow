/**
 * Script for Bézier Curves
 */

let n = 200; // Number of steps to go from t=0 to t=1 for animations (each step is 1 frame)
let t = 0.0; // Variable going from 0 to 1 with n + 1 steps
let step = 1.0 / n; // Increment and decrement value for t

const fps = 60.0; // Refresh rate for the animations
let delay = 1000.0 / fps;

let reverse = false; // Move points from left to right or right to left

// Setup of an infinite loop with delay for animation
let interval = setInterval(() => {
    drawIntermediates(t);
    if (!reverse && t < 1.0) {
        t += step;
    } else {
        reverse = true;
    }
    if (reverse && t > 0.0) {
        t -= step;
    } else {
        reverse = false;
    }
}, delay);

// 4 control with coordinates points that we can move around
let B00 = [150, 350];
let B01 = [250, 125];
let B02 = [500, 125];
let B03 = [600, 350];

// Bezier curve (the whole curve contains the n+1 steps and is stored once)
// Curve is a list (for each steps) of a list (for each intermediate points) of points
let curve = [];

// First step, we calculate once the first Bezier curve
calculateBezierCurve();

/**
 * Given a t, draws
 * - intermediate points
 * - intermediate lines
 * - Tangent vector
 */
function drawIntermediates(t) {
    drawBasics(); // Draw the control points, the control polygon, etc.
    updateDom(); // Display values (like value of t) into the web page

    // This a bit messy, we get index for the list with rounding t * n into an integer
    let index = Math.round(t * n);
    if (index < 0) { index = 0 }
    if (index >= curve.length) { index = curve.length - 1 }

    // Retrieves all intermediate points stored
    let B10 = curve[index][0];
    let B11 = curve[index][1];
    let B12 = curve[index][2];

    let B20 = curve[index][3];
    let B21 = curve[index][4];

    let B30 = curve[index][5];

    let tangentVector = curve[index][6];

    // Draws B1 points and lines
    drawLine(B10, B11, BLUE);
    drawLine(B11, B12, BLUE);
    drawPoint(B10, 5, BLUE);
    drawPoint(B11, 5, BLUE);
    drawPoint(B12, 5, BLUE);

    // Draws B2 points and tangent line
    drawLine(B20, B21, GREEN);
    drawPoint(B20, 5, GREEN);
    drawPoint(B21, 5, GREEN);

    // Draws B3 point
    drawPoint(B30, 5, RED);

    // Draws the tangent vector
    drawArrow(B30, [B30[0] + tangentVector[0], B30[1] + tangentVector[1]], YELLOW);
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
 * For t going from 0 to 1 with n + 1 steps, calculate and memorize all values of all intermediate points.
 * Does not draw the curve, only save calculus
 */
function calculateBezierCurve() {
    tempCurve = [];
    for (let x = 0; x <= 1; x += step) {
        B10 = casteljau(B00, B01, x);
        B11 = casteljau(B01, B02, x);
        B12 = casteljau(B02, B03, x);

        B20 = casteljau(B10, B11, x);
        B21 = casteljau(B11, B12, x);

        B30 = casteljau(B20, B21, x);

        // Tangent vector = B21 - B20
        tangentVector = [B21[0] - B20[0], B21[1] - B20[1]];

        tempCurve.push([B10, B11, B12, B20, B21, B30, tangentVector]);
    }
    curve = tempCurve;
}

/**
 * Given two points and t variable, calculate the next iteration with De Casteljau's algorithm
 */
function casteljau(p1, p2, t) {
    return [(1 - t) * p1[0] + t * p2[0], (1 - t) * p1[1] + t * p2[1]]; // De Casteljau's algorithm
}
