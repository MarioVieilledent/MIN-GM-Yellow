import { BufferGeometry, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";


//Represents the final mesh
export class MeshGrid extends PlaneGeometry {
    width: number;
    height: number;
    widthSegments: number;
    heightSegments: number;
    constructor(width: number, height: number, widthSegments: number, heightSegments: number) {
        super(width, height, widthSegments, heightSegments);
        this.height = height;
        this.width = width;
        this.widthSegments = widthSegments;
        this.heightSegments = heightSegments;
        (<BufferGeometry>this).rotateX(-90 / 180 * Math.PI);
        (<BufferGeometry>this).translate(this.width / 2, 0, this.height / 2);
    }
}