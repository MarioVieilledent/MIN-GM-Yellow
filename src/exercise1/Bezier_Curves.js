/**
 * Core script for Bézier Curves
 */


// Animation
const fps = 60.0; // Refresh rate for the animations
let delay = 1000.0 / fps; // Delay in ms between each frame
let reverse = false; // Once t reached 1, t goes back to 0 (reverse is then true)

let alreadyInit = false; // Init only once Bézier curves animation
let interval; // Animation of Bézier curve

class BezierCurve {

    steps = 500; // Number of steps to go from t=0 to t=1 for animations (each step is 1 frame)
    t = 0.0; // Variable going from 0 to 1 with steps + 1 steps
    step = 1.0 / this.steps; // Increment and decrement value for t

    // 4 control points that we can move around
    B00 = [100, 400];
    B01 = [700, 400];
    B02 = [400, 100];
    B03 = [350, 250];

    // Bezier curve 
    // Curve is a list (for all steps) of a list of all intermediate points and the tangent vector
    curve = [];

    /**
     * Implementation of de Casteljau algorithm
     * 
     * For t going from 0 to 1 with steps + 1 steps, calculates and memorizes all intermediate points.
     * Does not draw the curve, only save calculus in the curve list
     */
    DeCasteljau() {
        let tempCurve = [];

        // For all t in 0 to 1
        for (let x = 0; x <= this.steps; x++) {
            let t = x / this.steps;

            let B10 = this.nextB(this.B00, this.B01, t);
            let B11 = this.nextB(this.B01, this.B02, t);
            let B12 = this.nextB(this.B02, this.B03, t);

            let B20 = this.nextB(B10, B11, t);
            let B21 = this.nextB(B11, B12, t);

            let B30 = this.nextB(B20, B21, t);

            // Tangent vector = B21 - B20
            let tangentVector = [B21[0] - B20[0], B21[1] - B20[1]];

            tempCurve.push([B10, B11, B12, B20, B21, B30, tangentVector]);
        }

        this.curve = tempCurve;
    }

    /**
     * Given two points and t variable, calculate the next iteration with De Casteljau's algorithm
     */
    nextB(p1, p2, t) {
        return [
            (1 - t) * p1[0] + t * p2[0], // x coordinate
            (1 - t) * p1[1] + t * p2[1] // y coordinate
        ]; // Returns a point
    }


    /**
     * Given a t, draws intermediate points, lines and the tangent vector
     */
    drawIntermediates(t) {
        drawBasicsBezrier(); // Draws the control points
        updateDom(); // Displays values (like value of t) into the web page

        // Gets index for the list with rounding t * steps into an integer
        let index = Math.round(t * this.steps);
        if (index < 0) { index = 0 }
        if (index >= this.curve.length) { index = this.curve.length - 1 }

        // Retrieves all intermediate points and tangent vector stored
        let B10 = this.curve[index][0];
        let B11 = this.curve[index][1];
        let B12 = this.curve[index][2];
        let B20 = this.curve[index][3];
        let B21 = this.curve[index][4];
        let B30 = this.curve[index][5];
        let tangentVector = this.curve[index][6];

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
        drawBezierCurve(ctx_bezier, this);
    }
}



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
            bezierCurve.drawIntermediates(bezierCurve.t);
            !reverse && bezierCurve.t < 1.0 ? bezierCurve.t += bezierCurve.step : reverse = true;
            reverse && bezierCurve.t > 0.0 ? bezierCurve.t -= bezierCurve.step : reverse = false;
        }, delay);
    }
}