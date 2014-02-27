var shoe = require('shoe')
var through = require('through')

var ws = shoe('/anarchy')
var output = through(function(data){
  this.queue(JSON.stringify(data)) 
})

output.pipe(ws)

setInterval(function(){
  output.write(current)
}, (1000/60))

var scrollCallback = function(event){
  current.y = event.pageY/outerHeight
  current.z = event.pageX/outerWidth
};

var tiltCallback = function(event){
  window.leftRight = prepareDegrees(event.gamma);
  window.frontBack = prepareDegrees(event.beta);
};

function prepareDegrees(val) {
  var ret = 0;
  if(Math.min(val, -90) < -90){
    ret = -90;
  } else if (Math.max(val, 90) > 90) {
    ret = 90;
  } else {
    ret = val;
  }

  return (ret + 90)/360;
}

document.addEventListener('touchmove', scrollCallback);

window.addEventListener('deviceorientation', tiltCallback);

window.current = {
  x: 0,
  y: 0,
  leftRight: 0,
  frontBack: 0
}
