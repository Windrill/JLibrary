import {D_Point, NDArray, OneDArray, Quackable, QuackableV3, QuackAdd, QuackingV2} from "./structures";
import {Accumulator, ForEachArrayIndex, FUNCAccumulatorSum} from "./functional";
// import {matrix} from "mathjs";
import {MathArray, multiply, qr} from "mathjs";
import {NormalizeWithinPeriod} from "../angle/normalization";

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

//https://github.com/mrdoob/three.js/blob/master/src/math/MathUtils.js
const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

// Angle to coordinates
function Polar2Cartesian(radius: number, radians: number, oppositeY : boolean = false): QuackingV2 {
  let oppoY =radius * Math.sin(radians);
  if (oppositeY) oppoY = -1 * oppoY;
  return {
    x: radius * Math.cos(radians),
    y: oppoY
  }
}

// x: number, y: number
// Similar to GetRad. Actually, the same.
function Cartesian2Polar(xy: QuackingV2, oppositeY : boolean = false){
  if (oppositeY) {
    return Algebra.GetRad({
      x: xy.x,
      y: -xy.y
    });
  }
  return Algebra.GetRad(xy);
}

// from 2 points, get the 2 angles, relative to itself.
// actually the second angle is by default 0, 0
function GetDoubleSidedDegreee(toPoint : QuackingV2, fromPoint : QuackingV2 = {x:0,y:0}) : [number, number] {
  let quackingDifference = QuackAdd(toPoint, {x: -fromPoint.x, y: -fromPoint.y});
  let oneDegree = Algebra.GetDegree(quackingDifference);
  let otherDegree = NormalizeWithinPeriod(oneDegree + 180, -180, 180);
  if (oneDegree * otherDegree > 0) {
    console.log("These 2 degrees are supposed to be 1 positive and one negative but it's not " + oneDegree + " " + otherDegree);
  }
  if (oneDegree < 0) {
    return [oneDegree, otherDegree];
  }
  return [otherDegree, oneDegree];
}

// Basis Angle
class CAngle {
  // By default, in angles, instead of radians
  angle : number;
  basis : number;
  period : [number, number]
  // Angle normalized range: -180 to 180.
  constructor(angle : number = 0, basis : number = 0, period : number[] = [-180, 180]) {
    this.angle = angle;
    this.basis = basis;
    if (period.length != 2) {
      if (period.length != 0) console.log("There is some period defined but the length is not 2 (no from and to period)")
      this.period = [-180, 180];
    } else {
      this.period = [period[0], period[1]];
    }
    // Unless you really want something that for ccw is cw, and cw is ccw
    console.assert(this.period[0] < this.period[1]);
    this.angle = this.normalizeOne(this.angle);
  }

  getComplementAngle() {
    return this.normalizeOne(this.angle - (this.period[1] - this.period[0])/2);
  }

  normalizeOne(angle : number) {
    return (NormalizeWithinPeriod(angle, this.period[0], this.period[1]));
  }
  toString() {
    return `${this.angle.toFixed(1)}D, basis:${this.basis.toFixed(1)}`;
  }

  // if ccw, move in same direction
  move(magnitudeDegree : number) {
    // if first half of period, then move ...........................
    // actually it's not very obvious.
    let middle = (this.period[0] + this.period[1])/2;
    // -180 to 0, is left part of period, it's clockwise
    let angleInclinedLeftOrCW = this.angle < middle;
    if (angleInclinedLeftOrCW) {
      this.angle -= magnitudeDegree;
    } else {
      this.angle += magnitudeDegree;
    }
  }
}


/*
1. Rays have direction
2. When rays intersect, or lines intersect, split into 'from'  and 'to', 2 points.
3. these 2 points and its intersection are on one line
 */
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

  // For 2D angles
  static ConvertBasis(angle1 : CAngle , newBasis : number) {
    return new CAngle(angle1.angle - (newBasis - angle1.basis), newBasis);
  }

  // -180, 180.
  static DegreeComplement(deg : number) {
    if (deg < 0) {
      return -180 - deg;
    } else {
      return 180 - deg;
    }
  }
  // Just 'frame' it against horizontal
  // -PI is -180, so -180 to 180
  // getdegree and atan2 gets diff results???
  static GetDegree(vec : Quackable) {
    return RAD2DEG * Algebra.GetRad(vec);
  }
  /**
  Range:   [-π, π]
   */
  // need to abstract away, see
  /*
        // it was easy to mix up direction and actual x,y coordinates. so you need to change this getrad y * -1 into a
      // data structure that converts directions into xy coordinates.
   */
  //-1 *
  static GetRad(point: Quackable) {
    return Math.atan2(point.y, point.x);
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
  sum = a.x * v.x + a.y * v.y;
  if (QuackableV3(a) && a.z && QuackableV3(v) && v.z) {
    sum += a.z * v.z;
  }
  return sum;
};

// Convert array to x, y or x,y,z.
// Vector perpendicular to the plane tha contains A & B. Magnitude is magA * magB * sin(theta)
const C_CROSS = (a: Quackable, b: Quackable): Quackable | number => {
  // typescript is making another incorrect decision where the type is not quackablev3 but it acts as if it is
  // if (QuackableV3(a) && QuackableV3(b)) {
  if (QuackableV3(a) && a.z && QuackableV3(b) && b.z) {
    return new D_Point(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x
    );
  }
  return a.x * b.y - a.y * b.x;
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
  AllZeroArray
  ,
  GetDoubleSidedDegreee,
  CAngle
};
export type { StrIndexable };

export {
  DEG2RAD,
  RAD2DEG
}
