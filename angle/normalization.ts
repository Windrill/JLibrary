import {C_ARRAY_COPY, C_ARRAY_ELEMENT_SUB} from "../functions/algebra";

let NormalizeWithinPeriod = (angle: number, from: number, to: number) => {
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
      angle += (Math.abs(Math.round(angle / period)) + 1) * period;
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

let GetAngleRadian = (angleRes: number[]) => {
  let angleDeg = 1;
  let y = angleRes[1];
  let x = angleRes[0];
  console.assert(angleRes.length == 2);
  // let orgAng = (Math.atan2(y, x) * RAD2DEG);
  // console.log("Atan: ", orgAng.toFixed(2), NormalizeWithinPeriod(Math.atan2(y, x) * RAD2DEG + 360, 0, 360));
  if (angleRes.length == 2) {
    angleDeg = NormalizeWithinPeriod(Math.atan2(y, x) + Math.PI * 2, 0, Math.PI * 2);
  }
  return angleDeg;
};

/**
 * For degrees that are based on origin point.
 * @param vec1
 * @param vec2
 * @constructor
 */
//this is likse a global angle deg but i need the angle between 2 vectors not this......how 2 differentiate?
let RadDiff2D = (vec1: number[], vec2: number[]) => {
  // first you orthogonal the 2 angles, then you get the angle
  let angleRes = C_ARRAY_COPY(vec2);
  C_ARRAY_ELEMENT_SUB(angleRes, vec1);
console.log(vec1, vec2, angleRes);
  return GetAngleRadian(angleRes);
  // then add angle1's angle to??
}


export {
  NormalizeWithinPeriod,
  GetAngleRadian,
  RadDiff2D
}