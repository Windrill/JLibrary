/**
 * Similar to a mapping function, convenience.
 * @param func: function to run on each array index
 * @param array: javscript array
 * @constructor
 */
function ForEachArrayIndex(func: any, array: any[]) {
  for (let i : number = 0; i < array.length; i++) {
    func(i);
  }
}

function Accumulator(func: any, array: any[], acc = 0): any {
  for (let i = 0; i < array.length; i++) {
    acc = func(acc, array[i]);
  }
  return acc;
}

// trivial functions
function ArrayAlloc(length: number, value: number = 0) {
  let newArr = [];
  for (let i=0;i<length;i++) {
    newArr.push(value);
  }
  return newArr;
}

function ArrayClone(arr : any[]) {
  let ret = [];
  for (let i=0;i<arr.length;i++) {
    ret.push(arr[i]);
  }
  return ret;
}


export {
  ForEachArrayIndex,
  Accumulator
  }
  export {
    ArrayAlloc,
    ArrayClone
  }