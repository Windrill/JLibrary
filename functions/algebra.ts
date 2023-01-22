import {
  D_Point,
  NDArray,
  OneDArray,
  Quackable,
  QuackableV3,
  QuackingV2
} from "./structures";
import {utils} from "../r_three";

type StrIndexable  = {
  [index: string]: any;
};

function AllZeroArray(n : number) {
  let allZeros = [];
  for(let i=0;i<n;i++) {
    allZeros.push(0);
  }
  return allZeros;
}
// import {utils} from "../r_three";
import {Accumulator, ForEachArrayIndex, ForEachObjectItem, FUNCAccumulatorSum} from "./functional";
// import {matrix} from "mathjs";
import {MathArray, qr, multiply} from "mathjs";

//https://github.com/mrdoob/three.js/blob/master/src/math/MathUtils.js
const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function Polar2Cartesian(r: number, radians: number): QuackingV2 {
  return {
    x: r * Math.cos(radians),
    y: r * Math.sin(radians)
  }
}

// x: number, y: number
function Cartesian2Polar(xy: QuackingV2) {
  return Math.atan2(xy.y, xy.x);
}

// can't do this 'specialization'
// type ProjectArray = number[][2];

class Algebra {
  static OrthoNormal() {
    let c1: //math.
      MathArray = [
      [2, 3, 1],
      [2, 4, 1]];
    console.log(qr(c1));

  }

  //matt : math.Matrix, mat : number[][]
  // static OrthoNormal() {
  //   // but what does getting orthonormal and QR yield??
  //   let c1 : math.MathArray = [[
  //     2,2,1
  //   ],
  //   [3,4,1]];
  //   console.log(math.qr(c1));
  // }
  //   new math.Matrix(//[
  //   );
  // c1.resize([3,1]);

//     c1.set(
// [
//       mat[0][0],
//       mat[0][1],
//       mat[0][2]]
//     )
  //    ]

  // let c2 = [
  //   mat[1][0],
  //   mat[1][1],
  //   mat[1][2]
  // ];
  // let c2hat = (C_DOT(c2, c1) / (C_DOT(c1, c1))).mult(c1);

  static Approx(x : number, y : number, eps : number = 0.003) {
    return Math.abs(x - y) < eps;
  }

  /**
  Range:   [-π, π]
   */
  static GetRad(point: Quackable) {
    return Math.atan2(-1 * point.y, point.x);
  }

  /**
   * Range: -PI
   * @param point
   * @param Quackable
   * @constructor
   */
  // static GetFullRad(point, Quackable) {
  //
  // }

  // intersect to ...... <-- how to choose quadrants?

  /**
   * Frame of reference relative to first point
   * @param fromPoint First point
   * @param toPoint Gets to second point. Basically subtracting two degrees....
   * @constructor
   */
  // Must be between 2 intersecting lines, and they are centered around 0 already. Which means this only calculates first quadrant results.
  static UnprojectP(fromPoint: Quackable, toPoint: Quackable) {
    // retrieve degrees from 2 angles, from, and to.
    return Algebra.GetRad(toPoint) - Algebra.GetRad(fromPoint);
  }

  // Project in terms of polar coordinates, returns cartesian
  /**
   * Only 1 frame of reference
   * @param baseLineVector: angle where 0 is. if you want a default it's (1, 0)
   * @param magnitude
   * @param projectAngle
   * @constructor
   */
  static ProjectP<T extends QuackingV2>(baseLineVector: T, magnitude: number, projectAngle: number): QuackingV2 {
    // baseLine's radian angle + projectAngle's radian angle --> new angle --> convert to cartesian
    let twoFrameAngle = Math.atan2(baseLineVector.y, baseLineVector.x) + DEG2RAD * (projectAngle);
    return Polar2Cartesian(magnitude, twoFrameAngle);
  }

  // -4, 3 --> 0, 1 (multiply by range, actually this is not offset this is range)
  // just projecting on the 3rd axis.
  // real offset abt x point....
  static ProjectAxis(point: OneDArray, renderDimensions: OneDArray, _offset: OneDArray = [0, 0]) {
    let renderSize = renderDimensions[1] - renderDimensions[0];
    let projectionZ = (point[2] - renderDimensions[0]) / renderSize;
    // console.log(projectionZ , "(", renderSize, point[2], renderDimensions[0]);

    let fullPoints = C_ARRAY_ELEMENT_SCALE(C_ARRAY_COPY(point), projectionZ);
    fullPoints.pop();

    // let vecA = utils.ArrayToVec3(point);
    return fullPoints;
  }

  /**
   *
   * Projects 1 (rectangular) range to another (rectangular) range. Support multi-dimensions.
   *
   * Note for the formation of the matrix, parallel lines still stay parallel after scalar projection (for now)
   * Relative distance between points are also constant, hence we only take the rectangular resize points' representation
   * @param location  eg. (10, 12)
   * @param varRange       // variable: eg. from 2 to 20\
   * @param locationRange <-- 600 to 1000
   * @param debug
   *
   * @constructor
   *
   * @return 1 dimension array like locations
   * Optimization: Project along a linearly & equally spaced area
   * Possible to allow locationRange = [default] which projects the line itself to projectedRange
   *
   */
  //location: OneDArray,
  static ScalarProjection(varRange: NDArray, locationRange: NDArray, _debug: boolean = false): NDArray {
    let minProjectability = Math.min(locationRange.length, varRange.length); //Math.min(location.length,
    // console.log("projecting in : ",minProjectability, " dims", location);
    // TODO Interactive console for this
    // oh lol what if you gave extra output...like 'losses' outputs.. anwyays disabling this for now
    // console.log(`DEBUG:
    //   Location: ${location}
    //   Variable Range: ${varRange}
    //   Screen Location Range: ${locationRange}`);
    let matrixData: NDArray = [];
    // last column of matrix is for translation constants, others are x, y, z....

    // for 2 dimensions, there are only 2 rows to this matrix. i didnt add the last row of 0, 0, 1. it's like a
    // 3 by 4 matrix to save the last row in a 4 by 4 matrix.
    for (let i = 0; i < minProjectability; i++) {
      let matrixRow = [];
      let c = varRange[i][0];
      let y = varRange[i][1];

      let a = locationRange[i][0];
      let v = locationRange[i][1];

      for (let j = 0; j < minProjectability; j++) {
        if (j == i)
          matrixRow.push(
            (v - a) / (y - c)
          );
        else
          matrixRow.push(0);
      }

      matrixRow.push(
        a - c * (v - a) / (y - c)
      );
      matrixData.push(matrixRow);
    }
    return matrixData;
    // console.log("Projected results: ", projected);
  } // end Project

  // blurry multiplication
  static CMatrixMult(matrixData: NDArray, location: OneDArray): OneDArray {
    let locationWScale: OneDArray = [...location];
    // ???? hacky. basically i have location=3 coordinates and dimension = 2
    if (matrixData[0].length > locationWScale.length) {
      locationWScale.push(1);
    }
    // Typescript parsing issue: you're only translating to more generic units? How to make sure this
    // specialization is reflected
    // eg. multiply<T typeof MathArray | MathType | Unit> (x: T, y: T): T
    let projected = multiply(matrixData, locationWScale);
    // let projected = math.multiply(matrixData, locationWScale);
    return <number[]>projected;
  }

  // ????? why cant you unionize it. find the innermost 1D array, and merge them
  static Average(dims: OneDArray) {
    let arraySum = 0;
    arraySum = Accumulator(FUNCAccumulatorSum, dims, arraySum);
    return arraySum / dims.length;
  }

  // lol, useless function, only called by 1 party
  static GetMidpoint(dimensions: NDArray): OneDArray {
    let midpoint: number[] = [];
    ForEachArrayIndex((i: number) => {
      midpoint.push(Algebra.Average(dimensions[i]));
    }, dimensions);
    return midpoint;
  }
} // End algebra class

declare global {
  interface Array<T> {
    reshape(rows: number, cols: number): void;
  }
}

Array.prototype.reshape = function (rows, cols) {
  let copy = this.slice(0); // Copy all elements.

  // Removes all items (and returns an array with them)
  this.splice(0, this.length);
  // this.length = 0; // Clear out existing array.

  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      let i = r * cols + c;
      if (i < copy.length) {
        row.push(copy[i]);
      }
    }
    this.push(row);
  }
};

// Not tested yet
const C_DOT = (a: Quackable, v: Quackable) => {
  let sum: number = 0;
  let i = 0;
  let reserveSpace: number[] = [];
  ForEachObjectItem(a, (k: number) => {
    reserveSpace.push(k);
  });
  ForEachObjectItem(v, (k: number) => {
    if (i > reserveSpace.length)
      return;
    reserveSpace[i] *= k;
    sum += reserveSpace[i];
    i++;
  });
  return sum;
};

// Vector perpendicular to the plane tha contains A & B. Magnitude is magA * magB * sin(theta)
const C_CROSS = (a: Quackable, b: Quackable): Quackable => {
  if (QuackableV3(a) && QuackableV3(b)) {
    return new D_Point(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x
    );
  }
  return new D_Point(
    a.x * b.y,
    b.x * a.y);

  // console.log(`debugging:
  //   ${a.y*b.z} - ${a.z*b.y},
  //   ${a.z*b.x} - ${a.x*b.z},
  //   ${a.x*b.y}-${a.y*b.x}`);
  // !a.zValid || !b.zValid
};

const C_DIST = (a: QuackingV2, v: QuackingV2) => {
  return a.x * v.x + a.y * v.y;
};
const C_OBJ_ELEMENT_MINUS = (a: D_Point, b: D_Point) => {
  return {x: a.x - b.x, y: a.y - b.y};
}

function C_ARRAY_COPY<Type>(a: Type[]): Type[] {
  let res = [];
  for (let i = 0; i < a.length; i++) {
    res.push(a[i]);
  }
  return res;
}

function C_ARRAY_ELEMENT_ADD(a: number[], b: number[]) {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    a[i] += b[i];
  }
  return a;
}

function C_ARRAY_ELEMENT_SUB(a: number[], b: number[]) {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    a[i] -= b[i];
  }
  return a;
}

function C_ARRAY_ELEMENT_MULT(a: number[], b: number[]) {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    a[i] *= b[i];
  }
  return a;
}

/**
 * Function: In place scale and return in place function
 * @param a
 * @param b
 * @constructor
 */
function C_ARRAY_ELEMENT_SCALE(a: any[], b: number) {
  for (let i = 0; i < a.length; i++) {
    a[i] *= b;
  }
  return a;
}

function SYN_GetMethods(obj: { [x: string]: { toString: () => string; }; }) {
  let result = [];
  for (let id in obj) {
    try {
      if (typeof (obj[id]) == "function") {
        // result.push(id);// + ": " + obj[id].toString());
        result.push(id + ": " + obj[id].toString());
      }
    } catch (err) {
      result.push(id + ": inaccessible");
    }
  }
  return result;
}

function CLAMP(num: number, low: number | null, high: number | null) {
  if (low !== null && num < low) {
    return low;
  }
  if (high !== null && num > high) {
    return high;
  }
  return num;
}

function WRAP(num: number, low: number, high: number) {
  if (num < low) {
    return high - (low - num);
  }
  if (num > high) {
    return low + (num - high);
  }
  return num;
}

export {
  Algebra,
}
export {
  CLAMP,
  WRAP,

  C_DIST,
  C_DOT,
  C_CROSS,

  C_ARRAY_COPY,
  C_OBJ_ELEMENT_MINUS,
  C_ARRAY_ELEMENT_ADD,
  C_ARRAY_ELEMENT_SUB,
  C_ARRAY_ELEMENT_MULT,
  C_ARRAY_ELEMENT_SCALE,
  SYN_GetMethods,

  Polar2Cartesian,
  Cartesian2Polar,
  StrIndexable,
  AllZeroArray
}

export {
  DEG2RAD,
  RAD2DEG
}
