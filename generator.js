var through = require('through')

module.exports = function Generator(instrument, clock){

  var pendingOff = null
  var currentNote = null
  var repeatLength = null

  var stream = through(function(data){
    if (data.active){
      var noteId = getNote(data.x, instrument)
      var grid = getGrid(data.frontBack, instrument)

      if (noteId != null){
        currentNote = [instrument.channel, noteId, 127];
      }

      repeatLength = clock.ppq * grid
    } else {
      currentNote = null
      repeatLength = null
    }
  })

  clock.on('data', function(tick){
    if (repeatLength && currentNote){
      var pos = tick % repeatLength

      if (pendingOff && (!pos || pos >= Math.round(repeatLength / 2))){
        stream.queue(pendingOff)
        pendingOff = null
      }

      if (pos === 0){
        stream.queue(currentNote)
        pendingOff = [currentNote[0], currentNote[1], 0]
      } 
    } else if (pendingOff) {
      stream.queue(pendingOff)
      pendingOff = null
    }
  })

  return stream

}

function getNote(data, instrument){
  if (instrument.notes){
    var index = Math.round(instrument.notes.length * data)
    return instrument.notes[index]
  }
}

function getGrid(data, instrument){
  if (instrument.grids){
    var index = Math.round(instrument.grids.length * data)
    return instrument.grids[index]
  }
}