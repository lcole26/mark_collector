// import { possible_notes } from "./launchpad_functions";
// import { x_rapidapi_host } from "./rapidapi_things";
import { extractDataFromCurrentBuffer } from "./launchpad_functions.js";
import { x_rapidapi_host, x_rapidapi_key, list_of_keys } from "./rapidapi_things.js";
import { random_in_range } from "./utility.js";
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
export function processAnalysis(data) {
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
      'X-RapidAPI-Host': `${x_rapidapi_host}`,
      'X-RapidAPI-Key': `${x_rapidapi_key}`
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
        handle_analysis(e);
      });
      // return response;
      return result;
    })
    .catch(err => console.error(err));
}
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


var handle_analysis = function (analysis) {
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

    switch (p.prediction) {
      case 'anger':
        // afflicted_data = data_stack.note_stats.map(function(e)) {
        //   return (midi_to_frequency(e.note_pitch) / mapped_prediction_prob);
        // };
        afflicted_data = data_stack.note_stats.map(function (element) {
          mapped_prediction_prob = map_num(p.probability, 0, 1, 0, element.note_pitch);
          return (midi_to_frequency(element.note_pitch) / mapped_prediction_prob);
        });
        break;
      case 'disgust':
        afflicted_data = data_stack.note_stats.map(function (element) {
          mapped_prediction_prob = map_num(p.probability, 0, 1, 0, element.note_pitch);
          return (midi_to_frequency(element.note_pitch) - 5.0);
        });
        break;
      case 'fear':
        afflicted_data = data_stack.note_stats.map(function (element) {
          mapped_prediction_prob = map_num(p.probability, 0, 1, 0, element.note_pitch);
          return midi_to_frequency(element.note_pitch) * random_in_range(mapped_prediction_prob, e.notlemente_pitch);
        });
        break;
      case 'joy':
        afflicted_data = data_stack.note_stats.map(function (element) {
          mapped_prediction_prob = map_num(p.probability, 0, 1, 0, element.note_pitch);
          return midi_to_frequency(element.note_pitch) - 5.0;
        });
        break;
      case 'no-emotion':
        afflicted_data = data_stack.note_stats.map(function (element) {
          mapped_prediction_prob = map_num(p.probability, 0, 1, 0, element.note_pitch);
          return midi_to_frequency(element.note_pitch) - 5.0;
        });
        break;
      case 'sadness':
        afflicted_data = data_stack.note_stats.map(function (element) {
          mapped_prediction_prob = map_num(p.probability, 0, 1, 0, element.note_pitch);
          return midi_to_frequency(element.note_pitch) - 5.0;
        });
        break;
      case 'surprise':
        afflicted_data = data_stack.note_stats.map(function (element) {
          mapped_prediction_prob = map_num(p.probability, 0, 1, 0, element.note_pitch);
          return midi_to_frequency(element.note_pitch) + random_in_range(0, element.note_pitch);
        });
        break;
      default:
        afflicted_data = data_stack.note_stats.map(function (element) {
          mapped_prediction_prob = map_num(p.probability, 0, 1, 0, element.note_pitch);
          return midi_to_frequency(element.note_pitch);
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