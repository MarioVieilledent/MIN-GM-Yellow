import { MeshGrid } from "./Grid";
import { LineBasicMaterial, Line, BufferGeometry, MeshBasicMaterial, Mesh, SphereGeometry, Group, Vector3 } from "three";


export class BezierMesh {
    _nodes: Array<Array<SphereGeometry>> = Array<Array<SphereGeometry>>();
    _gridMesh: MeshGrid;

    //expects plane mesh and apply controlMesh on it
    constructor(gridMesh: MeshGrid) {
        this._gridMesh = gridMesh;
        this.createBezierMesh(this._gridMesh.width, this._gridMesh.height);
        this.applyNodesOnGrid();
    }

    //creating controlPoints and offset them randomly also already computes sphereMeshes for Rendering (see getRenderable)
    createBezierMesh(xSize: number, ySize: number): void {
        for (let i = 0; i < 4; i++)
            this._nodes.push(new Array<Vector3>());
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                const pos = new Vector3(xSize / 4 * (1 + (1 / 3)) * x, 0, ySize / 4 * (1 + (1 / 3)) * y);
                pos.y = this.random(-25, 25);
                pos.x += this.random(-10, 10);
                pos.z += this.random(-10, 10);
                const sphereMesh = new Mesh(new SphereGeometry(1, 32, 16), new MeshBasicMaterial({ color: 0xffff00 }))
                sphereMesh.position.set(pos.x, pos.y, pos.z);
                this._nodes[y].push(sphereMesh);
            }
        }
    }

    //iterate over every vertex, and apply new position according to deCasteljau
    applyNodesOnGrid(): void {
        let vertices: Array<number> = (<BufferGeometry>this._gridMesh).attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const y = vertices[i + 1];
            const z = vertices[i + 2];
            for (let j = 0; j < 3; j++)
                vertices[i + j] = this.deCasteljauSurface(x, y, z).toArray()[j];
        }
    }


    //expects vertex pos, (u,v,w) as paremeter and computes bezier curve along z-Axis always @x position. 
    //then compute and return casteljau point in z direction on that curve to get vertex pos
    deCasteljauSurface(u: number, v: number, w: number): Vector3 {
        const x = 1 - u / this._gridMesh.width;
        const z = 1 - w / this._gridMesh.height;
        const curve = new Array<Vector3>();
        for (let i = 0; i < this._nodes.length; i++) {
            const row = this._nodes[i].map(s => (s.position));    //get c-points of row i and remove x component
            curve.push(this.deCasteljau(x, row));
        }
        return this.deCasteljau(z, curve);
    }


    //classic deCasteljau. expects 4 Points, and interpolation value and returns new pos 
    deCasteljau(x: number, points: Array<Vector3>): Vector3 {
        if (points.length != 4)
            throw new Error("only 4 ctrlPOints please");
        const B00 = points[0];
        const B01 = points[1];
        const B02 = points[2];
        const B03 = points[3];

        const B10 = this.lerp(B00, B01, x);
        const B11 = this.lerp(B01, B02, x);
        const B12 = this.lerp(B02, B03, x);

        const B20 = this.lerp(B10, B11, x);
        const B21 = this.lerp(B11, B12, x);
        return this.lerp(B20, B21, x);
    }

    //linear interpolation on 2 3D points. expects two 3d points and 1 interpolation value t.
    lerp(A: Vector3, B: Vector3, t: number): Vector3 {
        return new Vector3(t * A.x + (1 - t) * B.x, t * A.y + (1 - t) * B.y, t * A.z + (1 - t) * B.z);
    }

    //returns random value between min and max
    random(min: number, max): number {
        return Math.random() * (max - min) + min;
    }

    //return a Group, containing spheres for every control point, and lines, connecting them to visualize control mesh
    getRenderable(): Group {
        const g = new Group();
        this._nodes.forEach(n => {
            n.forEach(node => {
                g.add(node);
            })
        })
        //get Lines
        for (let i = 0; i < 4; i++) {
            const geometry = new BufferGeometry().setFromPoints((this._nodes[i].map(p => p.position)));
            g.add(new Line(geometry, new LineBasicMaterial({ color: 0x00ffff })));
            const geometry2 = new BufferGeometry().setFromPoints(this._nodes.map(x => x[i]).map(p => p.position));
            g.add(new Line(geometry2, new LineBasicMaterial({ color: 0x00ffff })));
        }
        return g;
    }
}
