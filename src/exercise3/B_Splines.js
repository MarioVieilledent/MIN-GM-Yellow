/**
 * Core script for B-Splines
 */



let Di = []; // d values (array of int, length depend on n and u)

let epsilons = []; // Epsilons for plotting Di values

/**
 * Knowing n and Ui values, calculates epsilons with Greville-Abszissen formula 
 */
function calculEpsilons() {
    epsilons = []; // Resets epsilons first
    for (let i = 0; i < Ui.length - n + 1; i++) {
        let sum = 0.0;
        for (let j = i; j < i + n; j++) {
            sum += Ui[j];
        }
        epsilons.push(sum / n);
    }
}

/**
 * Divide B-Spline into segments and use the DeBoor algorithm for each
 * @returns list of points of the B-Spline
 */
function calculateDeBoor() {
    let points = [];
    let K = Ui.length - 1;

    for (let I = n - 1; I <= K - n; I++) { // Segmentation in I
        let uMin = Ui[I];
        let uMax = Ui[I + 1];
        let step = (uMax - uMin) / 100 // Divide segment into 100 points
        for (let u = uMin; u < uMax; u += step) {
            let bSpline = DeBoor(u, I); // Calculate point with De Boor algorithm
            points.push(bSpline[n][0]); // Save result, the last point in the De Boor algorithm
        }
    }

    return points;
}

/**
 * De Boor's algorithm implementation
 * 
 * @returns a list of k lists of j points
 */
function DeBoor(u, I) {
    let BSpline = fillBSplineArray(I);

    for (let k = 1; k <= n; k++) { // For k going from 1 to n
        BSpline.push([]);
        for (let j = 0; j <= n - k; j++) {
            // Calculation of a
            let a = (u - Ui[I - n + k + j]) / (Ui[I + 1 + j] - Ui[I - n + k + j]);
            let tempArr = [];
            for (let dim = 0; dim < BSpline[0].length; dim++) {
                tempArr.push((1 - a) * BSpline[k - 1][j][dim] + a * BSpline[k - 1][j + 1][dim]);
            }
            BSpline[k].push(tempArr);
        }
    }

    return BSpline;
}

/**
 * Fill a new array with d00, d01, d02, etc.
 */
function fillBSplineArray(I) {
    arr = [[]];
    for (let j = 0; j <= n; j++) {
        arr[0].push(Di[I - n + 1 + j]);
    }
    return arr;
}