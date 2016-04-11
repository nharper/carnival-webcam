var MdcDecoder = require('./MdcDecoder');

module.exports = function(path, context) {
  this.audio_ = new Audio(path);
  this.audio_.crossOrigin = "anonymous";
  this.audio_.autoplay = true;

  // Create audio nodes.
  var left_channel = context.createGain();
  var right_channel = context.createGain();

  // Create MDC decoder.
  this.decoder_ = new MdcDecoder(context.sampleRate);

  // Create simple script processor audio node to copy samples into
  // MDC decoder.
  var scriptProcessor = context.createScriptProcessor(4096, 1, 1);
  var last_input = null;
  scriptProcessor.onaudioprocess = function(audioEvent) {
    try {
      var input = audioEvent.inputBuffer.getChannelData(0);
      this.decoder_.processSamples(input);
      if (input === last_input) {
        console.log('Inputs are equal! We might be stuck in a loop. ' + JSON.stringify(audioEvent));
      }
      last_input = input;
      console.log("Processing sample: " + input[0]);
    } catch (e) {
      console.log(e);
    }
  }.bind(this);

  // temporary debugging stuff
  var log = function(event) {
    console.log(this);
    console.log(event);
  }.bind(this);
  [
    'playing',
    'waiting',
    'seeking',
    'ended',
    'loadedmetadata',
    'loadeddata',
    'canplay',
    'canplaythrough',
    'duration',
    'durationchange',
    'timeupdate',
    'play',
    'pause',
    'ratechange',
    'volumechange',
    'suspend',
    'emptied',
    'stalled',
    'complete'
  ].forEach(function(event) {
    scriptProcessor.addEventListener(event, log);
  });

  // Create audio node from audio tag and route all audio nodes together.
  try {
    var source = context.createMediaElementSource(this.audio_);
    source.connect(scriptProcessor, 0);
    source.connect(left_channel, 0);
    source.connect(right_channel, 0);
    var merger = context.createChannelMerger(2);
    left_channel.connect(merger, 0, 0);
    right_channel.connect(merger, 0, 1);
    merger.connect(context.destination);
  } catch (e) {
    console.log(e);
  }

  // Functions to set gain levels
  this.setLeftGain = function(gain) {
    left_channel.gain.value = gain;
  };

  this.setRightGain = function(gain) {
    right_channel.gain.value = gain;
  };
};
