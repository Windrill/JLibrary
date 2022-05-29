/*
class utils {
  static getSphere(r) {
    let geometry = new THREE.SphereGeometry(r, 24, 24);
    let material = new THREE.MeshBasicMaterial({color: 'rgb(255,255,255)'});
    return new THREE.Mesh(geometry, material);
  }

  static getBox(w, h, d) {
    let geometry = new THREE.BoxGeometry(w, h, d);
    let material = new THREE.MeshPhongMaterial({color: 'rgb(120,120,120)'});
    let mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    return mesh;
  }

  // unpack (vector) point from object
  static oup(o) {
    return [o.x, o.y, o.z];
  }

  // make a vector
  static av(arr) {
    return {x: arr[0], y: arr[1]};
  };

  static uv(o) {
    return [o.x, o.y];
  }

  // subtract array 2 from array 1
  static sv(arr1, arr2) {
    return arr1.map(function (item, index) {
      return item - arr2[index];
    });
  }

  static isAgnosticLeft(a, b, c, debug = false) {
    if (a.y > b.y) {
      return this.isLeft(b, a, c, debug);
    } else {
      return this.isLeft(a, b, c, debug);
    }
  }

  // if c is left of ab
  static isLeft(a, b, c, debug = false) {
    if (debug) {
      console.log(`${utils.uv(a)}, ${utils.uv(b)}, ${utils.uv(c)}`);
    }
    return ((b.x - a.x) * (c.y - a.y) - ((b.y - a.y) * (c.x - a.x))) > 0;
  }

  // interpret an axis as 3 float positions
  static interpret(axis) {
    if (!Array.isArray(axis)) {
      return [axis.x, axis.y, axis.z];
    }
    return axis;
  }

  static setMatFromArr(m, a) {
    m.set(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
  }

  static rotateAboutWorldAxis(object, axis, angle) {
    let rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationAxis(axis.normalize(), angle);
    let currentPos = new THREE.Vector4(object.position.x, object.position.y, object.position.z, 1);
    let newPos = currentPos.applyMatrix4(rotationMatrix);
    object.position.x = newPos.x;
    object.position.y = newPos.y;
    object.position.z = newPos.z;
  }

  // axis-angle to matrix4
  static rotate_aa(axis, angle) {
    let [x, y, z] = utils.interpret(axis);
    let t = 1 - Math.cos(angle);
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    // classic gems, glassner academic press 1990
    let mat = new THREE.Matrix4().set(
      t * x * x + c, t * x * y + s * z + s * z, t * x * z - s * y, 0,
      t * x * y - s * z, t * y * y + c, t * y * z + s * x, 0,
      t * s * z + s * y, t * y * z - s * x, t * z * z + c, 0,
      0, 0, 0, 1
    );
    return mat;
  }

  static m_make(dims) {
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
  static m_traverse(func, dim, input = []) {
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

  static m_getEle(array, indices) {
    if (indices.length == 0) {
      return array;
    } else {
      return utils.m_getEle(array[indices[0]], indices.slice(1));
    }
  }

  static m_setEle(arr, idx, ele) {
    if (idx.length == 1) {
      arr[idx[0]] = ele;
    } else {
      utils.m_setEle(arr[idx[0]], idx.slice(1), ele);
    }
  }

  // trans = utils.m_transpose([[8,7,3],[4,5,6]]);
  static m_transpose(input) {
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
        utils.m_setEle(transposedMatrix, shift, utils.m_getEle(input, idx));
      }, dimensions);
      return transposedMatrix;
    }
    return undefined;
  }
}

class CLine {
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

  set(x, y) {
    this.points = [x, y];
    this.geometry.setFromPoints(this.points);
    this.line.geometry = this.geometry;
  }

  get() {
    return this.line;
  }
}

*/
export {

}