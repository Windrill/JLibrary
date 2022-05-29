// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
function hsl2rgb(h: number, s: number, l: number)
{
  let a=s*Math.min(l,1-l);
  let f = (n: number,k=(n+h/30)%12) => l - a*Math.max(Math.min(k-3,9-k,1),-1);
  return [f(0),f(8),f(4)];
}   

// in: r,g,b in [0,1], out: h in [0,360) and s,v in [0,1]
function rgb2hsl(r: number, g: number, b: number)
{
  let a=Math.max(r,g,b), n=a-Math.min(r,g,b), f=(1-Math.abs(a+a-n-1)); 
  let h= n && ((a==r) ? (g-b)/n : ((a==g) ? 2+(b-r)/n : 4+(r-g)/n)); 
  return [60*(h<0?h+6:h), f ? n/f : 0, (a+a-n)/2];
} 

function hexToRgb(c: string){
  c = c.substring(1);      // strip #
  let rgb = parseInt(c, 16);   // convert rrggbb to decimal
  let r = (rgb >> 16) & 0xff;  // extract red
  let g = (rgb >>  8) & 0xff;  // extract green
  let b = (rgb >>  0) & 0xff;  // extract blue
  return [r,g,b];
}


function componentToHex(c: any) {
  let component = c;
  if (typeof component == "string") {
    component = parseInt(component);
  }
  var hex = parseInt(component).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: any, g: any, b: any) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
//cmyk
function cmyk2rgb(c: number, m: number, y: number, k: number){
  let r = 255.*(1-c)*(1-k);
  let g = 255.*(1-m)*(1-k);
  let b = 255.*(1-y)*(1-k);
  return [r,g,b];
}
function rgb2cmyk(r : number, g :number,b:number){
  // btw this doesnt trigger ,,, why????
  if (r == 0 && g == 0 && b == 0){
    return [0,0,0,0];
  }
  let rr = r/255., gg=g/255., bb=b/255.;
  let k = 1.-Math.max(rr,gg,bb);
  let c = (1.-rr-k)/(1.-k);
  let m = (1.-gg-k)/(1.-k);
  let y = (1.-bb-k)/(1.-k);
  return [c,m,y,k];
}

let ColorConversions = {
  hsl2rgb,
  rgb2hsl,
  hexToRgb,
  rgbToHex,
  cmyk2rgb,
  rgb2cmyk
}

export {
ColorConversions
}