# Geometric Modelling Project Work

![GitHub top language](https://img.shields.io/github/languages/top/MarioVieilledent/MIN-GM-Yellow)

Project Work for MIN-GM, **Group Yellow**.

## Run

> The whole project result is accessible through the file `./src/index.html`

## 1. Introduction

This repository contains all files for the MIN-GM project, winter semester 2022/2023, for group Yellow.

It contains a web page and js script files implementing Bézier curves, Bézier Surfaces, B-Splines and NURBS.

## Architecture

- `src`
    - `exercise1` All files for Bézier Curves
    - `exercise2` All files for Bézier Surfaces
        - `dist` All TypeScript code for Bézier Surfaces
        - `src` Already transpiled JavaScript code
    - `exercise3` All files for B-Splines
    - `exercise4` All files for NURBS
    - `script` Contains JS glue and a reinvented framework
        - `canvasDrawer.js` contains functions to easily draw points, lines, arrows into the canvases
        - `framework.js` handles the switch between pages, no official framework is used though, just some JS glue
    - `index.html` All graphical elements that give access to all exercise demonstration
    - `style.css` All css style grouped in this file

## Code

The code is commented in English. We implemented all algorithm by our own following the lecture's slides.

### Members of Yellow Group
- Hesse Henri
- Vieilledent Mario

### Work repartition

- Mario Vieilledent took care of 2D implementation of algorithms for Bézier Curves and B-Splines using canvas and JavaScript.
- Hesse Henri adapted the algorithm for 3D spaces using the library `three.js` and using TypeScript. 

## 2. Bézier Curve

> Core file for this exercise is `./src/exercise1/Bezier_Curves.js`

There's a test file for Bézier Curves that do some tests and display in console results.

### Language & features

Raw JavaScript is used, HTML canvas for drawing points and lines in web page.

4 points are movable by the mouse in the canvas.

Are displayed:
- Control points and polygon
- Intermediate points and lines
- Bézier curve
- An animation showing
    - a moving point
    - its tangent vector
    - and the Bernstein polynomials values applied for each point at a variable t

### Casteljau’s algorithm

This pretty formula is to prove the power of markdown.
$$B_j^n(t)=\binom{n}{j}t^j(1-t)^{n-j}$$

## 3. Bézier Surface

> Core file for this exercise is `./src/exercise2/src/Bezier.ts`

### Language & features

Made in TypeScript with `three.js`.

### Build js dest file

JS script is already transpiled into an out js file. Otherwise, in the `./src/exercice2` folder:

`npm install`

`npm run build`

Open either with`./exercise2/dist/index.html` for test, or `./index.html` on page `3. Bézier Surfaces`.

## 4. B-Splines

> Core file for this exercise is `./src/exercise3/B_Splines.js`

### Features

There's two input values:
- `n` for specifing the degree of B-Spline
- `Ui`, the list of u points, is checked to be an increasing (or equal) list of numbers

An abscissae is drawn displaying Ui values and Epsilons with small triangles.

These two inputs determine the number of control points (Di in code). They are placed right above their corresponding epsilon abscissae, at a random height. They are recalculated for each modification of input.

It is possible to move the control points with the mouse.

Are displayed:
- Control points and polygon
- Intermediate points and lines
- B-Spline
- An animation showing
    - a moving point
    - its tangent vector

## 5. NURBS

> Core file for this exercise is `./src/exercise4/NURBS.js`

There is a test file for NURBS, its result is displayed in the console.

### Features

There is only one input : the list of weights.

The number of weights determine both n value and the number of control points.

It is possible to move the control points with the mouse.

Are displayed:
- Control points and polygon
- Intermediate points and lines
- The curve NURBS
- An animation showing
    - a moving point
    - its tangent vector