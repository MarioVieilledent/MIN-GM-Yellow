/**
 * This script provides functions to draw points,
 * lines, arrows, curves and text into a 2D canvas context
 * 
 * Works for Bézier curves as well as B-splines
 */

// Color constants for a clear visualisation
const BG_CANVAS_COLOR = '#444342';
const RED = '#de6666';
const GREEN = '#66de66';
const BLUE = '#6666de';
const YELLOW = '#dede66';
const MAGENTA = '#de66de';
const CYAN = '#66dede';
const BLACK = '#666666';
const GREY = '#777777';
const WHITE = '#dedede';

// Dimension for canvas
let width = 800;
let height = 500;

/**
 * Draws a point
 */
function drawPoint(ctx, point, radius, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(point[0], point[1], radius, 0.0, 2.0 * Math.PI);
    ctx.fill();
}

/**
 * Draws a line
 */
function drawLine(ctx, p1, p2, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(p1[0], p1[1])
    ctx.lineTo(p2[0], p2[1])
    ctx.stroke();
}

/**
 * Draws an arrow
 * Function from https://stackoverflow.com/questions/808826/draw-arrow-on-canvas-tag
 */
function drawArrow(ctx, p1, p2, color) {
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
 * Draws a triangle
 * Used for epsilons abscissas in the b-spline exercise
 */
function drawTriangle(ctx, p, color) {
    ctx.strokeStyle = color;
    ctx.moveTo(p[0], p[1]);
    ctx.lineTo(p[0] + 3, p[1] - 10);
    ctx.stroke();
    ctx.lineTo(p[0] - 3, p[1] - 10);
    ctx.stroke();
    ctx.lineTo(p[0], p[1]);
    ctx.stroke();
}

/**
 * Draws only the Bézier curve (whole curve so no need of variable t)
 */
function drawBezierCurve(ctx, bezierCurve) {
    for (let i = 0; i < bezierCurve.curve.length - 1; i++) {
        drawLine(ctx, bezierCurve.curve[i][5], bezierCurve.curve[i + 1][5], RED);
    }
}

/**
 * Write a text
 */
function drawText(ctx, point, text, size, color) {
    ctx.fillStyle = color;
    ctx.font = `${size}px Arial`;
    ctx.fillText(text, point[0], point[1]);
}

/**
 * Returns distance between two points
 * Used for detect if mouse click is close enough to a point to move it
 */
function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2[0] - p1[0], 2.0) + Math.pow(p2[1] - p1[1], 2.0));
}