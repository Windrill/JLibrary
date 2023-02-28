// i want to keep track of 1 variable. or a couple.
// everytime a for loop runs (next frame?????)


class StateTracker {
  // trackFrame();

  // built-in display?
}

class StateDisplayer {
  tracker : StateTracker;
  currentState : number; // indexed by 0, but you could start with -1
  constructor(stateTrack : StateTracker) {
    this.tracker = stateTrack;
    // To display the current state.
    this.currentState = -1;
  }

  // which means you'll need to either, parse every draw command that comes in
  // Or, turn it on or off using a state?????
  // do you need to slot it in so firmly within the application???
  // check 'redux'.
}

// state tracker & layering -- so you can see the points you're drawing right on top of each other.