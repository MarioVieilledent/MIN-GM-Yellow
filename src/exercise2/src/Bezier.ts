import { MeshGrid } from "./Grid";
import { LineBasicMaterial, Line, BufferGeometry, MeshBasicMaterial, Mesh, SphereGeometry, Group, Vector3, Vector2 } from "three";


export class BezierMesh {
    _nodes: Array<Array<SphereGeometry>> = Array<Array<SphereGeometry>>();
    _gridMesh: MeshGrid;

    constructor(gridMesh: MeshGrid) {
        this._gridMesh = gridMesh;
        this.createBezierMesh(this._gridMesh.width, this._gridMesh.height);
        this.applyNodesOnGrid();
    }

    createBezierMesh(xSize, ySize) {
        for (let i = 0; i < 4; i++)
            this._nodes.push(new Array<Vector3>());

        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                const pos = new Vector3(xSize / 4 * (1 + (1 / 3)) * x, 0, ySize / 4 * (1 + (1 / 3)) * y);
                pos.y = this.random(-25, 25);
                const sphereMesh = new Mesh(new SphereGeometry(1, 32, 16), new MeshBasicMaterial({ color: 0xffff00 }))
                sphereMesh.position.set(pos.x, pos.y, pos.z);
                this._nodes[y].push(sphereMesh);
            }
        }
    }

    applyNodesOnGrid() {
        const vertices = (<BufferGeometry>this._gridMesh).attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 2];
            vertices[i + 1] = this.deCasteljauSurface(x, z);
        }
    }


    deCasteljauSurface(u, v) {
        const x = 1 - u / this._gridMesh.width;
        const y = 1 - v / this._gridMesh.height;
        const curve = new Array<Vector2>();
        for (let i = 0; i < this._nodes.length; i++) {
            const row = this._nodes[i].map(s => (s.position)).map(v => new Vector2(v.y, v.z));    //get c-points of row i and remove x component
            const newY = this.deCasteljau(x, row)
            const z = this._nodes[i].map(s => (s.position))[0].z;
            curve.push(new Vector2(newY, z));
        }
        return this.deCasteljau(y, curve);
    }


    deCasteljau(x: number, points: Array<Vector2>) {
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
        return this.lerp(B20, B21, x).x;
    }



    lerp(A: Vector2, B: Vector2, t: number): Vector2 {
        return new Vector2(t * A.x + (1 - t) * B.x, t * A.y + (1 - t) * B.y);
    }

    random(min, max) {
        return Math.random() * (max - min) + min;
    }

    getRenderable(): Group {
        const g = new Group();
        this._nodes.forEach(n => {
            n.forEach(node => {
                g.add(node);
            })
        })
        //get Lines
        for(let i=0;i<4;i++){
            const geometry = new BufferGeometry().setFromPoints( (this._nodes[i].map(p=>p.position) ));
            g.add(new Line( geometry, new LineBasicMaterial( { color: 0x00ffff } ) ));
            const geometry2 = new BufferGeometry().setFromPoints(this._nodes.map(x => x[i]).map(p=>p.position));
            g.add(new Line( geometry2, new LineBasicMaterial( { color: 0x00ffff } ) ));
        }
        return g;
    }
}