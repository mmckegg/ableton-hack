var http = require('http')
var MidiPort = require('midi-stream')
var midi = require('midi')

var shoe = require('shoe')

var Through = require('through')

var browserify = require('browserify')

var outputPort = new midi.output()
outputPort.openVirtualPort('hackzz')

var server = http.createServer(function(req, res){
  if (req.url == '/bundle.js'){
    res.writeHead(200, {'content-type': 'application/javascript'})
    browserify('./client.js').bundle({debug: true}).pipe(res)
  } else {
    res.writeHead(200, {'content-type': 'text/html'})
    res.end('<body><script src="/bundle.js"></script></body>')
  }
})


var sock = shoe(function (stream) {
  var input = Through(function(data){
    this.queue(JSON.parse(data))
  })
  stream.pipe(input)
  
  input.on('data', function(data){
    outputPort.sendMessage(data)
    console.log(data)
  })
})

sock.install(server, '/anarchy');

server.listen(1337)
