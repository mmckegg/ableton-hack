var shoe = require('shoe')
var through = require('through')

var ws = shoe('/anarchy')
var output = through(function(data){
  this.queue(JSON.stringify(data)) 
})

output.pipe(ws)

setInterval(function(){
  output.write([144, 60, 127])
  setTimeout(function(){
    output.write([144, 60, 0])
  }, 100)
}, 2000)