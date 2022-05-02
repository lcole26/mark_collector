// some stuff from here: https://webmidi-examples.glitch.me/ 

// var pad = new Launchpad();

// oh thank the fucking lord someone smarter than me thought of this 
// https://url-decode.com/tool/create-array-js

// import Launchpad from "launchpad-mini/launchpad-mini";
import { default_language, formatData, getAnalysis, currentRequests, tryAnalysisWithKey } from "./api_things.js";
import { paired_note_words, noteOnVelocity, noteOffVelocity, padPressCommand, enterKeyCommand, inputName } from "./main.js";
import { list_of_keys } from "./rapidapi_things.js";
import { map_num, random_in_range } from "./utility.js";
import { midi_to_frequency } from "./wad_things.js";
var currentDataStack = [];
let device;
let current_formatted_data_id = 0;
export var currentAnalysis = null;
let current_pred;

// let mark_collect_manager = {
//   currentWordStack: [],
//   currentMidiDataStack: []
// };



// -------------------------------------------------------------
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
  if (command === enterKeyCommand && input.srcElement.name === inputName && (currentDataStack && !currentDataStack.length == 0)) {
    console.log(`enter key pressed`);
    // clearAll();
    let result = extractDataFromCurrentBuffer(currentDataStack);
    console.log(`text result is: ${result.text}`);

    let formatted_text = formatData(current_formatted_data_id, default_language, result.text);
    result.note_stats.forEach(note_stat => {
      console.log(`note_stat is: ${note_stat.note_pitch} | ${note_stat.keypress_duration}`);
    });
    // let output = "";
    // let analysis = getAnalysis([formatted_text]);
    // let analysis = getAnalysis2([formatted_text]);
    // console.log(`output: ${output}`);
    // if (analysis) {
    //   handle_analysis(analysis);
    // }
    // try analysis from list of burner account keys
    // let analysis = try_analysis([formatted_text]);
    // if (analysis.analysis) {
    //   analysis.forEach(element => {
    //     console.log(`e: ${element}`);
    //   });
    // }
  }

  console.log(`wotofok: ${current_pred}`);
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
    console.log(`current_text is: ${JSON.stringify(currentDataStack)}`);
    currentDataStack.push({ note: keyval.note_pitch, word: keyval.word, keypress_duration: keyval.keypress_duration });
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

var try_analysis = function (formatted_data) {
  let analysis = null;
  let current_api_key = null;
  let index = 0;
  console.log(`number of keys: ${list_of_keys.length}`);
  for (index; index < list_of_keys.length; index++) {
    if (analysis) {
      console.log(`valid key found at : ${current_api_key} at index ${index}`);
      // analysis = try_analysis;
      // break;
      return { index, current_api_key, analysis };
    }
    current_api_key = list_of_keys[index];
    console.log(`index: ${index} | key: ${current_api_key}`);
    // const element = list_of_keys[index];
    // if (index === 1) {
    //   console.log(`valid key found at : ${current_api_key} at index ${index}`);
    //   return { index, current_api_key, analysis };
    // }
    analysis = tryAnalysisWithKey(formatted_data, current_api_key);
  }


  // for (const [index, api_key] of list_of_keys.entries()) {
  //   console.log(`index: ${index} | key: ${api_key}`);
  //   // analysis = tryAnalysisWithKey(formatted_data, api_key);
  //   // if (analysis) {
  //   //   // break;
  //   //   return { index, api_key, analysis };
  //   // }

  //   if (index === 1) {
  //     return { index, api_key, analysis };
  //   }
  // }


  // // would be null/undefined here
  // return analysis;
  return { index, current_api_key, analysis };
};

export var handle_analysis = function (analysis) {
  let id = analysis.id;

  let data_stack = extractDataFromCurrentBuffer();
  // let id = analysis.id;
  let afflicted_data = null;
  let predictions = [];
  let mapped_prediction_prob;
  let rand = random_in_range(0, 127);
  // mapped_prediction_prob = map_num(p.probability, 0, 1, 0, 127);
  analysis.predictions.forEach(p => {
    console.log(`id: ${analysis.id} | prediction: ${p.prediction} | prob: ${p.probability}`);
    mapped_prediction_prob = map_num(p.probability, 0, 1, 0, e.note_pitch);

    switch (p.prediction) {
      case 'anger':
        afflicted_data = data_stack.note_stats.map(e => {
          (midi_to_frequency(e.note_pitch) / mapped_prediction_prob);
        });
        break;
      case 'disgust':
        afflicted_data = data_stack.note_stats.map(e => {
          midi_to_frequency(e.note_pitch) - 5.0;
        });
        break;
      case 'fear':
        afflicted_data = data_stack.note_stats.map(e => {
          midi_to_frequency(e.note_pitch) * random_in_range(mapped_prediction_prob, e.note_pitch);
        });
        break;
      case 'joy':
        afflicted_data = data_stack.note_stats.map(e => {
          midi_to_frequency(e.note_pitch) - 5.0;
        });
        break;
      case 'no-emotion':
        afflicted_data = data_stack.note_stats.map(e => {
          midi_to_frequency(e.note_pitch) - 5.0;
        });
        break;
      case 'sadness':
        afflicted_data = data_stack.note_stats.map(e => {
          midi_to_frequency(e.note_pitch) - 5.0;
        });
        break;
      case 'surprise':
        afflicted_data = data_stack.note_stats.map(e => {
          midi_to_frequency(e.note_pitch) - 5.0;
        });
        break;
      default:
        afflicted_data = data_stack.note_stats.map(e => {
          midi_to_frequency(e.note_pitch);
        });
        break;
    }

    console.log(`afflicted_data: ${afflicted_data}`);

    // predictions.push({ prediction: p.prediction, probability: p.probability });
    // current_pred = { id: analysis.id, prediction: p.prediction, probability: p.probability };
  });

  // return { id, predictions };
  // current_pred = { id, predictions };
};


// -----------------------------------------------------------------------------------------------------------------------------
// utility functions
var extractDataFromCurrentBuffer = function () {
  let wordArray = "";
  let note_statistics_array = [];

  currentDataStack.forEach(element => {
    console.log(`current word pair is ${JSON.stringify(element)}`);
    wordArray += `${element.word} `;
    note_statistics_array.push({ note_pitch: element.note, keypress_duration: element.keypress_duration });
  });

  // console.log(`values are: ${currentText.values()}`);

  // cleart current_text array and return
  currentDataStack.length = 0;

  return { text: wordArray.trim(), note_stats: note_statistics_array };
};

// -----------------------------------------------------------------------------------------------------------------------------
// note detection methods

var key_has_been_pressed = function (found_note) {
  // let found_note = paired_note_words.find(e => e.note_pitch == note);
  found_note.note_on = true;
  found_note.keypress_duration = 0.0;
  found_note.duration_setinterval_id = setInterval(() => {
    console.log(`${found_note.note_pitch}'s current time pressed is ${found_note.keypress_duration} ms at intervalid: ${found_note.duration_setinterval_id}`);
    found_note.keypress_duration += 4;
  }, 2);
};

var key_has_been_depressed = function (found_note) {
  let time_pressed = found_note.keypress_duration;
  // found_note.keypress_duration = 0.0;
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

