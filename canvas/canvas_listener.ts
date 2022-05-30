// canvas draw listener
import {R_Canvas} from "./canvas";

class Listener extends R_Canvas {
  // Typescript declarations
  element;
  binddown;
  bindmove;
  bindup;
  bindout;
  pressed: boolean = false;

  constructor(ctx: CanvasRenderingContext2D, element: any) {
    super(ctx);
    this.element = element;
    this.binddown = this.onPointerDown.bind(this);
    this.bindmove = this.onPointerDrag.bind(this);
    this.bindup = this.onPointerUp.bind(this);
    this.bindout = this.onFocusOut.bind(this);
    this.element.addEventListener("pointerdown", this.binddown, false);
    this.element.addEventListener("pointermove", this.bindmove, false);
    this.element.addEventListener("pointerup", this.bindup, false);
    this.element.addEventListener("mouseout", this.bindout, false);

    this.pressed = false;
  }

  onFocusOut(e: any) {
    console.log(e);
    this.pressed = false;
  }

  onPointerDown(e: any) {
    this.mousedown(e);
    if (!this.pressed) this.mousedownevent(e);
    this.pressed = true;
  }

  onPointerDrag(e: any) {
    console.log(e);
    if (!this.pressed) return;
    this.mousemove(e);
  }

  onPointerUp(e: any) {
    this.pressed = false;
    this.mouseup(e);
  }

  mousedown(e: any) {
    console.log(e);
  };

  mousemove(e: any) {
    console.log(e);
  }

  mouseup(e: any) {
    console.log(e);
  }

  mousedownevent(e: any) {
    console.log(e);
  }

  action() {
  }

  destructor() {
    this.element.removeEventListener("pointerdown", this.binddown, false);
    this.element.removeEventListener("pointermove", this.bindmove, false);
    this.element.removeEventListener("pointerup", this.bindup, false);
    this.element.removeEventListener("mouseout", this.bindout, false);
  }
}

export {
  Listener,

}