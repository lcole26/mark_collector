// im very lazy and I didn't feel like typing out the math,
// so I jacked these clamp / map_num functions from here: https://gist.github.com/xposedbones/75ebaef3c10060a3ee3b246166caab56

export var clamp = function (input, min, max) {
  return input < min ? min : input > max ? max : input;
};

export var map_num = function (current, in_min, in_max, out_min, out_max) {
  const mapped = ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  return clamp(mapped, out_min, out_max);
};

// random_in_range jacked from here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
export var random_in_range = function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
};


export var append_mark = function (prediction, append_marker) {
  let new_prediction = document.createElement('p');
  new_prediction.innerHTML = prediction;
  document.getElementById(append_marker).appendChild(new_prediction);
};
