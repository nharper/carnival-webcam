module.exports = function(path, context) {
  this.audio_ = new Audio(path);
  this.audio_.crossOrigin = "anonymous";
  this.audio_.autoplay = true;

  // Create audio nodes.
  var left_channel = context.createGain();
  var right_channel = context.createGain();

  // Create audio node from audio tag and route all audio nodes together.
  try {
    var source = context.createMediaElementSource(this.audio_);
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
