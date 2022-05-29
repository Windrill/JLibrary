
// or let the period be an array.....of arrays???!na not for now
let normalizeWithinPeriod =(angle: number, from: number, to: number) => {
  let period = to - from;
  if (period < 0) {
    console.log("Circle range should be from small to large. Invalid period is not allowed");
    return;
  }
  if (angle < from || angle > to) {
    // angle % this number if it is positive....ehh...
    if (angle < 0) {
      angle += (Math.round(angle / period) +1) * period;
    }
    angle = angle % period;
  }
  angle = from + angle;
  return angle;
}
export {
  normalizeWithinPeriod
}