// function ForEachObjectKey(func: any, object: {}) {
//   for (Object.keys(object)) {
//
//   }
// }

/**
 * Similar to a mapping function, convenience.
 * @param func: function to run on each array index
 * @param array: javascript array
 * @constructor
 */
function ForEachArrayIndex(func: any, array: any[]) {
  for (let i: number = 0; i < array.length; i++) {
    func(i);
  }
}

function ForEachArrayItem(func: any, array: any[]) {
  for (let i: number = 0; i < array.length; i++) {
    func(array[i]);
  }
}

function ForEachObjectKey(func: any, object: { }) {
  ForEachArrayItem(func, Object.keys(object));
}

function ForEachObjectItem(func: any, object: { }) {
  ForEachArrayItem(func, Object.keys(object));
}

const FUNCAccumulatorSum = (acc : number, numberAtI : number) => {
  return acc + numberAtI;
};

function Accumulator<T, S>(func: (t:T, s:S)=>T, array: S[], acc : T): any {
  for (let i = 0; i < array.length; i++) {
    acc = func(acc, array[i]);
  }
  return acc;
}

// trivial functions
function ArrayAlloc(length: number, value: number = 0) {
  let newArr = [];
  for (let i = 0; i < length; i++) {
    newArr.push(value);
  }
  return newArr;
}

function ArrayClone(arr: any[]) {
  let ret = [];
  for (let i = 0; i < arr.length; i++) {
    ret.push(arr[i]);
  }
  return ret;
}

/*
Returns positions of the sorted array using this function
Comparator: > 0	means "a > b", a after b
 */
function IndexSort<T>(arr : T[], comparator : (a: T, b: T) => number) : number[] {
  let sortedIndices : number[] = [];
  type indexPairType = [T, number];
  let arrBoth : indexPairType[] = [];
  ForEachArrayIndex((i : number)=>{
    arrBoth.push([arr[i], i]);
  }, arr);

  arrBoth.sort((a : indexPairType, b: indexPairType) : number=> {
    return comparator(a[0], b[0]);
  });
  ForEachArrayItem((a : indexPairType) => {
    sortedIndices.push(a[1]);
  }, arrBoth);
  return sortedIndices;
}

// Intention: runs this once or multiple times based on 'array-like' status (on this object, or on each element of the array)
// Issue: Cannot differentiate using '.length', because Vector2 in three.js has length overridden which means magnitude
function CompositeFunc(obj : any | any[], func : (obj: any)=>any) {
  if (obj.length) {
    for (let i=0;i<obj.length;i++) {
      func(obj[i]);
    }
  } else {
    func(obj);
  }
}
export {
  FUNCAccumulatorSum
}

export {
  ForEachArrayIndex,
  ForEachArrayItem,
  ForEachObjectKey,
  ForEachObjectItem,

  Accumulator,
  CompositeFunc,
  IndexSort
}

export {
  ArrayAlloc,
  ArrayClone
}