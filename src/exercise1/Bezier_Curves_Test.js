/**
 * Test script for exercise 1, Bézier Curves
 * 
 * For the test, an instance of the BezierCurve class is created
 * with random float numbers for control polygon
 */


let bc = new BezierCurve;

bc.B00 = [Math.random(), Math.random()];
bc.B01 = [Math.random(), Math.random()];
bc.B02 = [Math.random(), Math.random()];
bc.B03 = [Math.random(), Math.random()];

bc.DeCasteljau();

test(bc.curve[0][5][0], bc.B00[0]);
test(bc.curve[0][5][1], bc.B00[1]);

// These tests led to a code rectification
test(bc.curve[bc.steps][5][0], bc.B03[0]);
test(bc.curve[bc.steps][5][1], bc.B03[1]);

function test(elem1, elem2) {
    if (elem1 === elem2) {
        console.log(`%c Success`, 'color: green');
    } else {
        console.log(`%c Fail, expected ${elem1}, got ${elem2}`, 'color: red');
    }
}