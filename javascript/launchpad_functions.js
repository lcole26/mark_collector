// some stuff from here: https://webmidi-examples.glitch.me/ 

// var pad = new Launchpad();

// oh thank the fucking lord someone smarter than me thought of this 
// https://url-decode.com/tool/create-array-js

// import Launchpad from "launchpad-mini/launchpad-mini";
import { default_language, formatData, processAnalysis, currentRequests, tryAnalysisWithKey, emotion_type_list } from "./api_things.js";
import { paired_note_words, noteOnVelocity, noteOffVelocity, padPressCommand, enterKeyCommand, inputName } from "./main.js";
import { list_of_keys } from "./rapidapi_things.js";
import { map_num, random_in_range } from "./utility.js";
import { constructNewOscillatorData, midi_to_frequency, PlayOscAtIndex } from "./wad_things.js";

// var currentDataStack = [];
// export var osc_collector = [];
let device;
let current_formatted_data_id = 0;
export var currentAnalysis = null;
let current_pred;

export var mark_collect_manager = {
  current_data_stack: [],
  osc_collector: []
};



// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// controller connection handling/bootstrapping
export function connectController() {
  navigator.requestMIDIAccess().then(success, failure);
}


var success = function (midi_access) {
  midi_access.addEventListener('statechange', updateDevices);
  const inputs = midi_access.inputs;
  const outputs = midi_access.outputs;
  console.log(inputs);

  outputs.forEach(output => {
    device = output;
    console.log(`output lmao: ${device}`);
  });

  inputs.forEach(input => {
    // handleInput(input);
    console.log(`name of this input is:`);

    console.log(`input name: ${input.name}`);
    console.log(input);
    if (input.name === inputName) {
      input.addEventListener('midimessage', handleInput);
    }
  });
};

function failure() {
  console.log('could not connect MIDI');
}

function updateDevices(event) {
  console.log(event);
}

export function handleInput(input) {
  const command = input.data[0];
  const note = input.data[1];
  const velocity = (input.data.length > 2) ? input.data[2] : 1;
  const timestamp = Date.now();

  console.log(`input: ${input.srcElement.name}| command: ${command} | note: ${note} | velocity: ${velocity}`);

  // get word assictaed with this pitch
  let keyval = note_to_word(note);

  /**
   * detech "enterKey" command, and check:
   *  - the command itself to make sure it is whatever button we declare are out enter/send key,
   *  - the actual input we want to check against, to make sure we aren't double sending API requests/multi-sending requests,
   *  - whether this array is indeed an array (nullcheck), and also check length > 0
   */
  // if (command === enterKeyCommand && input.srcElement.name === inputName && (currentDataStack && !currentDataStack.length == 0)) {
  if (command === enterKeyCommand && input.srcElement.name === inputName && (mark_collect_manager.current_data_stack && !mark_collect_manager.current_data_stack.length == 0)) {
    console.log(`enter key pressed`);
    let enterKeyPairedEntry = paired_note_words.find(e => {
      e.note_pitch === command;
    });

    // if (enterKeyPairedEntry) {

    // }

    // // get manager data stack as 
    let result = extractDataFromCurrentBuffer(mark_collect_manager.current_data_stack);
    console.log(`text result is: ${result.text}`);

    let formatted_text = formatData(current_formatted_data_id, default_language, result.text);
    result.note_stats.forEach(note_stat => {
      console.log(`note_stat is: ${result.text} | ${note_stat.note_pitch} | ${note_stat.keypress_duration}`);
    });
    let analysis = processAnalysis(result, [formatted_text], 0.3);

    // console.log(`miditofreq of 57: ${midi_to_frequency(57)}`);
    // let afflicted_data = result.note_stats.map(function (element) {
    //   // mapped_prediction_prob = map_num(p.probability, 0, 1, 0, element.note_pitch);
    //   return (midi_to_frequency(element.note_pitch) / 1.0);
    // });
    // console.log(`afflicted data in handleInput: ${afflicted_data}`);

    // let newOsc = constructNewOscillatorData(result, afflicted_data, 0.1);
    // newOsc.iterator.play();

  }

  // check if pad has been pressed
  if (keyval && command === padPressCommand && velocity === noteOnVelocity && input.srcElement.name === inputName) {
    console.log(`word is: ${keyval.note_pitch} ${keyval.word} with note: ${velocity === noteOnVelocity ? "On" : "Off"}`);
    // colorKeys(note, 63);
    let found_note = paired_note_words.find(e => e.note_pitch == note);
    if (found_note && found_note.note_on === false && found_note.duration_setinterval_id === null) {
      key_has_been_pressed(found_note);
      console.log(`note ${note} is currently pressed`);
    }
  }

  // check if pad has been released
  if (keyval && command === padPressCommand && velocity === noteOffVelocity && input.srcElement.name === inputName) {
    console.log(`current_text is: ${JSON.stringify(mark_collect_manager.current_data_stack)}`);
    mark_collect_manager.current_data_stack.push({ note: keyval.note_pitch, word: keyval.word, keypress_duration: keyval.keypress_duration });
    let found_note = paired_note_words.find(e => e.note_pitch == note);
    if (found_note && found_note.note_on === true && found_note.duration_setinterval_id !== null) {
      // found_note.note_on = false;
      let time_pressed = key_has_been_depressed(found_note);
    }
  }
}

/**
 * searches the note/word pair array and return a given pairing
 * @param {int representation of a midi note from a given Launchpad Mini pad being pressed} note 
 * @returns 
 */
var note_to_word = function (note) {
  return paired_note_words.find(x => x.note_pitch === note);
  // return keyval;
};


// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// utility functions
export var extractDataFromCurrentBuffer = function () {
  let wordArray = "";
  let note_statistics_array = [];

  mark_collect_manager.current_data_stack.forEach(element => {
    console.log(`current word pair is ${JSON.stringify(element)}`);
    wordArray += `${element.word} `;
    note_statistics_array.push({ note_pitch: element.note, keypress_duration: element.keypress_duration });
  });


  // cleart current_text array and return
  mark_collect_manager.current_data_stack.length = 0;

  return { text: wordArray.trim(), note_stats: note_statistics_array };
};

var return_emotion_type = function (emotion) {
  return emotion_type_list.find(e => e === emotion);
};





// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
// note detection methods

var key_has_been_pressed = function (found_note) {
  found_note.note_on = true;
  found_note.keypress_duration = 0.0;
  found_note.duration_setinterval_id = setInterval(() => {
    console.log(`${found_note.note_pitch}'s current time pressed is ${found_note.keypress_duration} ms at interval id: ${found_note.duration_setinterval_id}`);
    found_note.keypress_duration += 4;
  }, 2);
};

var key_has_been_depressed = function (found_note) {
  let time_pressed = found_note.keypress_duration;
  found_note.note_on = false;
  clearInterval(found_note.duration_setinterval_id);
  found_note.duration_setinterval_id = null;
  console.log(`note ${found_note.note_pitch} has been released. pressed for ${time_pressed} ms.`);
  // console.log(`note ${found_note.note_pitch}'s keypress_duration is now: ${found_note.keypress_duration}`);
  return time_pressed;
};

var get_current_keypress_duration = function (found_note) {
  return found_note.keypress_duration;
};



