// Triggers chords derived from played note

// Chordtypes
var maj_Chord = [4, 7];
var min_Chord = [3, 7];
var dim_Chord = [3, 6];
var maj7th_Chord = [4, 7, 11];
var min7th_Chord = [3, 7, 10];
var dom7th_Chord = [4, 7, 10];
var dim7th_Chord = [3, 6, 10];

var activeNotes = [];

function HandleMIDI(event) {
    if (GetParameter("Flavour") == 0) {
        if (GetParameter("Mode") == 0) {
            // MAJOR
            switch (event.pitch % 12) {
                // I
                case (GetParameter("Root") % 12):
                    buildChord(event, maj_Chord);
                    break;
                    // ii
                case ((GetParameter("Root") + 2) % 12):
                    buildChord(event, min_Chord);
                    break;
                    // iii
                case ((GetParameter("Root") + 4) % 12):
                    buildChord(event, min_Chord);
                    break;
                    // IV
                case ((GetParameter("Root") + 5) % 12):
                    buildChord(event, maj_Chord);
                    break;
                    // V
                case ((GetParameter("Root") + 7) % 12):
                    buildChord(event, maj_Chord);
                    break;
                    // vi
                case ((GetParameter("Root") + 9) % 12):
                    buildChord(event, min_Chord);
                    break;
                    // vii°
                case ((GetParameter("Root") + 11) % 12):
                    buildChord(event, dim_Chord);
                    break;
                    // Default
                default:
                    break;
            }
        }
        else if (GetParameter("Mode") == 1) {
            // MINOR
            switch (event.pitch % 12) {
                // i
                case (GetParameter("Root") % 12):
                    buildChord(event, min_Chord);
                    break;
                    // ii°
                case ((GetParameter("Root") + 2) % 12):
                    buildChord(event, dim_Chord);
                    break;
                    // III
                case ((GetParameter("Root") + 3) % 12):
                    buildChord(event, maj_Chord);
                    break;
                    // iv
                case ((GetParameter("Root") + 5) % 12):
                    buildChord(event, min_Chord);
                    break;
                    // v
                case ((GetParameter("Root") + 7) % 12):
                    buildChord(event, min_Chord);
                    break;
                    // VI
                case ((GetParameter("Root") + 8) % 12):
                    buildChord(event, maj_Chord);
                    break;
                    // VII
                case ((GetParameter("Root") + 10) % 12):
                    buildChord(event, maj_Chord);
                    break;
                    // Default
                default:
                    break;
            }
        }
    }
    if (GetParameter("Flavour") == 1) {
        if (GetParameter("Mode") == 0) {
            // MAJOR
            switch (event.pitch % 12) {
                // I7
                case (GetParameter("Root") % 12):
                    buildChord(event, maj7th_Chord);
                    break;
                    // ii7
                case ((GetParameter("Root") + 2) % 12):
                    buildChord(event, min7th_Chord);
                    break;
                    // iii7
                case ((GetParameter("Root") + 4) % 12):
                    buildChord(event, min7th_Chord);
                    break;
                    // IV7
                case ((GetParameter("Root") + 5) % 12):
                    buildChord(event, maj7th_Chord);
                    break;
                    // V7
                case ((GetParameter("Root") + 7) % 12):
                    buildChord(event, dom7th_Chord);
                    break;
                    // vi7
                case ((GetParameter("Root") + 9) % 12):
                    buildChord(event, min7th_Chord);
                    break;
                    // vii°7
                case ((GetParameter("Root") + 11) % 12):
                    buildChord(event, dim7th_Chord);
                    break;
                    // Default
                default:
                    break;
            }
        } else if (GetParameter("Mode") == 1) {
            // MINOR
            switch (event.pitch % 12) {
                // i7
                case (GetParameter("Root") % 12):
                    buildChord(event, min7th_Chord);
                    break;
                    // ii°7
                case ((GetParameter("Root") + 2) % 12):
                    buildChord(event, dim7th_Chord);
                    break;
                    // III7
                case ((GetParameter("Root") + 3) % 12):
                    buildChord(event, maj7th_Chord);
                    break;
                    // iv7
                case ((GetParameter("Root") + 5) % 12):
                    buildChord(event, min7th_Chord);
                    break;
                    // v7
                case ((GetParameter("Root") + 7) % 12):
                    buildChord(event, min7th_Chord);
                    break;
                    // VI7
                case ((GetParameter("Root") + 8) % 12):
                    buildChord(event, maj7th_Chord);
                    break;
                    // VII7
                case ((GetParameter("Root") + 10) % 12):
                    buildChord(event, dom7th_Chord);
                    break;
                    // Default
                default:
                    break;
            }
        }
    }
}

function buildChord(root, chordtype) {
    if (root instanceof NoteOn) {
        var originalNote = new NoteOn(root);
        var record = {
            originalPitch: root.pitch,
            events: [originalNote]
        };
        root.send();
        for (var i = 0; i < chordtype.length; i++) {
            var harmony = new NoteOn(root);
            harmony.pitch += chordtype[i];
            record.events.push(harmony);
            harmony.send();
        }
        activeNotes.push(record);
    } else if (root instanceof NoteOff) {
        for (var i in activeNotes) {
            if (activeNotes[i].originalPitch == root.pitch) {
                for (var j = 0; j < activeNotes[i].events.length; j++) {
                    var noteOff = new NoteOff(activeNotes[i].events[j]);
                    noteOff.send();
                }
                activeNotes.splice(i, 1);
                break;
            }
        }
    }
}

ResetParameterDefaults = true;

var PluginParameters = [{
    name: "Chords",
    type: "text"
}, {
    name: "Root",
    type: "menu",
    valueStrings: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
    defaultValue: 0,
    minValue: 0,
    maxValue: 11,
    numberOfSteps: 12
}, {
    name: "Mode",
    type: "menu",
    valueStrings: ["Major", "Minor"],
    defaultValue: 0,
    minValue: 0,
    maxValue: 1,
    numberOfSteps: 2
}, {
    name: "Flavour",
    type: "menu",
    valueStrings: ["Normal", "Jazzy"],
    defaultValue: 0,
    minValue: 0,
    maxValue: 1,
    numberOfSteps: 2
}];
