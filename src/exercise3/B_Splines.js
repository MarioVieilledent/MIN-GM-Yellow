/**
 * Core script for B-Splines
 */

let n = 2; // n
let Ui = [1, 2, 3, 4, 5, 6, 7]; // u values (array of integer)
let Di = [4, 1, 0, 1, 3, 4]; // d values (array of int, length depend on n and u)
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