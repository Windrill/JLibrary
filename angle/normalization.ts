import {C_ARRAY_COPY, C_ARRAY_ELEMENT_ADD, C_ARRAY_ELEMENT_SUB} from "../functions/algebra";
import {Quackable} from "../functions/structures";

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

let GetAngleDegree = (angleRes: number[]) => {
  let angleDeg = 1;
  let y = angleRes[1];
  let x = angleRes[0];
  console.assert (angleRes.length == 2);
  if (angleRes.length == 2) {
    angleDeg = NormalizeWithinPeriod(Math.atan2(y, x) / 3.14 * 180, 0, 360) / 360;
  }
  return angleDeg;
};


// vector2
let AngleDiff2D = (vec1: number[], vec2: number[]) => {
  // first you orthogonize the 2 angles, then you get the angle
  let angleRes = C_ARRAY_COPY(vec2);
  C_ARRAY_ELEMENT_SUB(angleRes, vec1);

  return GetAngleDegree(angleRes);
  // then add angle1's angle to??
}



export {
  NormalizeWithinPeriod,
  GetAngleDegree,
  AngleDiff2D
}