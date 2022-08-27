// DOM Listener
// canvas draw listener
// import {R_Canvas} from "./canvas";
//extends R_Canvas
class Listener {
  // Typescript declarations
  element :HTMLElement;

  lambdas: {
    [index: string]: any;
    // binddown: (e: any) => void;
    // bindmove: (e: any) => void;
    // bindup: (e: any) => void;
    // bindout: (e: any) => void;
  }

  state: {
    pressed: boolean;
  }
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D, element: HTMLElement) {
    this.element = element;
    this.ctx = ctx;
    // this.binddown = this.onPointerDown.bind(this);
    // this.bindmove = this.onPointerDrag.bind(this);
    // this.bindup = this.onPointerUp.bind(this);
    // this.bindout = this.onFocusOut.bind(this);
    // this.element.addEventListener("pointerdown", this.binddown, false);
    // this.element.addEventListener("pointermove", this.bindmove, false);
    // this.element.addEventListener("pointerup", this.bindup, false);
    // this.element.addEventListener("mouseout", this.bindout, false);

    // Select states that maintain across functions
    this.state = {
      pressed: false
    };
    this.lambdas = {};
  }
  setListenFunction(name : string, func : (...args : any)=>any, propogate=false) {
    this.lambdas[name] = func.bind(this);
    this.element.addEventListener(name, func, propogate);
  }

  // onFocusOut(e: any) {
  //   console.log(e);
  //   this.pressed = false;
  // }
  //
  // onPointerDown(e: any) {
  //   this.mousedown(e);
  //   if (!this.pressed) this.mousedownevent(e);
  //   this.pressed = true;
  // }
  //
  // onPointerDrag(e: any) {
  //   console.log(e);
  //   if (!this.pressed) return;
  //   this.mousemove(e);
  // }
  //
  // onPointerUp(e: any) {
  //   this.pressed = false;
  //   this.mouseup(e);
  // }
  //
  // mousedown(e: any) {
  //   console.log(e);
  // };
  //
  // mousemove(e: any) {
  //   console.log(e);
  // }
  //
  // mouseup(e: any) {
  //   console.log(e);
  // }
  //
  // mousedownevent(e: any) {
  //   console.log(e);
  // }

  action() {
  }

  destructor() {
    for (let lam in Object.keys(this.lambdas)) {
      this.element.removeEventListener(lam, this.lambdas[lam], false);
    }
    // this.element.removeEventListener("pointerdown", this.binddown, false);
    // this.element.removeEventListener("pointermove", this.bindmove, false);
    // this.element.removeEventListener("pointerup", this.bindup, false);
    // this.element.removeEventListener("mouseout", this.bindout, false);
  }
}

export {
  Listener,
}

// Using event dispatcher instead
/*

class Car extends EventDispatcher {
  start () {
    this.dispatchEvent( { type: 'start', message: 'vroom vroom!' } );
  }
  end () {
    this.dispatchEvent( { type: 'end', message: 'vroom vroom!' } );
  }
}

let cc = new Car();
cc.addEventListener("end", (e : ListenerEvent) => {
  console.log("Listened to start done");
  // console.log(e.message);
});
// cc.hasEventListener("prod");
cc.start();
cc.end();
// let aa : EventLambda = ()=>{};

 */