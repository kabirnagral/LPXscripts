//-----------------------------------------------------------------------------
// Simple Arpeggiator
//-----------------------------------------------------------------------------
/*
		Held notes are tracked in a global array in the HandleMIDI() callback.
		Notes are chosen and played back during the ProcessMIDI() callback.
*/

var NeedsTimingInfo = true;
var sequence = [];
var increments = [];

function HandleMIDI(event) {
	if (event instanceof NoteOn) {
		sequence.push(event);
		var n = new NoteOn(event);
		n.pitch = MIDI.normalizeData(event.pitch + 2);
		sequence.push (n);
	}
	else if (event instanceof NoteOff) {
		// remove note from array
		Reset();
		for (i = 0; i < sequence.length; i++) {
			if (sequence[i].pitch == event.pitch) {
				sequence.splice (i, 1);
				break;
			}
		}
	}
	// pass non-note events through
	else event.send();

	// sort array of active notes
	sequence.sort(sortByPitchAscending);
}

function constructScale (event) {
	var newNote = new NoteOn(event);
	newNote.pitch = MIDI.normalizeData(newNote.pitch + 2);
	sequence.push(newNote);
	var newNote2 = new NoteOn(newNote);
	newNote2.pitch = MIDI.normalizeData(newNote2.pitch + 2);
	sequence.push(newNote);
	// for (var i = 1; i < 8; i++) {
	// 	switch (i) {
	// 		case 1:
	// 		case 2:
	// 		case 4:
	// 		case 5:
	// 		case 6:
	// 			sequence.push (changeNotePitch(sequence [i - 1]), 2);
	// 			break;
	// 		case 3:
	// 		case 7:
	// 			sequence.push (changeNotePitch(sequence [i - 1]), 1);
	// 			break;
	// 	}
	// }
}

function changeNotePitch (event, change) {
	var newNote = new NoteOn(event);
	newNote.pitch = MIDI.normalizeData(newNote.pitch + change);
	return newNote;
}

//-----------------------------------------------------------------------------
function sortByPitchAscending (a, b) {
	if (a.pitch < b.pitch) {
    return -1;
  }
	if (a.pitch > b.pitch) {
    return 1;
  }
	return 0;
}

//-----------------------------------------------------------------------------
var wasPlaying = false;

function ProcessMIDI() {
	// Get timing information from the host application
	var musicInfo = GetTimingInfo();

	// clear sequence[] when the transport stops and send any remaining note off events
	if (wasPlaying && !musicInfo.playing) {
		for(i = 0;i < sequence.length; i++) {
			var off = new NoteOff(sequence[i]);
			off.send();
		}
	}

	wasPlaying = musicInfo.playing;

	if (sequence.length != 0) {

		// get parameters
		var division = GetParameter("Beat Division");
		var noteOrder = GetParameter("Note Order");
		var noteLength = (GetParameter("Note Length") / 100) * (1 / division);
		// var randomLength = Math.random() * ((GetParameter("Random Length") / 100) * (1 / division));
		// var randomDelay = Math.random() * ((GetParameter("Random Delay") / 100) * (1 / division));
		// var randomOctave = Math.floor(Math.random() * GetParameter("Random Octave")) * 12;

		// calculate beat to schedule
		var lookAheadEnd = musicInfo.blockEndBeat;
		var nextBeat = Math.ceil(musicInfo.blockStartBeat * division) / division;

		// when cycling, find the beats that wrap around the last buffer
		if (musicInfo.cycling && lookAheadEnd >= musicInfo.rightCycleBeat && lookAheadEnd >= musicInfo.rightCycleBeat) {
      var cycleBeats = musicInfo.rightCycleBeat - musicInfo.leftCycleBeat;
      var cycleEnd = lookAheadEnd - cycleBeats;
		}

    var state = GetParameter("Reset");
    if (state == 1) {
      Reset();
    }

		// loop through the beats that fall within this buffer
		while ((nextBeat >= musicInfo.blockStartBeat && nextBeat < lookAheadEnd && state == 0)
		// including beats that wrap around the cycle point
		|| (musicInfo.cycling && nextBeat < cycleEnd)) {

			// adjust for cycle
			if (musicInfo.cycling && nextBeat >= musicInfo.rightCycleBeat)
				nextBeat -= cycleBeats;

			// calculate step
			var step = Math.floor(nextBeat / (1 / division) - division);
			var chosenNote = chooseNote(noteOrder, step);

			for (var i = 0; i < sequence.length; i++) {
				if (musicInfo.cycling && nextBeat >= musicInfo.rightCycleBeat)
					nextBeat -= cycleBeats;
				var currentNote = new NoteOn(sequence[i]);
				currentNote.pitch = MIDI.normalizeData(currentNote.pitch);
				currentNote.sendAtBeat (nextBeat);
				var noteOff = new NoteOff(currentNote);
				noteOff.sendAtBeat(nextBeat + noteLength);
				nextBeat += 0.001;
				nextBeat = Math.ceil(nextBeat * division) / division;
			}
			break;

			// send events
			// var noteOn = new NoteOn(chosenNote);
			// noteOn.pitch = MIDI.normalizeData(noteOn.pitch);
			// noteOn.sendAtBeat(nextBeat);
			// var noteOff = new NoteOff(noteOn);
			// noteOff.sendAtBeat(nextBeat + noteLength);

			// advance to next beat

		}
	}
}

function Reset() {
  NeedsTimingInfo = true;
  sequence = [];
  SetParameter ("Reset", 0);
}

//-----------------------------------------------------------------------------
var noteOrders = ["up", "down", "random"];

function chooseNote(noteOrder, step) {
	var order = noteOrders[noteOrder];
	var length = sequence.length;
	if (order == "up") return sequence[step % length];
	if (order == "down") return sequence[Math.abs(step % length - (length - 1))];
	if (order == "random") return sequence[Math.floor(Math.random() * length)];
	else return 0;
}

//-----------------------------------------------------------------------------
// var PluginParameters =
// [
// 		{name:"Beat Division", type:"linear",
// 		minValue:1, maxValue:16, numberOfSteps:15, defaultValue:1},
//
// 		{name:"Note Order", type:"menu", valueStrings:noteOrders,
// 		minValue:0, maxValue:2, numberOfSteps: 3, defaultValue:0},
//
// 		{name:"Note Length", unit:"%", type:"linear",
// 		minValue:1, maxValue:200, defaultValue:100.0, numberOfSteps:199},
//
// 		{name:"Random Length", unit:"%", type:"linear",
// 		minValue:0, maxValue:200, numberOfSteps: 200, defaultValue:0},
//
// 		{name:"Random Delay", unit:"%", type:"linear",
// 		minValue:0, maxValue:200, numberOfSteps:200, defaultValue:0},
//
// 		{name:"Random Octave", type:"linear",
// 		minValue:1, maxValue:4, defaultValue:1, numberOfSteps:3}
// ];
var PluginParameters =
[
		{name:"Beat Division", type:"linear",
		minValue:1, maxValue:16, numberOfSteps:15, defaultValue:1},

		{name:"Note Order", type:"menu", valueStrings:noteOrders,
		minValue:0, maxValue:2, numberOfSteps: 3, defaultValue:0},

		{name:"Reset", type:"menu", valueStrings:["Off", "On"],
		minValue:0, maxValue:1, numberOfSteps: 2, defaultValue:0},

		{name:"Note Length", unit:"%", type:"linear",
		minValue:1, maxValue:200, defaultValue:100.0, numberOfSteps:199}
];

// ----------------------------------------------------------------------------
// Code from plugin.js

// Copy and paste this chunk of code into your script editor to create controls in your plugin

// var PluginParameters = [];

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
