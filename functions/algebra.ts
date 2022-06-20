import {D_Point, NDArray, OneDArray} from "./structures";
import {utils} from "../r_three";
import {Accumulator, ForEachArrayIndex, FUNCAccumulatorSum} from "./functional";

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
   * Each index = 1 dimension, locationRange & projectedRange is 1 array to 1 element in location array
   * Supporting 3D now...
   * 1. If projectedRange(range only for x) < location.size(x, y), something went wrong, so do a print.

   * @param location
   * @param locationRange
   * @param projectedRange
   * @param debug
   *
   * @constructor
   *
   * @return 1 dimension array like locations
   * Optimization: Project along a linearly & equally spaced area
   * Possible to allow locationRange = [default] which projects the line itself to projectedRange
   */
  static Project(location: OneDArray, locationRange: NDArray, projectedRange: NDArray, debug: boolean = false): OneDArray {
    let projected: OneDArray = [];
    // projected range needed to have 2....
    /*
    projectedRange for sure will be 2D
    //projectedRange.length <-- drect's render size
     */
    let minProjectability = Math.min(location.length, locationRange.length);

    // let wNormalizer = location[2] / (locationRange[2][0] - locationRange[2][1]);
    // TODO Interactive console for this
    // if (minProjectability < location.length) {
    // oh lol what if you gave extra output...like 'losses' outputs.. anwyays disabling this for now
    //   console.log(`You're calculating these incorrectly! Maybe during 'runtime check' you make sure you're ok
    //   Location: ${location}
    //   Projection Range: ${projectedRange}
    //   Location Range: ${locationRange}`);
    // }
    // 1. normalize Z for projection
    for (let i = 0; i < minProjectability; i++) {
      // actually should be equivalent...since w is normalized.
      if (i >= 2) {
        projected.push(location[i]);
        continue;
      }
      // min and max
      console.assert(locationRange[i].length == 2 && projectedRange[i].length == 2);
      let normalizedNumber = (location[i] - locationRange[i][0]) / (locationRange[i][1] - locationRange[i][0]);

      if (debug) {
        console.assert(typeof location[i] == "number");
        // console.log(`TOTAL:[${locationRange}] NormalizedNumber ${normalizedNumber} = (${location[i]} - ${locationRange[i][0]} / (${locationRange[i][1]} - ${locationRange[i][0]});`);
      }

      let projectedNumber = projectedRange[i][0] + (normalizedNumber * (projectedRange[i][1] - projectedRange[i][0]));
      projected.push(projectedNumber);
    }
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

const C_DOT = (a: D_Point, v: D_Point) => {
  return a.x * v.x + a.y * v.y;
};
const C_CROSS = (a: D_Point, v: { y: number; x: number; }) => {
  return a.x * v.y - a.y * v.x;
};
const C_DIST = (a: D_Point, v: { x: number; y: any; }) => {
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