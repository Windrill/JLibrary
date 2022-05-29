/*
// can youjust have isolated moudles = false for this single typescript file?
//npx ts-node ./src/JLibrary/tests/circle_test.ts
// wrap with: normalize
// testing framework that doesn't have to work with 1 compiler.... lol, just a language free framework
// also make oracle testing easier..... compare last code and this code change against test cases, if all boundary cases work it should mean change is harmless
// each test should be recorded to compare test results, document, and also prepare for oracle testing

// import {normalizeWithinPeriod} from "../circle";
let normalizeWithinPeriod =(angle: number, from: number, to: number) => {
  let period = to - from;
  if (period < 0) {
    console.log("Circle range should be from small to large. Invalid period is not allowed");
    return 0;
  }
  if (angle < from || angle > to) {
    // angle % this number if it is positive....ehh...
    if (angle < 0) {
      // console.log(angle, (Math.abs(Math.round(angle / period))+1) * period);
      // Extra 1 wasn't needed in the end -- if angle is within period,
      angle += (Math.abs(Math.round(angle / period))+1) * period;
      // angle += (Math.abs(Math.round(angle / period))) * period;
    }
    // console.log(angle, period);
    angle = angle % (period);
    if (angle >= to) { // for the exatra 1
      angle -= period;
    }
    // console.log(angle, from);
  }
  return angle;
}

let diffBtwnAngles = (angle1: number, angle2: number, from: number, to: number) => {
  let normalized1 = normalizeWithinPeriod(angle1, from, to);
  let normalized2 = normalizeWithinPeriod(angle2, from, to);
  let normalized = normalizeWithinPeriod(normalized1 - normalized2, from, to);
  return Math.min(normalized, (to-from)-normalized);
}

console.log(diffBtwnAngles(-20, 60, -180, 180));
console.log(diffBtwnAngles(-120, 60, -180, 180));
console.log(diffBtwnAngles(-220, 60, -180, 180));
console.log(diffBtwnAngles(-0, 180, -180, 180));
console.log(diffBtwnAngles(-0, 360, -180, 180));
console.log(diffBtwnAngles(-20, 320, -180, 180));
console.log(diffBtwnAngles(-20, 360, -180, 180));
console.log(diffBtwnAngles(-20, -40, -180, 180));
console.log(diffBtwnAngles(40, 80, -180, 180));

console.log(diffBtwnAngles(-40, 180, -180, 180));
// console.log(
//   normalizeWithinPeriod(-360, -180, 180)); // 0
// console.log(
//   normalizeWithinPeriod(36, -180, 180)); // 36
// console.log(
//   normalizeWithinPeriod(160, -180, 180)); // 160
// console.log(
//   normalizeWithinPeriod(360+160, -180, 180)); // 36
// console.log(
//   normalizeWithinPeriod(350+160, -180, 180)); // 36
// console.log(
//   normalizeWithinPeriod(-350+160, -180, 180)); // 36
// console.log(
//   normalizeWithinPeriod(361, -180, 180)); // 1
// console.log(
//   normalizeWithinPeriod(-361, -180, 180)); // -1
// console.log(
//   normalizeWithinPeriod(-180, -180, 180)); // -180
// console.log(
//   normalizeWithinPeriod(997, -180, 180)); // -180
// console.log(
//   normalizeWithinPeriod(0, -180, 180));
// console.log(
//   normalizeWithinPeriod(180, -180, 180));
// console.log(
//   normalizeWithinPeriod(181, -180, 180));
// console.log(
//   normalizeWithinPeriod(720, -360, 0));
// console.log(
//   normalizeWithinPeriod(-720, -360, 0));



 */
export {};
