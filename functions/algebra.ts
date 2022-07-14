import {D_Point, NDArray, OneDArray} from "./structures";
import {utils} from "../r_three";
import {Accumulator, ForEachArrayIndex, FUNCAccumulatorSum} from "./functional";
import * as math from "mathjs";

//https://github.com/mrdoob/three.js/blob/master/src/math/MathUtils.js
const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function Polar2Cartesian(r: number, theta: number) {
  return {
    x: r * Math.cos(theta),
    y: r * Math.sin(theta)
  }
}

// can't do this 'specializatio'n
// type ProjectArray = number[][2];

class Algebra {
  // Project in terms of polar coordinates, returns cartesian
  static ProjectP(baseLineVector: D_Point, magnitude: number, projectAngle: number) {
    // baseLine's radian angle + projectAngle's radian angle --> new angle --> convert to cartesian
    let twoFrameAngle = Math.atan2(baseLineVector.y, baseLineVector.x) + DEG2RAD * (projectAngle);
    return Polar2Cartesian(magnitude, twoFrameAngle);
  }

  // -4, 3 --> 0, 1 (multiply by range, actually this is not offset this is range)
  // just projecting on the 3rd axis.
  // real offset abt x point....
  static ProjectAxis(point: OneDArray, renderDimensions: OneDArray, offset: OneDArray = [0,0]) {
    let renderSize = renderDimensions[1] - renderDimensions[0];
    let projectionZ = (point[2]-renderDimensions[0]) / renderSize;
    // console.log(projectionZ , "(", renderSize, point[2], renderDimensions[0]);

    let fullPoints = C_ARRAY_ELEMENT_SCALE(C_ARRAY_COPY(point), projectionZ);
    fullPoints.pop();

    let vecA = utils.ArrayToVec3(point);
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
  static ScalarProjection(location: OneDArray, varRange: NDArray,locationRange: NDArray, debug: boolean = false): OneDArray {
    let minProjectability = Math.min(Math.min(location.length, locationRange.length), varRange.length);
    // console.log("projecting in : ",minProjectability, " dims", location);
    // TODO Interactive console for this
    // oh lol what if you gave extra output...like 'losses' outputs.. anwyays disabling this for now
    // console.log(`DEBUG:
    //   Location: ${location}
    //   Variable Range: ${varRange}
    //   Screen Location Range: ${locationRange}`);
    let matrixData: NDArray = [];
    // last column of matrix is for translation constants, others are x, y, z....
    let dimensions = minProjectability;

    // for 2 dimensions, there are only 2 rows to this matrix. i didnt add the last row of 0, 0, 1. it's like a
    // 3 by 4 matrix to save the last row in a 4 by 4 matrix.
    for (let i = 0; i < minProjectability; i++) {
      let matrixRow = [];
      let c = varRange[i][0];
      let y = varRange[i][1];

      let a = locationRange[i][0];
      let v = locationRange[i][1];

      for (let j = 0; j < dimensions; j++) {
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
    let locationWScale: OneDArray = [...location];
    // ???? hacky. basically i have location=3 coordinates and dimension = 2
    if (matrixData[0].length > locationWScale.length) {
      locationWScale.push(1);
    }

    // Typescript parsing issue: you're only translating to more generic units? How to make sure this
    // specialization is reflected
    // eg. multiply<T typeof MathArray | MathType | Unit> (x: T, y: T): T
    let projected = math.multiply(matrixData, locationWScale);
    // console.log("Projected results: ", projected);
    return projected;
  } // end Project


  // ????? why cant you unionize it. find the innermost 1D array, and merge them
  static Average(dims : OneDArray) {
    let arraySum = Accumulator(FUNCAccumulatorSum, dims);
    return arraySum / dims.length;
  }
  // lol, useless function, only called by 1 party
  static GetMidpoint(dimensions : NDArray) : OneDArray {
    let midpoint : number[] = [];
    ForEachArrayIndex((i : number)=> {
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
// what stupid idea is this??? can you do element wise multiplication
// don't go so nute
const C_DOT = (a: D_Point, v: D_Point) => {
  // how do you indicate some data????
  // let sum : number = 0;
  // ForEachObjectKey(a, (k) => {
  //   sum += a[k] * v[k];
  // });
  return a.x * v.x + a.y * v.y + a.z * v.z;

};

// Vector perpendicular to the plane tha contains A & B. Magnitude is magA * magB * sin(theta)
const C_CROSS = (a: D_Point, b: D_Point) : D_Point => {
  if (!a.zValid || !b.zValid) {
    console.log("Crossing 2D vector");
    return new D_Point(
      a.x * b.y,
      b.x * a.y);
  }

  // console.log(`debugging:
  //   ${a.y*b.z} - ${a.z*b.y},
  //   ${a.z*b.x} - ${a.x*b.z},
  //   ${a.x*b.y}-${a.y*b.x}`);

  return new D_Point(
    a.y*b.z - a.z*b.y,
    a.z*b.x - a.x*b.z,
    a.x*b.y-a.y*b.x
  );
};
const C_DIST = (a: D_Point, v: D_Point) => {
  return a.x * v.x + a.y * v.y;
};
const C_OBJ_ELEMENT_MINUS = (a: D_Point, b: D_Point) => {
  return {x: a.x - b.x, y: a.y - b.y};
}

function C_ARRAY_COPY(a: any[]): any[] {
  let res = [];
  for (let i = 0; i < a.length; i++) {
    res.push(a[i]);
  }
  return res;
}

function C_ARRAY_ELEMENT_ADD(a: any[], b: any[]) {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    a[i] += b[i];
  }
  return a;
}

function C_ARRAY_ELEMENT_MULT(a: any[], b: any[]) {
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
  C_ARRAY_ELEMENT_MULT,
  C_ARRAY_ELEMENT_SCALE,
  SYN_GetMethods,

  Polar2Cartesian
}

export {
  DEG2RAD,
  RAD2DEG
}