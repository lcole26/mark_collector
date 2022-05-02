// import { possible_notes } from "./launchpad_functions";
// import { x_rapidapi_host } from "./rapidapi_things";
import { x_rapidapi_host, x_rapidapi_key, list_of_keys } from "./rapidapi_things.js";
import { handle_analysis } from "./launchpad_functions.js";
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
export function getAnalysis(data) {
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