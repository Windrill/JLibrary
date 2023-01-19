
// When complete, add this to utils.
// let lastLoop = new Date();

function measure(lambdOrScope : any) {
// let thisLoop = new Date();
// let fps = 1000 / (thisLoop - lastLoop);
// lastLoop = thisLoop;
  lambdOrScope();
// console.log("Rendering at: ", fps);
}