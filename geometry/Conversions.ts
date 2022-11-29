import {CRay} from "./CRay";
import {RadDiff2D, GetAngleRadian} from "../angle/normalization";
import * as THREE from 'three';
import {Quackable, QuackableV3} from "../functions/structures";
import {ForEachArrayIndex} from "../functions/functional";
import {BigNumber, Complex, Fraction, MathNumericType} from "mathjs";

function Quack2Vector2(from : Quackable) : THREE.Vector2 {
  return new THREE.Vector2(from.x, from.y);
}

function Vec2Ray(from : THREE.Vector2, to : THREE.Vector2) {
  // console.log("Vec2Ray: ", from.clone().sub(to), GetAngleRadian(to.clone().sub(from).toArray()));
  return new CRay(from, GetAngleRadian(to.clone().sub(from).toArray())
  );
}

// I think there's some issues with this, all 4 are evaluating to true.
// console.log(num, a(num), b(num), c(num), d(num), typeof num);
function MathTypeToNumber(num : MathNumericType) : number {
  const a = (_x: MathNumericType): _x is number => true;
  const b = (_x: MathNumericType): _x is BigNumber => true;
  const c = (_x: MathNumericType): _x is Fraction => true;
  const d = (_x: MathNumericType): _x is Complex => true;

  let ret = a(num) ? num : 0;
  if (a(num)) {
    ret = num;
  }
  else if (b(num)) {
    ret = num.toNumber();
  }
  else if (c(num)) {
    ret = num.s * num.n / num.d; // src/type/fraction/Fraction.js toJson
  }
  else if (d(num)) {
    ret = num.re;
  }
  return ret;
}

function Arr2Point (a : number[]) : Quackable {
  if (a.length < 2) {
    console.log("Too little points in Arr2Point", a);
  }
  if (a.length > 2) {
    return {x: a[0], y:a[1], z: a[2]};
  }
  return {x: a[0], y:a[1]};
}

function Point2Arr(p : Quackable) : number[] {
  let ret = [p.x, p.y];
  if (QuackableV3(p)) {
    ret.push(p.z);
  }
  return ret;
}

export {
  Vec2Ray,
  MathTypeToNumber,
  Quack2Vector2
}