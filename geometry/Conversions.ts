import {CRay} from "./CRay";
import {AngleDiff2D, GetAngleDegree} from "../angle/normalization";
import * as THREE from 'three';
import {DEG2RAD} from "../functions/algebra";

function Vec2Ray(location : THREE.Vector2, vector : THREE.Vector2) {
  return new CRay(location,
    DEG2RAD * GetAngleDegree(vector.clone().sub(location).toArray())
  );
}

export {
  Vec2Ray
}