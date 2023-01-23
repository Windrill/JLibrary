import {ForEachArrayIndex, ForEachArrayItem, ForEachObjectKey} from "./functional";
import {StrIndexable} from "./algebra";

function BinarySearchNonUniform<T extends Object, S extends Object>(arr: T[], find: S, largerThanEqual: boolean = true, comparator: (x: T, y: S) => number = (x: any, y: any) => (x.valueOf()) - y.valueOf()) {
  return bsIdxNonUniform(arr, find, largerThanEqual, 0, arr.length, comparator);
}

// how does c++ do equivalent numbers.....do 2 bs basically
// lte: larger than equal = lowerBound!
function bsIdxNonUniform<T, S>(arr: T[], find: S, lte: boolean, l1: number, l2: number, comparator: (x: T, y: S) => number): number {
  if (l1 > l2) {
    console.log("[Binary searching] Shouldn't happen");
    return -1;
  }
  if (l1 == l2) {
    return l1;
  }

  let mid = Math.floor((l1 + l2) / 2);
  let greaterBound = lte ? comparator(arr[mid], find) < 0 : comparator(arr[mid], find) <= 0;
  // It kind of flips because greater-equal-to eliminated the first half, while you want the first
  // half if you don't eliminate. Aka first is lowerbound, second upperbound,
  if (greaterBound) {
    return bsIdxNonUniform(arr, find, lte, mid + 1, l2, comparator);
  } else {
    return bsIdxNonUniform(arr, find, lte, l1, mid, comparator);
  }
}


/*
Binary search for an already sorted array.
 */

// Got 'any' here : (
function BinarySearch<T extends Object>(arr: T[], find: T, lte: boolean = true, comparator: (x: T, y: T) => number = (x: any, y: any) => (x.valueOf()) - y.valueOf(), debug: boolean = false) {
  return bsIdx(arr, find, lte, 0, arr.length, comparator, debug);
}

// how does c++ do equivalent numbers.....do 2 bs basically
// lte: larger than equal = lowerBound!
function bsIdx<T>(arr: T[], find: T, lte: boolean, l1: number, l2: number, comparator: (x: T, y: T) => number, debug: boolean): number {
  if (l1 > l2) {
    console.log("[Binary searching] Shouldn't happen");
    return -1;
  }
  if (l1 == l2) {
    return l1;
  }

  let mid = Math.floor((l1 + l2) / 2);
  let greaterBound = lte ? comparator(find, arr[mid]) > 0 : comparator(find, arr[mid]) >= 0;
  // It kind of flips because greater-equal-to eliminated the first half, while you want the first
  // half if you don't eliminate. Aka first is lowerbound, second upperbound,
  if (debug) {
    console.log("Greater bound: ", greaterBound, l1, mid, l2, arr[mid], find);
  }
  if (greaterBound) {
    return bsIdx(arr, find, lte, mid + 1, l2, comparator, debug);
  } else {
    return bsIdx(arr, find, lte, l1, mid, comparator, debug);
  }
}

function ObjToString(obj: StrIndexable) {
  let retStr = "";
  ForEachObjectKey((k: string) => {
    retStr += `(${k}:${obj[k]})`
  }, obj);
  return retStr;
}

function ArrToString<T>(arr: T[]) {
  let retStr = "";
  ForEachArrayItem((a: { toString: () => string; }) => retStr += a.toString(), arr);
  return retStr;
}

/*
Approximate array equal by epsilon.
 */
function ArrayEqualNum(a: number[], b: number[], epsilon: number = 0.000001) {
  let equals = true;
  ForEachArrayIndex((i: number) => {
    if (equals) {
      equals = a[i] == b[i] || Math.abs(a[i] - b[i]) < epsilon;
    }
  }, a);
  return equals;
}

function ObjectEqual(a: StrIndexable, b: StrIndexable) {
  if (Object.keys(a).length != Object.keys(b).length) {
    return false;
  }
  let equals = true;
  ForEachObjectKey((key: string) => {
    if (equals) {
      // Integers only, no floats.
      equals = b[key] != undefined && a[key] === b[key];
    }
  }, a);
  return equals;
}

export {
  BinarySearch,
  BinarySearchNonUniform,
  ArrToString,
  ArrayEqualNum,
  ObjectEqual, // TODO: Move this away.
  ObjToString
}