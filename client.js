var shoe = require('shoe')
var through = require('through')

// specify instrument
var socketUrl = '/sockets' + window.location.pathname
// server socket
var ws = shoe(socketUrl)
var lastMessage = null
var output = through(function(data){
  var message = JSON.stringify(data)
  if (message != lastMessage){
    this.queue(message) 
    lastMessage = message
  }
})
output.pipe(ws)

var disconnectTimer = null
ws.on('data', function(data){
  var data = JSON.parse(data)
  if (data.color){
    document.body.style.backgroundColor = data.color
  }

  clearTimeout(disconnectTimer)
  disconnectTimer = setTimeout(disconnected, 1000)
})

function disconnected(){
  document.body.style.backgroundColor = '#C00'
}


var scrollCallback = function(event){

  if (document.body.clientHeight > document.body.clientWidth){
    current.y = event.pageX / document.body.clientHeight
    current.x = event.pageY / document.body.clientWidth
  } else {
    current.y = event.pageY / document.body.clientHeight
    current.x = event.pageX / document.body.clientWidth
  }

  output.write(current)
  event.preventDefault()
};

var startCallback = function(event){
  document.documentElement.style.backgroundColor = '#FFF'
  window.current.active = true
  event.preventDefault()
}

var endCallback = function(event){
  document.documentElement.style.backgroundColor = '#000'
  window.current.active = false
  output.write(window.current)
  event.preventDefault()
};

function prepareDegrees(val) {
  //var ret = 0;
  //if(Math.min(val, -90) < -90){
  //  ret = -90;
  //} else if (Math.max(val, 90) > 90) {
  //  ret = 90;
  //} else {
  //  ret = val;
  //}

  return ((val+360+90) % 360) / 360;
}

// mobile
document.addEventListener('touchstart', startCallback);
document.addEventListener('touchmove', scrollCallback);
document.addEventListener('touchend', endCallback);

// pc
document.addEventListener('mousedown', startCallback);
document.addEventListener('mousemove', scrollCallback);
document.addEventListener('mouseup', endCallback);


window.current = {
  x: 0,
  y: 0,
  z: 0,
  active: false
}
