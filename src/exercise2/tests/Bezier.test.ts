import {BezierMesh} from '../src/Bezier';
import {MeshGrid} from '../src/Grid';
import {Vector3} from 'three';









describe('bezier', function() {
    const geometry = new MeshGrid(50, 50, 30, 30);
    const bezier = new BezierMesh(geometry);

    const simpleDeCasteljau=(t: number, points: Array<Vector3>)=>{
        console.log("MOIS");
        let B10 = bezier.lerp(points[0], points[1], t);
        let B11 = bezier.lerp(points[1], points[2], t);
        let B12 = bezier.lerp(points[2], points[3], t);
        let B20 = bezier.lerp(B10, B11, t);
        let B21 = bezier.lerp(B11, B12, t);
        let B30 = bezier.lerp(B20, B21, t);
        // Tangent vector = B21 - B20
        //let tangentVector = [B21[0] - B20[0], B21[1] - B20[1]];
        //tempCurve.push([B10, B11, B12, B20, B21, B30, tangentVector]);
        //this.curve = tempCurve;
        return B30;
    }
    it('lerp', function() {
        let result = bezier.lerp(new Vector3(2,2,2),new Vector3(1,1,1), 0.5);
        expect(result).toStrictEqual(new Vector3(1.5, 1.5, 1.5));
    });


    it('lerp', function() {
        let result = bezier.lerp(new Vector3(9,1,3),new Vector3(0,10,5), 0.2);
        //result=Math.round(result*100)/100;
        expect(result).toEqual(
        {
            x: expect.closeTo(7.2, 5), 
            y: expect.closeTo(2.8, 5), 
            z: expect.closeTo(3.4, 5)
        });
    });

    it('deCasteljau', function() {
        const points=new Array<Vector3>();
        points.push(new Vector3(0,0,0));
        points.push(new Vector3(5,4,0));
        points.push(new Vector3(9,3,0));
        points.push(new Vector3(1,2,0));

        let result=bezier.deCasteljau(0.3, points);
        //result.multiplyScalar(100).round().divideScalar(100);
        //expect(result).toStrictEqual(new Vector3(3.93, 2.38, 0));
        expect(result).toEqual(
        {
            x: expect.closeTo(3.933, 5), 
            y: expect.closeTo(2.385, 5), 
            z: expect.closeTo(0., 5)
        });
    });


    it('deCasteljauStart', function() {
        const points=new Array<Vector3>();
        points.push(new Vector3(0,0,0));
        points.push(new Vector3(5,4,0));
        points.push(new Vector3(9,3,0));
        points.push(new Vector3(1,2,0));
        let result=bezier.deCasteljau(0.0, points);
        expect(result).toEqual(
        {
            x: expect.closeTo(0, 5), 
            y: expect.closeTo(0, 5), 
            z: expect.closeTo(0., 5)
        });
    });

    it('deCasteljauEnd', function() {
        const points=new Array<Vector3>();
        points.push(new Vector3(0,0,0));
        points.push(new Vector3(5,4,0));
        points.push(new Vector3(9,3,0));
        points.push(new Vector3(1,2,0));
        let result=bezier.deCasteljau(1.0, points);
        expect(result).toEqual(
        {
            x: expect.closeTo(1, 5), 
            y: expect.closeTo(2, 5), 
            z: expect.closeTo(0., 5)
        });
    });


    it('deCasteljauRecursiveVSSimple', function() {
        const points=new Array<Vector3>();
        points.push(new Vector3(1,2,0));
        points.push(new Vector3(9,3,0));
        points.push(new Vector3(5,4,0));
        points.push(new Vector3(0,0,0));
        const result=bezier.deCasteljau(0.3, points);
        const result2=simpleDeCasteljau(0.3, points);
        console.log(result2);
        expect(result2).toStrictEqual(result);
    });


  /*
  it('substract', function() {
    let result = Calculator.Difference(5, 2);
    expect(result).toBe(3);
  });
  */
});
/*
describe('calculate', function() {
  it('add', function() {
    let result = Calculator.Sum(5, 2);
    expect(result).toBe(7);   
  });

  it('substract', function() {
    let result = Calculator.Difference(5, 2);
    expect(result).toBe(3);
  });
});
*/
