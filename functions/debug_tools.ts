

// wrapper loses javascript debug context, dno fix for that so far
function CWhile (condition : ()=>boolean, closure : any, maxInvoc : number) {
  let numInvoc = 0;
  while (numInvoc < maxInvoc && condition()) {
    closure();
    numInvoc++;
  }
}