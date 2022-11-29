// DOM Listener
// canvas draw listener
// import {R_Canvas} from "./canvas";
//extends R_Canvas

// Event_Dispatcher is for your own system
// Listener is for windows events, and document events

import {CanvasContext, CanvasPassAlong} from "../functions/structures";
import {ForEachObjectKey} from "../functions/functional";

class Listener extends CanvasPassAlong {
  // Typescript declarations
  lambdas: {
    [index: string]: any;
    // func: any;
    // propagate: boolean;
  }

  state: {
    pressed: boolean;
  }

  element : Element;

  constructor(context: CanvasContext) {
    super(context);
    this.element = context.element;
    // Events:
    /*
    pointerdown, pointermove, pointerup, mouseout
     */

    // Select states that maintain across functions
    this.state = {
      pressed: false
    };
    this.lambdas = {};
  }

  setElement(element : Element) {
    this.element = element;
  }

  getElement() {
    return this.element;
  }

  // need to make into array
  setListenFunction(name: string, func: (...args: any) => any, propagate = false) {
    let boundFunc = func.bind(this);
    this.lambdas[name] = {func: boundFunc, propagate: propagate};

    let element = this.context.element;
    element.addEventListener(name, boundFunc, propagate);
  }

  cleanup() {
    if (!this.lambdas) {
      return;
    }
    // for (let lam in Object.keys(this.lambdas)) {
    ForEachObjectKey((lam : string) => {
      let element = this.context.element;
      console.log("Cleanup lambda ", this.lambdas, lam, this.lambdas[lam]);
      element.removeEventListener(lam, this.lambdas[lam].func, this.lambdas[lam].propagate);
    }, this.lambdas);

    //    this.binddown = this.onPointerDown.bind(this);
    //    this.element.addEventListener("pointerdown", this.binddown, false);
    // this.element.removeEventListener("pointerdown", this.binddown, false);
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