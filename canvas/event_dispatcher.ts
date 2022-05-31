// Not connected to DOM, entirely user driven
/**
 * @author mrdoob / http://mrdoob.com/
 */

// import { EventDispatcher } from '../src/EventDispatcher.js';
//
// // Adding events to custom object
//
// class Car extends EventDispatcher {
//   start () {
//     this.dispatchEvent( { type: 'start', message: 'vroom vroom!' } );
//   }
// }
//
// // Using events
// var car = new Car();
// car.addEventListener( 'start', function ( event ) {
//   alert( event.message );
// } );
// car.start();
interface Event {
  target: EventDispatcher;
  type: any;
  message: string;
}

type EventLambda = ((event: Event) => any);

class EventDispatcher {
  public _listeners?: {
    [index: string]: EventLambda[];
  };

  addEventListener(type: string, listener: EventLambda) {

    if (this._listeners === undefined) this._listeners = {};

    const listeners = this._listeners;

    if (listeners[type] === undefined) {

      listeners[type] = [];

    }

    if (listeners[type].indexOf(listener) === -1) {

      listeners[type].push(listener);

    }

  }

  hasEventListener(type: string, listener: any) {

    if (this._listeners === undefined) return false;

    const listeners = this._listeners;

    return listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1;

  }

  removeEventListener(type: string, listener: EventLambda) {

    if (this._listeners === undefined) return;

    const listeners = this._listeners;
    const listenerArray = listeners[type];

    if (listenerArray !== undefined) {

      const index = listenerArray.indexOf(listener);

      if (index !== -1) {

        listenerArray.splice(index, 1);

      }

    }

  }

  dispatchEvent(event: Event) {

    if (this._listeners === undefined) return;

    const listeners = this._listeners;
    const listenerArray = listeners[event.type];

    if (listenerArray !== undefined) {

      event.target = this;

      // Make a copy, in case listeners are removed while iterating.
      const array = listenerArray.slice(0);

      for (let i = 0, l = array.length; i < l; i++) {

        array[i].call(this, event);

      }

    }

  }

}

export {EventDispatcher};