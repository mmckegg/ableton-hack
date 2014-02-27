var http = require('http')
var midi = require('midi')

var shoe = require('shoe')

var Through = require('through')

var browserify = require('browserify')
var readFileSync = require('fs').readFileSync

var Clock = require('./clock')

var html = readFileSync(__dirname + '/index.html', 'utf8')

var outputPort = new midi.output()
outputPort.openVirtualPort('hackzz')

// clock from Ableton Live
var clock = Clock()
var clockPort = new midi.input()
clockPort.openVirtualPort('hackzz clock')
clockPort.ignoreTypes(true, false, true) // allow clock signals
clockPort.on('message', function(delta, message){
  clock.write(message)
})

var server = http.createServer(function(req, res){
  if (req.url == '/bundle.js'){
    res.writeHead(200, {'content-type': 'application/javascript'})
    browserify('./client.js').bundle({debug: true}).pipe(res)
  } else {
    res.writeHead(200, {'content-type': 'text/html'})
    res.end(html)
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
