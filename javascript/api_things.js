// import { possible_notes } from "./launchpad_functions";
// import { x_rapidapi_host } from "./rapidapi_things";
import { extractDataFromCurrentBuffer } from "./launchpad_functions.js";
import { text_append_marker_name } from "./main.js";
import { x_rapidapi_host, x_rapidapi_key, list_of_keys, deploy_key } from "./rapidapi_things.js";
import { append_mark, clamp, map_num, random_in_range } from "./utility.js";
import { constructNewOscillatorData, midi_to_frequency } from "./wad_things.js";
// import { handle_analysis } from "./launchpad_functions.js";
export const emotion_type_list = ['anger', 'disgust', 'fear', 'joy', 'no-emotion', 'sadness', 'surprise'];
export const default_language = "en";

export var currentRequests = [];
export var formatData = function formatDataInstance(id, language, text) {
  return {
    "id": id,
    "language": language,
    "text": text,
  };
  // currentRequests.push({
  //   "id": id,
  //   "language": language,
  //   "text": text,
  // });
};

function constructAnalysisArray(texts) {
  let index = 1;
  let currentText;
  let newArr;
  texts.forEach(text => {
    currentText = formatData(index, default_language, text);
    newArr.push(currentText);
    index++;
  });

  return newArr;
}


// functions below 
/**
 * takes in a 
 * @param {*} data 
 */
export function processAnalysis(text_and_midi, data) {
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
      'X-RapidAPI-Host': `${x_rapidapi_host}`,
      'X-RapidAPI-Key': `${deploy_key}`
    },
    // body: '[{"id":"1","language":"en","text":"I love the service"}]'
    // body: JSON.stringify(test_data)
    body: JSON.stringify(data)
  };

  let result = [];

  fetch('https://ekman-emotion-analysis.p.rapidapi.com/ekman-emotion', options)
    .then(response => response.json())
    .then(response => {
      console.log(response);
      response.forEach(e => {
        // result.push(e);
        // console.log(`id: ${e}`);
        handle_analysis(text_and_midi, e);
      });
      // return response;
      return result;
    })
    .catch(err => console.error(err));
}

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
    // console.log(`index: ${index} | key: ${current_api_key}`);
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
// functions below 
/**
 * tries to run an API request through the Ekman Emotion Analysis, given a specific api_key to try
 * @param {*} data 
 * @param {*} api_key 
 */
export function tryAnalysisWithKey(data, api_key) {
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
      'X-RapidAPI-Host': `${x_rapidapi_host}`,
      'X-RapidAPI-Key': `${api_key}`
    },
    // body: '[{"id":"1","language":"en","text":"I love the service"}]'
    // body: JSON.stringify(test_data)
    body: JSON.stringify(data)
  };

  fetch('https://ekman-emotion-analysis.p.rapidapi.com/ekman-emotion', options)
    .then(response => response.json())
    .then(response => {
      console.log(response);
      response.forEach(elem => {
        console.log(`elem: ${elem}`);
      });
      return response;
    })
    .catch(err => console.error(err));
}


var handle_analysis = function (text_and_midi, analysis) {
  let id = analysis.id;

  // let text_and_midi = extractDataFromCurrentBuffer();
  // let id = analysis.id;
  let afflicted_data = null;
  let word_to_frequency_outputs = [];
  let mapped_prediction_prob;
  let rand = random_in_range(0, 127);

  let default_random_pitch = text_and_midi.note_stats.map(function (element) {
    // mapped_prediction_prob = map_num(p.probability, 0, 1, 0, element.note_pitch);
    return (midi_to_frequency(element.note_pitch) / 1.0);
  });
  // mapped_prediction_prob = map_num(p.probability, 0, 1, 0, 127);
  analysis.predictions.forEach(p => {
    console.log(`id: ${analysis.id} | prediction: ${p.prediction} | prob: ${p.probability}`);

    switch (p.prediction) {
      case 'anger':
        afflicted_data = text_and_midi.note_stats.map(function (element, index) {
          mapped_prediction_prob = map_num(p.probability, 0, 1, 0, element.note_pitch);
          let clamped = clamp((midi_to_frequency(element.note_pitch) / mapped_prediction_prob), 0, 22500);
          word_to_frequency_outputs.push(clamped);
          // return isNaN(clamped) ? mapped_prediction_prob : clamped;
          return isNaN(clamped) ? default_random_pitch[index] : clamped;
        });
        break;
      case 'disgust':
        afflicted_data = text_and_midi.note_stats.map(function (element, index) {
          mapped_prediction_prob = map_num(p.probability, 0, 1, 0, element.note_pitch);
          let clamped = clamp((midi_to_frequency(element.note_pitch) - 5.0), 0, 22500);
          word_to_frequency_outputs.push(clamped);
          // return isNaN(clamped) ? mapped_prediction_prob : clamped;
          return isNaN(clamped) ? default_random_pitch[index] : clamped;
        });
        break;
      case 'fear':
        afflicted_data = text_and_midi.note_stats.map(function (element, index) {
          mapped_prediction_prob = map_num(p.probability, 0, 1, 0, element.note_pitch);
          let clamped = clamp(midi_to_frequency(element.note_pitch) * random_in_range(mapped_prediction_prob, element.notlemente_pitch), 0, 22500);
          word_to_frequency_outputs.push(clamped);
          // return isNaN(clamped) ? mapped_prediction_prob : clamped;
          return isNaN(clamped) ? default_random_pitch[index] : clamped;
        });
        break;
      case 'joy':
        afflicted_data = text_and_midi.note_stats.map(function (element, index) {
          mapped_prediction_prob = map_num(p.probability, 0, 1, 0, element.note_pitch);
          let clamped = clamp((midi_to_frequency(element.note_pitch) + element.note_pitch), 0, 22500);
          word_to_frequency_outputs.push(clamped);
          // return isNaN(clamped) ? mapped_prediction_prob : clamped;
          return isNaN(clamped) ? default_random_pitch[index] : clamped;
        });
        break;
      case 'no-emotion':
        afflicted_data = text_and_midi.note_stats.map(function (element, index) {
          mapped_prediction_prob = map_num(p.probability, 0, 1, 0, element.note_pitch);
          let clamped = clamp((midi_to_frequency(element.note_pitch)), 0, 22500);
          word_to_frequency_outputs.push(clamped);
          // return isNaN(clamped) ? mapped_prediction_prob : clamped;
          return isNaN(clamped) ? default_random_pitch[index] : clamped;
        });
        break;
      case 'sadness':
        afflicted_data = text_and_midi.note_stats.map(function (element, index) {
          mapped_prediction_prob = map_num(p.probability, 0, 1, 0, element.note_pitch);
          let clamped = clamp((midi_to_frequency(element.note_pitch) - element.note_pitch), 0, 22500);
          word_to_frequency_outputs.push(clamped);
          // return isNaN(clamped) ? mapped_prediction_prob : clamped;
          return isNaN(clamped) ? default_random_pitch[index] : clamped;
        });
        break;
      case 'surprise':
        afflicted_data = text_and_midi.note_stats.map(function (element, index) {
          mapped_prediction_prob = map_num(p.probability, 0, 1, 0, element.note_pitch);
          let clamped = clamp((midi_to_frequency(element.note_pitch) + random_in_range(0, element.note_pitch), 0, 22500));
          word_to_frequency_outputs.push(clamped);
          // return isNaN(clamped) ? mapped_prediction_prob : clamped;
          return isNaN(clamped) ? default_random_pitch[index] : clamped;
        });
        break;
      default:
        afflicted_data = text_and_midi.note_stats.map(function (element, index) {
          mapped_prediction_prob = map_num(p.probability, 0, 1, 0, element.note_pitch);
          let clamped = clamp((midi_to_frequency(element.note_pitch), 0, 22500));
          word_to_frequency_outputs.push(clamped);
          // return isNaN(clamped) ? mapped_prediction_prob : clamped;
          return isNaN(clamped) ? default_random_pitch[index] : clamped;
        });
        break;
    }

    console.log(`afflicted_data: ${afflicted_data}`);

    let newOsc = constructNewOscillatorData(text_and_midi, afflicted_data, 0.3);
    // newOsc.chain.play();
    newOsc.iterator.play();

    word_to_frequency_outputs.push({ prediction: p.prediction, probability: p.probability });
    // current_pred = { id: analysis.id, prediction: p.prediction, probability: p.probability };

    // document.getElementById('mark').innerHTML += `\n${p.prediction}\n`;
    append_mark(p.prediction, text_append_marker_name);
  });//end of prediction handling;
};



// ----------------
export const test_data = [
  {
    "id": "1",
    "language": "en",
    "text": "I love the service"
  },
  {
    "id": "2",
    "language": "en",
    "text": "my boyfriend came back from the war"
  }
];