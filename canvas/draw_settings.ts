// Generated differently for each lambda??
// One per point
import {ForEachArrayIndex, ForEachObjectKey} from "../functions/functional";
import {StrIndexable} from "../functions/algebra";
const DrawSettingsKeys = ["radius", "startAngle", "endAngle", "_anticlockwise", "color", "name"];


function fillThis<T extends StrIndexable>(original : T, options? : Partial<T>) {
  if (options) {
    ForEachObjectKey((k: string) => {
      // can't do this.k, must do this[k]
      // Lol typescript checker broke!
      // @ts-ignore
      original[k] = options[k];
    }, options);
  }
}
class DrawSettings {
  [index: string]: any;
  debug : boolean = false;
  radius: number = 3;
  startAngle: number = 0;
  endAngle = 360;
  _anticlockwise = false;
  fillStyle = "#000000";
  name = "";
  // Multidimensional: 3rd axis is z, or is it ????

  constructor(options?: Partial<DrawSettings>) {
    fillThis<DrawSettings>(this, options);
  }

  // multidimensional axis still have the same resulting properties as regular draw settings! hence,
  // drawsettings might be generated twice for each new axis, but dimensions are same
  copy() {
    let currentAttributes = Object.keys(this);
    let newSetting = new DrawSettings();
    ForEachArrayIndex((i: number) => {
      // can this be a string
      let attribValue: any = currentAttributes[i];
      if (attribValue in DrawSettingsKeys) {
        newSetting[attribValue] = currentAttributes[attribValue];
      }
    }, currentAttributes);
    return newSetting;
  } // Cloning settings
} // End DrawSettings

// Options settings....
interface DrawStyle {
  fillStyle: string;
  strokeStyle: string;
  fontStyle: string;
  debug: boolean;
  lineWidth: number;
  textStyle: string;
}

function initDrawStyle(options?: Partial<DrawStyle>): DrawStyle {
  const defaults = {
    // fillStyle: "#61adc4",
    fillStyle: "#000000",
    strokeStyle: "#ffffff",
    fontStyle: "16px serif",
    debug: false,
    lineWidth: 1,
    textStyle: "#bd9696",
  };

  return {
    ...defaults,
    ...options,
  };
}

class LinesDrawSettings extends DrawSettings {
  strokeStyle: string = "#ffffff";
  fontStyle: string = "16px serif";
  debug: boolean = false;
  lineWidth: number = 1;
  textStyle: string = "#bd9696";

  constructor(options?: Partial<LinesDrawSettings>) {
    super();
    fillThis<LinesDrawSettings>(this, options);
  }
  // constructor(styles : StrIndexable = {}) {
  //   super();
  //   this.strokeStyle = "#ffffff";
  //   this.fontStyle = "16px serif";
  //   this.debug = false;
  //   this.lineWidth = 1;
  //   this.textStyle = "#bd9696";
  //   // just do the optional<>thing.
  //   ForEachObjectKey((style : string) => {
  //     this[style] = styles[style];
  //   }, styles);
  // }
}


class PointDrawSettings extends DrawSettings {
  radius: number = 3;
  startAngle: number = 0;
  endAngle = 360;
  _anticlockwise = false;
  constructor(options?: Partial<PointDrawSettings>) {
    super();
    fillThis<PointDrawSettings>(this, options);
  }
}


// I guess this is 'compose'
class SessionDrawSettings {
  commonStyles : DrawSettings;
  // how to define the common areas, and use the one you want???
  // how to know which one you want???
  // hmm........how to let parent drawSettings override??
  pds : PointDrawSettings;
  lds : LinesDrawSettings;
  // Can you just auto-coerce a default class into a specific class?
  // Waste my time defining method definitions specifically!!
  // Can define a class template to do this?????
  /*
  class <ClassTemplateGeneralizeWithDefaultConstructors(DrawSettings)> SessionDrawSettings {
    constructor(pds? : PointDrawSettings, lds? : LinesDrawSettings) {}
  }
  then, when you create this with a more general constructor (a subset lol)
  new SessionDrawSettings(existingPointDrawSettings, existingSessionDrawSettings)
  // just coerce existingSessionDrawSettings into LinesDrawSettings.
   */
  constructor(pds? : PointDrawSettings, lds? : LinesDrawSettings) {
    this.pds = pds || new PointDrawSettings();
    this.lds = lds || new LinesDrawSettings();
    this.commonStyles = new DrawSettings();
  }
}

/*
also have a factory function that creates
'extra' fields only.
with all other fields as defaults if not specified.
 */


type StyleType = {
  fillStyle: string,
  debug: boolean, lineWidth: number
};

// Default styles!
let CStyles = {
  defaultLine: {
    fillStyle: "#000000",
    debug: false,
    lineWidth: 1
  },
  brightGreen: {fillStyle: "#31d08e", strokeStyle: "#31d08e", debug: false, lineWidth: 4},
  darkGreen: {fillStyle: "#365c4c", strokeStyle: "#365c4c", debug: false, lineWidth: 3},
  redThick: {fillStyle: "#d03131", strokeStyle: "#d03131", debug: false, lineWidth: 19},
  orange: {fillStyle: "#d07931", strokeStyle: "#d07931", debug: false, lineWidth: 7},
  orangeThick: {fillStyle: "#d07931", strokeStyle: "#d07931", debug: false, lineWidth: 17},
  blue: {fillStyle: "#126cb4", strokeStyle: "#126cb4", debug: false, lineWidth: 3},
  purple: {fillStyle: "#6c40d5", strokeStyle: "#6c40d5", debug: false, lineWidth: 5}
}

let CColors = {
  green1: new DrawSettings({fillStyle: "#ecfae5"}),
  green2: new DrawSettings({fillStyle: "#a6fa58"}),
  green3: new DrawSettings({fillStyle: "#226c00"})
}

let CPoints = {
  green1: new PointDrawSettings({debug: true, radius: 8, fillStyle: "#ecfae5"}),
  green2: new DrawSettings({debug: true, radius: 6, fillStyle: "#a6fa58"}),
  green3: new DrawSettings({debug: true, radius: 4, fillStyle: "#226c00"}),
  red: new PointDrawSettings({debug: true, radius: 7, fillStyle: "#da1e53"}),
  orangeOnly: new PointDrawSettings({debug: false, radius: 7, fillStyle: "#ea6d90"})
}

let CDrawSettings = {
  white: new DrawSettings({debug: false, strokeStyle: "#ecfae5", fillStyle: "#ecfae5"}),
  purple: new DrawSettings({debug: false, strokeStyle: "#8f63ee", fillStyle: "#8f63ee"}),
  blue: new DrawSettings({fillStyle: "#126cb4", strokeStyle: "#126cb4", debug: false, lineWidth: 3}),
}


let CLineDrawSettings = {
  white: new LinesDrawSettings({debug: false, strokeStyle: "#ecfae5", fillStyle: "#ecfae5"}),
  purple: new LinesDrawSettings({debug: false, strokeStyle: "#8f63ee", fillStyle: "#8f63ee"}),
  blue: new LinesDrawSettings({fillStyle: "#126cb4", debug: false, lineWidth: 3}),
  brightGreen: new LinesDrawSettings({fillStyle: "#31d08e", strokeStyle: "#31d08e", debug: false, lineWidth: 4}),
  gblue: new LinesDrawSettings({
    fillStyle: "#167a7a",
    strokeStyle: "#167a7a",
    lineWidth: 8,
    debug: false
  })
}

// const DEFAULT_SESSION_DRAW_SETTINGS = new SessionDrawSettings();
export {
  DrawSettings,
  PointDrawSettings,
  LinesDrawSettings,
  DrawSettingsKeys,
  SessionDrawSettings,
  // DEFAULT_SESSION_DRAW_SETTINGS
}

export {
  DrawStyle,
  initDrawStyle
}

export {
  CPoints,
  CColors,
  CStyles,
  CDrawSettings,
  CLineDrawSettings,
  StyleType
}