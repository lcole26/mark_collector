import { x_rapidapi_host, x_rapidapi_key } from "../javascript/rapidapi_things.js";
import { test_data } from "../javascript/api_things.js";
export var ApiCallValue = function () {
  const settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://ekman-emotion-analysis.p.rapidapi.com/ekman-emotion",
    "method": "POST",
    "headers": {
      "content-type": "application/json",
      "Accept": "application/json",
      "X-RapidAPI-Host": "ekman-emotion-analysis.p.rapidapi.com",
      "X-RapidAPI-Key": "dcc9ce79a6msh1587e0491ee7c19p13b5eejsnde5141957af1"
    },
    "processData": false,
    "data": test_data
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
  });

  const test_data = [
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
};