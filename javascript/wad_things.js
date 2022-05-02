// import { Wad } from "../node_modules/web-audio-daw/build/wad.js";

// import { Wad } from "../node_modules/web-audio-daw/build/wad.js";
export const equal_temperament_hz = 440;

// from here: https://en.wikipedia.org/wiki/MIDI_tuning_standard
export var midi_to_frequency = function (note) {
  return Math.pow(2.0, (note - 69.0) / 12) * equal_temperament_hz;
};



var polyWad = new Wad.Poly();
var saw = new Wad({
  source: 'sine',
  panning: [0, 1, 0],
  panningModel: "HRTF",
  loop: 100,
  tuna: {
    // Chorus: {
    //   intensity: 0.3,  //0 to 1
    //   rate: 0.1,         //0.001 to 8
    //   stereoPhase: 0,  //0 to 180
    //   bypass: 0
    // },
    // Convolver: {
    //   highCut: 22050,                         //20 to 22050
    //   lowCut: 20,                             //20 to 22050
    //   dryLevel: 0.1,                            //0 to 1+
    //   wetLevel: 1,                            //0 to 1+
    //   level: 1,                               //0 to 1+, adjusts total output of both wet and dry
    //   impulse: "node_modules/tunajs/impulses/ir_rev_short.wav",    //the path to your impulse response
    //   bypass: 0
    // },
    Delay: {
      feedback: 0.75,    //0 to 1+
      delayTime: 4000,    //1 to 10000 milliseconds
      wetLevel: 1,     //0 to 1+
      dryLevel: 0.5,       //0 to 1+
      cutoff: 20000,      //cutoff frequency of the built in lowpass-filter. 20 to 22050
      bypass: 0
    }
    // Filter: {
    //   frequency: 15000,         //20 to 22050
    //   Q: 11,                   //0.001 to 100
    //   gain: 0,                //-40 to 40 (in decibels)
    //   filterType: "notch",  //lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass
    //   bypass: 0
    // }
  },
});
// saw.play();

