import { mark_collect_manager } from "./launchpad_functions.js";
import { random_in_range } from "./utility.js";
const min_pan_range = -1;
const max_pan_range = 1;
export const equal_temperament_hz = 440;

// from here: https://en.wikipedia.org/wiki/MIDI_tuning_standard
export var midi_to_frequency = function (note) {
  return Math.pow(2.0, (note - 69.0) / 12) * equal_temperament_hz;
};

export var constructNewOscillatorData = function (text_and_midi, afflicted_data, volume) {
  var chain_osc = new Wad.Poly({
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
    recorder: {
      options: { mimeType: 'audio/webm' },
      onstop: function (event) {
        let blob = new Blob(this.recorder.chunks, { 'type': 'audio/webm;codecs=opus' });
        window.open(URL.createObjectURL(blob));
      }
    }
  });

  // collects new oscs created from midi frequency data
  let osc_array = [];
  afflicted_data.forEach((frequency, index) => {
    let new_osc = new Wad({
      source: 'sine',
      pitch: frequency,
      volume: volume,
      env: {
        hold: 7,
        hold: text_and_midi.note_stats[index].keypress_duration / 1000.0,
        // sustain: .2,
      },
      loop: true,
      panning: [random_in_range(min_pan_range, max_pan_range), random_in_range(min_pan_range, max_pan_range), random_in_range(min_pan_range, max_pan_range)],
      panningModel: 'HRTF',
      rolloffFactor: 1 // other properties of the panner node can be specified in the constructor, or on play()

    });

    osc_array.push(new_osc);
    chain_osc.add(new_osc);
  });

  let iterator = new Wad.SoundIterator({
    files: osc_array,
    random: true,
    randomPlaysBeforeRepeat: 0,
  });

  // mark_collect_manager.osc_collector.forEach(frequency => {
  //   // chain_osc.play();
  //   iterator.play();
  // });

  mark_collect_manager.osc_collector.push({ text_and_midi: text_and_midi, osc: chain_osc });
  mark_collect_manager.osc_collector.push({ text_and_midi: text_and_midi, osc: iterator });
  // mark_collect_manager.osc_collector[0].osc.play();
  // PlayOscAtIndex(1);

  // console.log(`current osc_collector length: ${osc_collector.length}`);
  return { chain: chain_osc, iterator: iterator };

};

export var PlayOscAtIndex = function (index) {
  if (index >= 0 && index < mark_collect_manager.osc_collector.length) {
    console.log(`@index: ${index}: ${Object.keys(mark_collect_manager[index])}`);
    mark_collect_manager.osc_collector[index].osc.play();
  }
};

