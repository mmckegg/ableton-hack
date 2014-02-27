module.exports = function midiFormatter(data, instrument){
  return [instrument.channel, data.noteNumber, 127];
};

