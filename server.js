var http = require('http')
var midi = require('midi')
var shoe = require('shoe')
var Through = require('through')
var browserify = require('browserify')
var readFileSync = require('fs').readFileSync
var os = require("os")

var Clock = require('./clock')
var Generator = require('./generator')

var instruments = require('./instruments')
var html = readFileSync(__dirname + '/index.html', 'utf8')

// stream output to Ableton Live
var outputPort = new midi.output()
outputPort.openVirtualPort('hackzz')
var output = Through(function(data){
  outputPort.sendMessage(data)
  console.log('send:', data)
})

// midi learning hack
// setTimeout(function(){
//   output.write([144,33,127]);
//   output.write([144,33,0]);
// }, 3000);

// clock from Ableton Live
var clock = Clock()
var clockPort = new midi.input()
clockPort.openVirtualPort('hackzz clock')
clockPort.ignoreTypes(true, false, true) // allow clock signals
clockPort.on('message', function(delta, message){
  clock.write(message)
})

// serve the assets
var server = http.createServer(function(req, res){
  if (req.url == '/bundle.js'){
    res.writeHead(200, {'content-type': 'application/javascript'})
    browserify('./client.js').bundle({debug: true}).pipe(res)
  } else {
    res.writeHead(200, {'content-type': 'text/html'})
    res.end(html)
  }
})

// client connections
Object.keys(instruments).forEach(function(name){
  addInstrument(name, instruments[name])
})

// listen
server.listen(1337)
console.log('Go to any of the following and rock out:')

Object.keys(instruments).forEach(function(name){
  console.log(' - http://' + os.hostname() + ':1337/' + name)
})

////////////////////

function addInstrument(name, instrument){
  var sock = shoe(function (socket) {

    var generator = Generator(instrument, clock)
    console.log('+ ' + name + ' connected')

    socket.pipe(ParseJSON()).pipe(generator).pipe(output)
    socket.write(JSON.stringify({color: '#666'}))

    generator.on('data', function(data){
      if (data[2]){
        socket.write(JSON.stringify({color: '#6F6'}))
      } else {
        socket.write(JSON.stringify({color: '#666'}))
      }
    })

    socket.on('end', function(){
      clearInterval(activeTimer)
      socket.unpipe()
      generator.unpipe()
    })

    var activeTimer = setInterval(function(){
      socket.write(JSON.stringify({active: true}))
    }, 500)
  })


  // LISTEN!
  sock.install(server, '/sockets/' + name);
}

function ParseJSON(){
  return Through(function(data){
    this.queue(JSON.parse(data))
  })
}
