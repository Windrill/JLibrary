import * as THREE from 'three'
import {R_Canvas} from "../canvas/canvas";
import {ORG2} from "../r_three";
import {C_CROSS} from "../functions/algebra";
import {Listener} from "../canvas/canvas_listener";
import {CanvasContext} from "../functions/structures";
import {ForEachArrayItem} from "../functions/functional";

// For example, the midpoint on which boundary line will be computed & redrawn upon.
type GenericContext = {
  [index: string]: any;
};

class CObject {
  // Familiar name.
  public name : string
  // Save your mousedown listen functions' items here
  public contextObject : GenericContext;
  // Component manager

  addComponent(canvas: CanvasContext, lambdaSet: [string, (...args: any) => any][]) {
    // unreal has it as a tree but you can have it as a list
    let listen = new Listener(canvas);
    ForEachArrayItem((lamb: [string, (...args: any) => any])=> {
      listen.setListenFunction(lamb[0], lamb[1], false);
    }, lambdaSet);

    // I want a context function to come with this that you can modify for each object.

    return listen;
  }

  constructor() {
    this.name = "";
    this.contextObject = {};
  }
}
// jlibrary->rthree
// why boundary is separate from ray??
// totally a static object, no la it's just the static thing that a ray casts against, boundaries
// don't need to cast anything they're the objects inside a map, so always use this
class Boundary extends CObject {
  points : THREE.Vector2[];
  constructor(p1 = ORG2, p2 = ORG2) {
    super();
    this.points = [p1, p2];
  }

  set(x: THREE.Vector2, y: THREE.Vector2) {
    this.points = [x, y];
  }

  draw(canvas : R_Canvas) {
    canvas.cline(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y, {
      fillStyle: "#167a7a",
      lineWidth: 8,
      debug: false
    });
  }

  drawDirection(canvas : R_Canvas) {
    canvas.carrow(this.points[1], this.getDirection(), this.getLength());
  }

  getDirection() {
    return this.points[1].clone().sub(this.points[0]);
  }

  getOppoDirection() {
    return this.points[0].clone().sub(this.points[1]);
  }

  getLength() {
    return this.getDirection().length();
  }

  getNormal() {
    return C_CROSS(this.points[0], this.points[1]);
  }

  toString() {
    return `(${this.points[0].x},${this.points[0].y})  -> (${this.points[1].x},${this.points[1].y})`;
  }
}
/*
class Plane {
  draw() {

  }
}*/

export {
  Boundary,
  CObject
}