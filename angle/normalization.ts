import {C_ARRAY_COPY, C_ARRAY_ELEMENT_SUB} from "../functions/algebra";

/*
Angle difference in real geometric scenario, which is different from number lines.
 */
// looks at the closest route! if the difference is 180 degrees...bigger, smaller = negative
// actually for regular scenarios, big, smaller = positive difference.......................... : (
//
// must not exceed 360, also when there are 2 ways..... 110--70 -> this is 180. -70 - 110, -110 - 70, 70 - -110
let AngleDiff = (angle1: number, angle2: number, from: number = -180, to: number = 180) => {
  let normalized1 = NormalizeWithinPeriod(angle1, from, to);
  let normalized2 = NormalizeWithinPeriod(angle2, from, to);
  let normalized = NormalizeWithinPeriod(normalized1 - normalized2, from, to);
  // console.log(normalized, (to - from) - normalized);
  return Math.min(normalized, (to - from) - normalized);
}
// angle addition???? -70 + 110,
// it's almost like, + is undoing.
// which means you either flip angles. or flip angles, never add them.

let NormalizeWithinPeriod = (angle: number, from: number = -180, to: number = 180) => {
  let period = to - from;
  if (period < 0) {
    console.log(from, to, to - from, period);
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
    if (angle >= to) { // for the extra 1
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
//this is like a global angle deg but i need the angle between 2 vectors not this......how 2 differentiate?
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
  RadDiff2D,
  AngleDiff
}