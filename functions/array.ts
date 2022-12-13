// arrBoth.sort((a : indexPairType, b: indexPairType) : number=> {
//   return comparator(a[0], b[0]);
// });
import {ForEachArrayItem} from "./functional";

class NumConv {
  valueOf() {

  };
}

function ArrToString<T>(arr : T[]) {
  let retStr = "";
  ForEachArrayItem((a: { toString: () => string; }) => retStr += a.toString(), arr);
  return retStr;
}


/*
Binary search for an already sorted array.
 */
// Got 'any' here : (
function BinarySearch<T extends Object>(arr: T[], find: T, lte: boolean = true, comparator: (x: T, y: T) => number = (x: any, y: any) => (x.valueOf()) - y.valueOf()) {
  return bsIdx(arr, find, lte, 0, arr.length, comparator);
}

// how does c++ do equivalent numbers.....do 2 bs basically
// lte: larger than equal = lowerBound!
function bsIdx<T>(arr: T[], find: T, lte: boolean, l1: number, l2: number, comparator: (x: T, y: T) => number): number {
  if (l1 > l2) {
    console.log("[Binary searching] Shouldn't happen");
    return -1;
  }
  if (l1 == l2) {
    // if ()
    return l1;
  }

  let mid = Math.floor((l1 + l2) / 2);
  let greaterBound = lte ? comparator(find, arr[mid]) > 0 : comparator(find, arr[mid]) >= 0;
  // It kind of flips because greater-equal-to eliminated the first half, while you want the first
  // half if you don't eliminate. Aka first is lowerbound, second upperbound,
  if (greaterBound) {
    return bsIdx(arr, find, lte, mid + 1, l2, comparator);
  } else {
    return bsIdx(arr, find, lte, l1, mid, comparator);
  }
}

export {
  BinarySearch,
  ArrToString
}