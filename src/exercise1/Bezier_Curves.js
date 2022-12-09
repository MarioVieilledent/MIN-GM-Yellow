/**
 * Core script for Bézier Curves
 */

class BezierCurve {

    steps = 500; // Number of steps to go from t=0 to t=1 for animations (each step is 1 frame)
    t = 0.0; // Variable going from 0 to 1 with steps + 1 steps
    step = 1.0 / this.steps; // Increment and decrement value for t

    // 4 control points that we can move around
    B00 = [100, 400];
    B01 = [700, 400];
    B02 = [400, 100];
    B03 = [350, 250];

    // 4 Bernstein polynomials
    Bpol30 = bernsteinPolynomial(3, 0);
    Bpol31 = bernsteinPolynomial(3, 1);
    Bpol32 = bernsteinPolynomial(3, 2);
    Bpol33 = bernsteinPolynomial(3, 3);

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
}

/**
 * Bernstein's Polynomials
 * 
 * Given two integers n and t, return a polynomial function
 * 
 * Here n = 3 because polynomials are of degree 3,
 * but the method can also apply for any n
 */
function bernsteinPolynomial(n, j) {
    function pol(t) {
        return binomial(n, j) * Math.pow(t, j) * Math.pow((1 - t), (n - j));
    }
    return pol;
}

/**
 * Evaluates a binomial coefficient
 * Algorithm from: https://www.w3resource.com/javascript-exercises/javascript-math-exercise-20.php
 */
function binomial(n, k) {
    let coef = 1;
    for (let x = n - k + 1; x <= n; x++) coef *= x;
    for (x = 1; x <= k; x++) coef /= x;
    return coef;
}