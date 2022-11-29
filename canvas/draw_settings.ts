// Generated differently for each lambda??
// One per point
import {ForEachArrayIndex} from "../functions/functional";
const DrawSettingsKeys = ["radius", "startAngle", "endAngle", "_anticlockwise", "color", "name"];

class DrawSettings {
  [index: string]: any;

  radius: number = 3;
  startAngle: number = 0;
  endAngle = 360;
  _anticlockwise = false;
  color = "#000000";
  name = "";
  // Multidimensional: 3rd axis is z, or is it ????

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

export {
  DrawSettings,
  DrawSettingsKeys
}