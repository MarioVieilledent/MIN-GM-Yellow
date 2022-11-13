import { LineSegments, WireframeGeometry, Color, Scene, PerspectiveCamera, WebGLRenderer, MeshBasicMaterial, Mesh } from "three";
import { BezierMesh } from "./Bezier";
import { MeshGrid } from "./Grid";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class App {

    private _renderer: WebGLRenderer;
    private _scene: Scene;
    private _camera: PerspectiveCamera;
    private _controls: OrbitControls;
    constructor() {
        this._scene = new Scene();
        this._camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this._renderer = new WebGLRenderer();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this._renderer.domElement);
        this._scene.background = new Color(0xffffff);

        //const geometry = new BoxGeometry(1, 1, 1);
        //const material = new MeshBasicMaterial({ color: 0x00ff00 });
        //const cube = new Mesh(geometry, material);
        //this._scene.add(cube);


        const geometry = new MeshGrid(50, 50, 30, 30);

        //(<BufferGeometry>geometry).rotateX(-90/180*Math.PI);
        //this._scene.add( plane.getRenderable() );

        const lol = new BezierMesh(geometry);
        this._scene.add(lol.getRenderable());


        let material = new MeshBasicMaterial( { color: 0xd3d3d3} );
        let plane = new Mesh(geometry, material);
        this._scene.add(plane);
        let wireframe = new WireframeGeometry( geometry );
        let line = new LineSegments( wireframe );
        line.material.color.setHex(0x000000);
        this._scene.add(line);
        this._scene.add(lol.getLines());




        //this._camera.position.z = 5;
        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
        this._controls.target.set( geometry.width/2 , 0, geometry.height/2);
        //controls.update() must be called after any manual changes to the camera's transform
        this._camera.position.set(0, 20, 100);
        this._controls.update();
    }
    animate() {
        requestAnimationFrame(() => this.animate());
        this._controls.update();
        this._renderer.render(this._scene, this._camera);
    }
}
new App().animate();


