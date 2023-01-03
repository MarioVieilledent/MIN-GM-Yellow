import { Object3D, ArrowHelper, Vector3, Vector2, Raycaster, LineSegments, WireframeGeometry, Color, Scene, PerspectiveCamera, WebGLRenderer, MeshBasicMaterial, Mesh } from "three";
import { BezierMesh } from "./Bezier";
import { MeshGrid } from "./Grid";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


export class App {

    private _renderer: WebGLRenderer;
    private _scene: Scene;
    private _camera: PerspectiveCamera;
    private _controls: OrbitControls;

    private _raycaster: Raycaster;
    private _pointer: Vector2;
    private _bezier: BezierMesh;
    private _arrowX: ArrowHelper;
    private _arrowY: ArrowHelper;
    private _arrowZ: ArrowHelper;
    private _plane: Object3D;


    divForDisplay = document.getElementById('page-3-bezier-surfaces');

    //threejs boilerplate and of course instantiation/execution of Mesh and Bezier ops on that Mesh
    constructor() {
        window.addEventListener('pointermove', this.onPointerMove);
        this._scene = new Scene();
        this._camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        //this._arrow=new ArrowHelper();

        this._arrowX = new ArrowHelper( new Vector3(), new Vector3(), 12, 0xff00000, 4, 3 );
        this._arrowY = new ArrowHelper( new Vector3(), new Vector3(), 12, 0xff00000, 4, 3 );
        this._arrowZ = new ArrowHelper( new Vector3(), new Vector3(), 12, 0xff00000, 4, 3 );
        //this._arrow.visible=false;
        this._scene.add(this._arrowX);
        this._scene.add(this._arrowY);
        this._scene.add(this._arrowZ);


        this._raycaster = new Raycaster();
        this._pointer = new Vector2();

        this._renderer = new WebGLRenderer();
        this._renderer.setSize(window.innerWidth, window.innerHeight - 50);
        this.divForDisplay?.appendChild(this._renderer.domElement);
        this._scene.background = new Color(0xffffff);

        const geometry = new MeshGrid(50, 50, 30, 30);

        this._bezier = new BezierMesh(geometry);
        this._scene.add(this._bezier.getRenderable());


        let material = new MeshBasicMaterial({ color: 0xd3d3d3 });
        this._plane = new Mesh(geometry, material);
        //this._scene.add(this._plane);
        let wireframe = new WireframeGeometry(geometry);
        let line = new LineSegments(wireframe);
        line.material.color.setHex(0x000000);
        this._scene.add(line);




        //this._camera.position.z = 5;
        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
        this._controls.target.set(geometry.width / 2, 0, geometry.height / 2);
        //controls.update() must be called after any manual changes to the camera's transform
        this._camera.position.set(0, 20, 100);
        this._controls.update();
    }
    animate() {

        this._raycaster.setFromCamera(this._pointer, this._camera);

        // calculate objects intersecting the picking ray
        if(this._plane){
            const intersects = this._raycaster.intersectObjects([this._plane]);
            const iPoint=intersects[0]?.point
            if(iPoint){
                this._arrowX.visible=true;
                this._arrowY.visible=true;
                this._arrowZ.visible=true;
                this._scene.remove(this._arrowX);
                this._scene.remove(this._arrowY);
                this._scene.remove(this._arrowZ);
                const dirZ=this._bezier.getSlopy(iPoint.x,iPoint.y,iPoint.z);
                const dirX=this._bezier.getSlopx(iPoint.x,iPoint.y,iPoint.z);
                dirX.normalize();
                dirZ.normalize();
                const dirGreen=new Vector3(dirZ.z,dirZ.y,dirZ.x);
                this._arrowX = new ArrowHelper( dirX, iPoint, 12, 0xff0000, 4, 3 );
                this._arrowY = new ArrowHelper( dirX.cross(dirGreen), iPoint, 12, 0x0000ff, 4, 3 );
                this._arrowZ = new ArrowHelper( dirGreen, iPoint, 12, 0x00ff00, 4, 3 );
                this._scene.add(this._arrowX)
                this._scene.add(this._arrowY)
                this._scene.add(this._arrowZ)
            }
        }


        requestAnimationFrame(() => this.animate());
        this._controls.update();
        this._renderer.render(this._scene, this._camera);



    }
    onPointerMove=(event) =>{
        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components
        //const factor=1+50/window.innerHeight;
        const factor=1;
        this._pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this._pointer.y = - ((event.clientY*factor)/ window.innerHeight) * 2 + 1;


    }
}

new App().animate();


