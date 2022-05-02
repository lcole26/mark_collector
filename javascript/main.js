import { connectController, handleInput, currentAnalysis } from "./launchpad_functions.js";
// import { clamp, map_num } from "./utility.js";
// import { x_rapidapi_host, x_rapidapi_key, list_of_keys } from "./rapidapi_things.js";
export const lowestNote = 36;
export const highestNote = 99;

export const lowestProgrammerModeNote = 11;
export const highestProgrammerModeNote = 88;
export const nextRowDifferential = 3;
export const nextRowOffsetAmount = 10;

export const noteOnVelocity = 127;
export const noteOffVelocity = 0;
export const padPressCommand = 144;
export const enterKeyCommand = 176;
export const inputName = `LPMiniMK3 MIDI`;

const midiIndexesInProgrammerMode = [];

// fill in indexes for programmer mode on launchpad
// note: in programmer mode, the bottommost grid pad starts at midi note 11, and ends at 88. 

for (let index = lowestProgrammerModeNote, currentRow = index + nextRowOffsetAmount; index <= highestProgrammerModeNote; index++) {
  // const element = lol[index];
  console.log(`index: ${index} | currentRow: ${currentRow}`);
  midiIndexesInProgrammerMode.push(index);
  if (currentRow - index == nextRowDifferential) {
    console.log(`next row at: index: ${index} | currentRow: ${currentRow}`);
    index += nextRowDifferential - 1;
    currentRow += 10;
  }
}

// console.log(`lol is: ${midiIndexesInProgrammerMode}`);

const possible_notes = [...Array(highestNote - lowestNote + 1).keys()].map(x => x + lowestNote);
const launchpad_words = [
  'Amount',
  'Argument',
  'Art',
  'Be',
  'Beautiful',
  'Belief',
  'Cause',
  'Certain',
  'Chance',
  'Change',
  'Clear',
  'Common',
  'Comparison',
  'Condition',
  'Connection',
  'Copy',
  'Decision',
  'Degree',
  'Desire',
  'Development',
  'Different',
  'Do',
  'Education',
  'End',
  'Event',
  'Examples',
  'Existence',
  'Experience',
  'Fact',
  'Fear',
  'Feeling',
  'Fiction',
  'Force',
  'Form',
  'Free',
  'General',
  'Get',
  'Give',
  'Good',
  'Government',
  'Happy',
  'Have',
  'History',
  'Idea',
  'Important',
  'Interest',
  'Knowledge',
  'Law',
  'Let',
  'Level',
  'Living',
  'Love',
  'Make',
  'Material',
  'Measure',
  'Mind',
  'Motion',
  'Name',
  'Nation',
  'Natural',
  'Necessary',
  'Normal',
  'Number',
  'Observation',
];

var pairNotesAndWords = function constructWordNoteValuePairArray(notes, words) {
  var newArr = [];
  if (notes.length === words.length) {
    for (let index = 0; index < notes.length; index++) {
      const note = notes[index];
      const word = words[index];
      newArr.push({ note_pitch: note, word: word, note_on: false, keypress_duration: 0.0, duration_setinterval_id: null });
    }
  }

  return newArr;
};

var wordNotePairList = possible_notes.map(function (obj, index) {
  var newObjList = {};
  newObjList[launchpad_words[index]] = obj;
  return newObjList;
});

export var paired_note_words = pairNotesAndWords(possible_notes, launchpad_words);
// export var paired_note_words = pairNotesAndWords(midiIndexesInProgrammerMode, launchpad_words);

// ---------------------------------------
console.log("notes: \n" +
  possible_notes
);

console.log("words: \n" +
  launchpad_words
);

console.log("c: \n"
);
paired_note_words.forEach(element => {
  console.log(element);
});


// code
connectController();
