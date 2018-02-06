// Copy and paste this chunk of code into your script editor to create controls in your plugin

var NeedsTimingInfo = true;

var PluginParameters = [];

// Types of Plugin Parameters
const LINEAR_FADER = "lin";
const LOGARITHMIC_FADER = "log";
const MOMENTARY_BUTTON = "momentary";
const MENU = "menu";
const NOT_NEEDED = "";

/*
To create a plugin parameter (a fader or knob that changes something is a basic way of desribing it), call the createPluginParameter function as follows:
createPluginParameter("Enter a name in quotes", Enter a type from above in quotes (for example: LINEAR_FADER), Enter a minimum value, Enter a maximum value, Enter a default value, enter the number of steps, "Enter a unit in quotes", "Enter text to create a divider/header in the plug-in", Enter a list of value strings if you are creating a menu as follows: ["something", "something", "something"]);
*/

function createPluginParameter (name, type, minValue, maxValue, defaultValue, numberOfSteps, unit, text, valueStrings) {
  if (type == MENU) {
    PluginParameters.push (createMenuPluginParameter (name, type, minValue, maxValue, defaultValue, numberOfSteps, unit, text, valueStrings));
  }
  else {
    PluginParameters.push (createBasicPluginParameter (name, type, minValue, maxValue, defaultValue, numberOfSteps, unit, text));
  }
}

function createBasicPluginParameter (name, type, minValue, maxValue, defaultValue, numberOfSteps, unit, text) {
  return {name: name, type: type, minValue: minValue, maxValue: maxValue, numberOfSteps: numberOfSteps, unit: unit, text: text};
}

function createMenuPluginParameter (name, type, minValue, maxValue, defaultValue, numberOfSteps, unit, text, valueStrings) {
  return {name: name, type: type, minValue: minValue, maxValue: maxValue, numberOfSteps: numberOfSteps, unit: unit, text: text, valueStrings: valueStrings};
}

//Parameters for the plugin
