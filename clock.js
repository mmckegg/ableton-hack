var through = require('through')

module.exports = function Clock(){
  var position = 0
  var stream = through(function(data){
    if (data[0] === 248){
      this.queue(position++)
    }
  })

  stream.ppq = 96

  return stream
}