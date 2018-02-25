// Constructs a sequence of notes triggered relative to the base note

var NeedsTimingInfo = true;
var activeNotes = [];
var sequence = [2, 2, 1, 2, 2, 2, 1]; // Choose your sequence here. Enter integers for ups or downs
/* needed to make beatPos work */
function HandleMIDI(event) {
  if (event instanceof NoteOn) {
    constructSequence(event);
    // activeNotes.push(event);
    // for (var i = 0; i < sequence.length; i++) {
    //   var on = new NoteOn (activeNotes[i]);
    //   var previous  = new NoteOn (activeNotes[i])
    //   on.pitch = MIDI.normalizeData(previous.pitch + sequence[i]);
    //   activeNotes.push (on);
    //   on.sendAtBeat(previous.beatPos + 2);
    // }
  }

  else if (event instanceof NoteOff) {
		// remove note from array
    Reset();
		for (i = 0; i < activeNotes.length; i++) {
			if (activeNotes[i].pitch == event.pitch) {
				activeNotes.splice(i, 1);
				break;
			}
		}
	}

  else {
    event.send();
  }
}

function Reset() {
  activeNotes = [];
}

// function ProcessMIDI() {
//   for (var i = 0; i < activeNotes.length; i++) {
//     var currentNote = new NoteOn (sequence[i]);
//     currentNote.send();
//   }
// }

function constructSequence(event) {
  activeNotes.push (event);
  for (var i = 0; i < sequence.length; i++) {
    var on = new NoteOn;
    on.pitch = MIDI.normalizeData(activeNotes[i].pitch + sequence[i]);
    activeNotes.push (on);
  }
}

var wasPlaying = false;

function ProcessMIDI() {
	// Get timing information from the host application
	var musicInfo = GetTimingInfo();

	// clear activeNotes[] when the transport stops and send any remaining note off events
	if (wasPlaying && !musicInfo.playing){
		for(i=0;i<activeNotes.length;i++) {
			var off = new NoteOff(activeNotes[i]);
			off.send();
		}
	}

	wasPlaying = musicInfo.playing;

	if (activeNotes.length != 0) {

		// get parameters
		// var division = GetParameter("Beat Division");
		var division = 1;
		var noteOrder = 0;
		var noteLength = (100 / 100) * (1 / division);
		var randomLength = 0;
		var randomDelay = 0;
		var randomOctave = 1;

		// calculate beat to schedule
		var lookAheadEnd = musicInfo.blockEndBeat;
		var nextBeat = Math.ceil(musicInfo.blockStartBeat * division) / division;

		// when cycling, find the beats that wrap around the last buffer
		if (musicInfo.cycling && lookAheadEnd >= musicInfo.rightCycleBeat) {
			if (lookAheadEnd >= musicInfo.rightCycleBeat) {
				var cycleBeats = musicInfo.rightCycleBeat - musicInfo.leftCycleBeat;
				var cycleEnd = lookAheadEnd - cycleBeats;
			}
		}

		// var state = GetParameter("Reset");
    // if (state == 1) {
    //   Reset();
    // }

		// loop through the beats that fall within this buffer
		while ((nextBeat >= musicInfo.blockStartBeat && nextBeat < lookAheadEnd)
		// including beats that wrap around the cycle point
		|| (musicInfo.cycling && nextBeat < cycleEnd)) {
			// adjust for cycle
			if (musicInfo.cycling && nextBeat >= musicInfo.rightCycleBeat)
				nextBeat -= cycleBeats;

			// calculate step
			var step = Math.floor(nextBeat / (1 / division) - division);
			var chosenNote = chooseNote(noteOrder, step);

			// send events
			var noteOn = new NoteOn(chosenNote);
			// noteOn.pitch = MIDI.normalizeData(noteOn.pitch + randomOctave);
			noteOn.pitch = (noteOn.pitch + randomOctave);
			noteOn.sendAtBeat(nextBeat + randomDelay);
			var noteOff = new NoteOff(noteOn);
			noteOff.sendAtBeat(nextBeat + randomDelay + noteLength + randomLength)

			// advance to next beat
			nextBeat += 0.001;
			nextBeat = Math.ceil(nextBeat * division) / division;
		}
	}
}

var noteOrders = ["up", "down", "random"];

function chooseNote(noteOrder, step) {
	var order = noteOrders[noteOrder];
	var length = activeNotes.length
	if (order == "up") return activeNotes[step % length];
	if (order == "down") return activeNotes[Math.abs(step % length - (length - 1))];
	if (order == "random") return activeNotes[Math.floor(Math.random() * length)];
	else return 0;
}

// function constructSequence(event) {
//   activeNotes.push (event);
//   for (var i = 0; i < sequence.length; i++) {
//     var on = new NoteOn;
//     on.pitch = MIDI.normalizeData(activeNotes[i].pitch + sequence[i]);
//     on.beatPos = activeNotes[i].beatPos + 1;
//     activeNotes.push (on);
//   }
// }
