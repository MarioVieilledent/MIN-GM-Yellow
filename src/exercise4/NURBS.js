/**
 * Main script for NURBS exercise
 */

class NURB {
    n;
    w;
    b;

    rationalerDeCasteljau(t) {
        let wt = [[]];
        let bt = [[]];
        for (let j = 0; j <= this.n; j++) {
            wt[0].push(this.w[j]);
            bt[0].push(this.b[j]);
        }
        for (let r = 1; r <= this.n; r++) {
            wt.push([]);
            bt.push([]);
            for (let j = 0; j <= this.n - r; j++) {
                wt[r].push((1 - t) * wt[r - 1][j] + t * wt[r - 1][j + 1]);
                bt[r].push([
                    (1 - t) * (wt[r - 1][j] / wt[r][j]) * bt[r - 1][j][0] + t * (wt[r - 1][j + 1] / wt[r][j]) * bt[r - 1][j + 1][0],
                    (1 - t) * (wt[r - 1][j] / wt[r][j]) * bt[r - 1][j][1] + t * (wt[r - 1][j + 1] / wt[r][j]) * bt[r - 1][j + 1][1]
                ]);

            }
        }
        return bt;
    }
}

function initNurbs() {


    let nurb = new NURB();

    nurb.n = 3;
    nurb.w = [2, 1, 1, 2];
    nurb.b = [[100, 100], [200, 600], [700, 300], [400, 300]];

    nurb.rationalerDeCasteljau(0.5);

    for (let t = 0.0; t <= 1; t += 0.01) {
        drawPoint(ctx_nurbs, nurb.rationalerDeCasteljau(t)[3][0], 4, RED);
    }
}