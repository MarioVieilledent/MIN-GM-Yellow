/**
 * Main script for NURBS exercise
 */

class NURBS {
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