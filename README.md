# Geometric Modelling Project Work

![GitHub top language](https://img.shields.io/github/languages/top/MarioVieilledent/MIN-GM-Yellow)

Project Work for MIN-GM, **Group Yellow**.

## Run

> Open the file `./src/index.html`.

## 1. Introduction

### Members
- Hesse Henri
- Vieilledent Mario

### Work repartition

- Mario Vieilledent took care of 2D implementation of algorithms for Bézier Curves and B-Splines using canvas and JS.
- Hesse Henri adapted the algorithm for 3D spaces using the library `three.js` and using TypeScript. 

## 2. Bézier Curve

> Core file for this exercise is `./exercise1/Bezier_Curves.js`

### Language & features

Raw JavaScript is used, HTML canvas for drawing points and lines in web page.

### Casteljau’s algorithm

This pretty formula is to prove the power of md files.
$$B_j^n(t)=\binom{n}{j}t^j(1-t)^{n-j}$$

## 3. Bézier Surface

> Core file for this exercise is `./exercise2/src/Bezier.ts`

### Language & features

Made in TypeScript with `three.js`.

### Build js dest file

JS script is already transpiled. Otherwise,

`npm install`

`npm run build`

Open either with`./exercise2/dist/index.html` for test, or `./index.html` on page `3. Bézier Surfaces`.

## 4. B-Splines

> Core file for this exercise is `./exercise3/B_Splines.js`

### Language & features

Raw JavaScript is used, HTML canvas for drawing points and lines in web page.