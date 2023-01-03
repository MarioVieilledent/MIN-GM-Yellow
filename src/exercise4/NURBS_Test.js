/**
 * Test script for exercise 4, NURBS
 * 
 * For the test, an instance of the BezierCurve class is created
 * with random float numbers for control polygon
 */

let nurbs_test = new NURBS();

nurbs_test.b = [[0, 0], [4, 4], [0, 0]];
nurbs_test.n = 2;
nurbs_test.w = [0.5, 1, 1];

test('NURBS, lecture example check', nurbs_test.rationalerDeCasteljau(0.5).bt[2][0][0], 2.285714);