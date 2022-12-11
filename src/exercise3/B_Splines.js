/**
 * Core script for B-Splines
 */

let n = 3; // n
// let Ui = [-12, -6, -2, -2, 0, 4, 8, 12, 16, 18]; // u values (array of integer)
// let Ui = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let Ui = [1, 1, 1, 4, 4, 4]
let Di = []; // d values (array of int, length depend on n and u)
// [[-6, 0], [-4, 0], [-2, 0], [0, 0], [-8, 0], [0, 0], [8, 0], [4, 0], [2, 0]]
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
 * De Boor's algorithm implementation
 * 
 * @param {*} u 
 * @returns 
 */
function DeBoor(u) {
    let I = findI(u);
    let BSpline = fillBSplineArray(I);

    // For k going from 0 to n
    for (let k = 1; k <= n; k++) {
        BSpline.push([]);
        for (let j = 0; j <= n - k; j++) {
            let a = (u - Ui[I - n + k + j]) / (Ui[I + 1 + j] - Ui[I - n + k + j]);
            BSpline[k].push([
                (1 - a) * BSpline[k - 1][j][0] + a * BSpline[k - 1][j + 1][0],
                (1 - a) * BSpline[k - 1][j][1] + a * BSpline[k - 1][j + 1][1]
            ]);
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
        arr[0].push(Di[i + I - Math.floor(n / 2)]);
    }
    return arr;
}