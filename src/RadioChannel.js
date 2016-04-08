var MdcDecoder = require('./MdcDecoder');

module.exports = function(path, context) {
  this.audio_ = new Audio(path);
  this.audio_.crossOrigin = "anonymous";
  this.audio_.autoplay = true;
  // this.control_ = new AudioControl(node);
  // this.id_manager_ = id_manager;
  // this.id_display_ = new IdDisplay(node.querySelector('table.id'), 15);
  this.use_stereo_panner_ = false;

  var chrome_match = window.navigator.appVersion.match(/Chrome/);
  // Using the StereoPannerNode in Chrome appears to be flaky, or possibly
  // just using it with a script processor node. Either way, don't use
  // StereoPannerNode with it.
  if (context.createStereoPanner && !chrome_match) {
    this.use_stereo_panner_ = true;
  }

  // Create audio nodes.
  if (this.use_stereo_panner_) {
    this.panner_ = context.createStereoPanner();
    console.log("Using new StereoPanner");
  } else {
    this.panner_ = context.createPanner();
    console.log("Using fallback panner");
  }
  this.gain_ = context.createGain();

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
      console.log("Processing sample 0: " + input[0]);
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
    source.connect(scriptProcessor);
    source.connect(this.panner_);
    this.panner_.connect(this.gain_);
    this.gain_.connect(context.destination);
  } catch (e) {
    console.log(e);
  }

  // Set callbacks to connect controls to audio, and connect MDC decoder
  // to output.
  /*
  this.control_.setVolumeCallback(function(volume) {
    this.gain_.gain.value = volume;
  }.bind(this));
  */

  /*
  this.control_.setPanCallback(function(pan) {
    if (this.use_stereo_panner_) {
      this.panner_.pan.value = pan;
    } else {
      this.panner_.setPosition(pan, 0, 0);
    }
  }.bind(this));
  */

  /*
  this.decoder_.setCallback(function(data) {
    var display = this.id_manager_.prettyPrint(data);
    if (display !== false) {
      this.id_display_.addId(display);
    }
  }.bind(this));
  */
};
