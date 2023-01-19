import {NormalizeWithinPeriod} from "../../angle/normalization";

let diffBtwnAngles = (angle1: number, angle2: number, from: number, to: number) => {
  let normalized1 = NormalizeWithinPeriod(angle1, from, to);
  let normalized2 = NormalizeWithinPeriod(angle2, from, to);
  let normalized = NormalizeWithinPeriod(normalized1 - normalized2, from, to);
  // console.log(normalized, (to - from) - normalized);
  return Math.min(normalized, (to - from) - normalized);
}
describe('Angle Tests', () => {
  test('Angle Normalization', () => {
    expect(NormalizeWithinPeriod(-360, -180, 180) == 0);
    expect(NormalizeWithinPeriod(36, -180, 180)==36);
    expect(NormalizeWithinPeriod(160, -180, 180)==160);
    expect(NormalizeWithinPeriod(360+160, -180, 180)==160);
   expect(NormalizeWithinPeriod(350+160, -180, 180)== 150);
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
  });

  test("Angle Difference", ()=> {
    expect(diffBtwnAngles(-20, 60, -180, 180) == -80);
    expect(diffBtwnAngles(-120, 60, -180, 180) == -180);
    expect(diffBtwnAngles(-220, 60, -180, 180) == 80);
    expect(diffBtwnAngles(-0, 180, -180, 180) == -180);
    expect(diffBtwnAngles(-0, 360, -180, 180) == 0);
    expect(diffBtwnAngles(-20, 320, -180, 180) == -60);
    expect(diffBtwnAngles(-20, 360, -180, 180) == -20);
    expect(diffBtwnAngles(-20, -40, -180, 180) == -20);
    expect(diffBtwnAngles(40, 80, -180, 180) == -40);
    expect(diffBtwnAngles(-40, 180, -180, 180) == 140);
  });
});