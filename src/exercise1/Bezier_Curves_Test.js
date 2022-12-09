/**
 * Test script for exercise 1, Bézier Curves
 * 
 * For the test, an instance of the BezierCurve class is created
 * with random float numbers for control polygon
 */

const Precision = 0.000001;

let bc = new BezierCurve;

bc.B00 = [Math.random(), Math.random()];
bc.B01 = [Math.random(), Math.random()];
bc.B02 = [Math.random(), Math.random()];
bc.B03 = [Math.random(), Math.random()];

bc.DeCasteljau();

// Tests that the curve at t = 0 equals the first control point
test('Curve at t=0', bc.curve[0][5][0], bc.B00[0]);
test('Curve at t=0', bc.curve[0][5][1], bc.B00[1]);

// Tests that the curve at t = 1 equals the last control point
// These tests led to a code rectification ;)
test('Curve at t=1', bc.curve[bc.steps][5][0], bc.B03[0]);
test('Curve at t=1', bc.curve[bc.steps][5][1], bc.B03[1]);

// Tests binomial coefficient function (4 2) should be equal to 6
test('Binomial coefficient', binomial(4, 2), 6);
test('Binomial coefficient property', binomial(7, 1), binomial(7, 6));

// Test Bernstein polynomials
test('Bernstein pol, degree 1, B0', bernsteinPolynomial(1, 0)(0.1), 0.9);
test('Bernstein pol, degree 1, B1', bernsteinPolynomial(1, 1)(0.42), 0.42);
test('Bernstein pol, degree 2, B1', bernsteinPolynomial(2, 1)(0.5), 0.5);
test('Bernstein pol, degree 2, B2', bernsteinPolynomial(2, 2)(0.5), 0.25);
test('Bernstein pol, degree 3, B0', bernsteinPolynomial(2, 0)(0.0), 1.0);
test('Bernstein pol, degree 3, B1', bernsteinPolynomial(2, 1)(1.0), 0.0);
test('Bernstein pol, degree 5, sum of all Bi = 1.0',
    bernsteinPolynomial(5, 0)(0.42) + bernsteinPolynomial(5, 1)(0.42) +
    bernsteinPolynomial(5, 2)(0.42) + bernsteinPolynomial(5, 3)(0.42) +
    bernsteinPolynomial(5, 4)(0.42) + bernsteinPolynomial(5, 5)(0.42), 1.0);

/**
 * Function that reinvents the wheel for unit tests
 */
function test(message, elem1, elem2) {
    let diff = elem1 - elem2;
    if (diff < Precision && diff > -Precision) {
        console.log(`%c ${message} -%c Success`, 'color: grey', 'color: green');
    } else {
        console.log(`%c ${message} -%c Fail, expected ${elem2}, got ${elem1}`, 'color: grey', 'color: red');
    }
}