import {CRay} from "./CRay";
import {AngleDiff2D, GetAngleRadian} from "../angle/normalization";
import * as THREE from 'three';
import {DEG2RAD} from "../functions/algebra";

function Vec2Ray(from : THREE.Vector2, to : THREE.Vector2) {
  // console.log("Vec2Ray: ", from.clone().sub(to), GetAngleRadian(to.clone().sub(from).toArray()));
  return new CRay(from, GetAngleRadian(to.clone().sub(from).toArray())
  );
}

export {
  Vec2Ray
}