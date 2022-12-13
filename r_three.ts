import * as THREE from 'three'
import {OneDArray, QuackingV2, QuackingV3} from "./functions/structures";
import {Vector2, Vector3} from "three";
// Also you might want some common variables
const ORG2 = new Vector2(0, 0);
const UP2 = new Vector2(0, 1);

const ORG = new Vector3(0, 0, 0);
const UP = new Vector3(0, 1, 0);


class utils {
  // can you do templating lol
  static ArrayToVec3(point: OneDArray) {
    return new THREE.Vector3(point[0], point[1], point[2]);
  }

  static getSphere(r: number) {
    let geometry = new THREE.SphereGeometry(r, 24, 24);
    let material = new THREE.MeshBasicMaterial({color: 'rgb(255,255,255)'});
    return new THREE.Mesh(geometry, material);
  }

  static getBox(w: number, h: number, d: number) {
    let geometry = new THREE.BoxGeometry(w, h, d);
    let material = new THREE.MeshPhongMaterial({color: 'rgb(120,120,120)'});
    let mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    return mesh;
  }

  // unpack (vector) point from object
  static oup(o: THREE.Vector3) {
    return [o.x, o.y, o.z];
  }

  // make a vector
  static arrayToVector(arr: OneDArray) {
    return {x: arr[0], y: arr[1]};
  };

  static vectorToArray(o: QuackingV2) {
    return [o.x, o.y];
  }

  // subtract array 2 from array 1
  static subtractVector(arr1: number[], arr2: number[]) {
    return arr1.map(function (item, index) {
      return item - arr2[index];
    });
  }

  static angleBetweenVectors(ax: number, ay: number, bx: number, by: number) {
    let magA = Math.sqrt(ax * ax + ay * ay);
    let magB = Math.sqrt(by * by + bx * bx);
    let magAmagB = magA * magB;
    if (magA * magB < 0.001) throw "Vectors must be nonzero length";
    let sinTheta = (ax * by - bx * ay) / magAmagB;
    let cosTheta = (ax * bx + ay * by) / magAmagB;
    let theta = Math.atan2(sinTheta, cosTheta);
    return 180 * (theta / Math.PI);
  }

  static isAgnosticLeft(a : QuackingV2, b: QuackingV2, c: QuackingV2, debug = false) {
    if (a.y > b.y) {
      return this.isLeft(b, a, c, debug);
    } else {
      return this.isLeft(a, b, c, debug);
    }
  }

  // if c is left of ab
  static isLeft(a: QuackingV2, b: QuackingV2, c: QuackingV2, debug = false) {
    if (debug) {
      console.log(`${utils.vectorToArray(a)}, ${utils.vectorToArray(b)}, ${utils.vectorToArray(c)}`);
    }
    return ((b.x - a.x) * (c.y - a.y) - ((b.y - a.y) * (c.x - a.x))) > 0;
  }

  // interpret an axis as 3 float positions
  static interpret(axis : QuackingV3) {
    if (!Array.isArray(axis)) {
      return [axis.x, axis.y, axis.z];
    }
    return axis;
  }

  static setMatFromArr(m : THREE.Matrix4, a: number[]) {
    m.set(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
  }

  static rotateAboutWorldAxis(object : THREE.Object3D, axis : THREE.Vector3, theta: number) {
    let rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationAxis(axis.normalize(), theta);
    let currentPos = new THREE.Vector4(object.position.x, object.position.y, object.position.z, 1);
    let newPos = currentPos.applyMatrix4(rotationMatrix);
    object.position.x = newPos.x;
    object.position.y = newPos.y;
    object.position.z = newPos.z;
  }

  // axis-angle to matrix4
  static rotate_aa(axis: QuackingV3, theta: number) {
    let [x, y, z] = utils.interpret(axis);
    let t = 1 - Math.cos(theta);
    let c = Math.cos(theta);
    let s = Math.sin(theta);
    // classic gems, glassner academic press 1990
    let mat = new THREE.Matrix4().set(
      t * x * x + c, t * x * y + s * z + s * z, t * x * z - s * y, 0,
      t * x * y - s * z, t * y * y + c, t * y * z + s * x, 0,
      t * s * z + s * y, t * y * z - s * x, t * z * z + c, 0,
      0, 0, 0, 1
    );
    return mat;
  }

  static m_make(dims : number[]) {
    let res = new Array();
    if (!dims.length) return 0;
    let dim = dims[0];
    let sliced = dims.slice(1);
    for (let i = 0; i < dim; i++) {
      // console.log(`make: ${i} of ${dim} ..${sliced}`);
      res.push(utils.m_make(sliced));
    }
    return res;
  }

  // Apply function for each element traversed
  static m_traverse(func :(_:number[])=>void, dim : number[], input : number[] = []) {
    if (!Array.isArray(dim) || dim.length <= 0) {
      return;
    }
    // Dim[0] = 4 means length of 4 in the first dimension of array
    for (let i = 0; i < dim[0]; i++) {
      // Clone coordinate array and update coordinate array with i
      let tmp = [...input];
      tmp.push(i);
      // If there are more dimensions, recurse
      if (dim.length > 1) {
        utils.m_traverse(func, dim.slice(1), tmp);
      } else {
        // If this is the last dimension, use the coordinate array
        func(tmp);
      }
    }
  }

  static m_getEle(array: any[] , indices : number[]) : number[] {
    if (indices.length == 0) {
      return array;
    } else {
      return utils.m_getEle(array[indices[0]], indices.slice(1));
    }
  }

  static m_setEle(arr: number[] | any[], idx: number[], ele: number) {
    if (idx.length == 1) {
      arr[idx[0]] = ele;
    } else {
      utils.m_setEle(arr[idx[0]], idx.slice(1), ele);
    }
  }

  // trans = utils.m_transpose([[8,7,3],[4,5,6]]);
  static m_transpose(input: any[] | number) {
    if (Number.isFinite(input)) {
      return [input];
    }
    // If array is 1 dimensional, need to convert it into at least a 2d array to allow [4,1] <--> [1,4]
    if (Array.isArray(input)) {
      if (!Array.isArray(input[0])) {
        input = [input];
      }
      let dimensions = [input.length];
      let x = input[0];
      while (Array.isArray(x)) {
        dimensions.push(x.length);
        x = x[0];
      }
      // the coordinates transformation being made is only 'rotate axis' aka [2,3,4] -> [4,3,2]
      let transformDim = dimensions.slice(1);
      transformDim.push(dimensions[0]);

      // fill matrix with values
      let transposedMatrix = utils.m_make(transformDim);

      utils.m_traverse((idx) => {
        // coordinates transformation method
        let shift = idx.slice(1);
        shift.push(idx[0]);
        // set the shifted coordinates to input[idx_coords]
        //@ts-ignore
        utils.m_setEle(transposedMatrix, shift, utils.m_getEle(input, idx));
      }, dimensions);
      return transposedMatrix;
    }
    return undefined;
  }
}

// Why did i call it C3line when it's 2 dim?
class C3Line {
  material;
  points: THREE.Vector2[];
  geometry: THREE.BufferGeometry;
  line: THREE.Line;

  constructor() {
    this.material = new THREE.LineBasicMaterial({color: 0x00ff});
    this.points = [new THREE.Vector2(0, 0), new THREE.Vector2(0, 0)];
    this.geometry = new THREE.BufferGeometry().setFromPoints(this.points);
    this.line = new THREE.Line(this.geometry, this.material);

  }

  set(x: THREE.Vector2, y: THREE.Vector2) {
    this.points = [x, y];
    this.geometry.setFromPoints(this.points);
    this.line.geometry = this.geometry;
  }

  get() {
    return this.line;
  }

  cleanup() {
    this.geometry.dispose();
    this.material.dispose();
  }
}

let CLAMP_VEC2 = (force: THREE.Vector2, maxForce: number): void => {
  if (force.length() > maxForce) {
    force.setLength(maxForce);
  }
};

export {
  utils,
  C3Line
}
export {
  ORG2,
  UP2,

  ORG,
  UP,

  CLAMP_VEC2
}