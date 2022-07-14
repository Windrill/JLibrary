import {OneDArray} from "./structures";
import {ForEachArrayItem} from "./functional";

// Todo: string conversion for objects too
function FixNumbers(a: OneDArray, c = 2) {
  let resultStr = "[";
  // also do one for object
  ForEachArrayItem((b: number) => {
    resultStr += b.toFixed(c) + ", ";
  }, a);
  if (resultStr.length > 2)
    resultStr = resultStr.slice(0, resultStr.length - 2);
  resultStr += "]";
  return resultStr;
}

// wrap console.log

export {
  FixNumbers
}