/**
 * Core script for B-Splines
 */

let n = 2; // n

// u values (array of integer)
let Ui = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// let Ui = [-12, -6, -2, -2, 0, 4, 8, 12, 16, 18];
// let Ui = [1, 1, 1, 4, 4, 4]

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
    for (let I = n - 1; I <= Ui.length - n + 1; I++) {
        for (let u = I; u < I + 1; u += 0.01) {
            let bSpline = DeBoor(u, I - 1);
            points.push(bSpline[2][0]);
        }
    }
    return points;
}

/**
 * De Boor's algorithm implementation
 * 
 * @param {*} u 
 * @returns a list of k lists of j points
 */
function DeBoor(u, I) {
    // let I = findI(u);
    let BSpline = fillBSplineArray(I);

    // For k going from 0 to n
    for (let k = 1; k <= n; k++) {
        BSpline.push([]);
        for (let j = 0; j <= n - k; j++) {
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
 * Find the value of I given an u
 * Find it being the closest calculated epsilon to the u
 */
function findI(u) {
    if (epsilons?.length > 0) {
        let I = 0;
        epsilons.forEach((e, index) => {
            if (Math.abs((u - e)) < Math.abs((u - epsilons[I]))) {
                I = index;
            }
        });
        return I;
    } else {
        return 0;
    }
}

function fillBSplineArray(I) {
    arr = [[]];
    for (let i = 0; i <= n; i++) {
        let d = Di[I + i - Math.floor(n / 2)];
        if (!d) {
            if (I < 1) {
                d = Di[0];
            } else {
                d = Di[Di.length - 1];
            }
        }
        arr[0].push(d);
    }
    return arr;
}