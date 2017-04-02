var net = require('net')
  , sockfile = '/tmp/led-socket'
  ;

var leds = 60;

var client = net.connect( { path: sockfile });

buffer = new Buffer(leds * 3);

// Zero-Out buffer
for (var i = leds * 3 - 1; i > 0; i--)
  buffer[i] = 1;

var pos = 0;

function sendPattern() {
    buffer[pos*3] = 1;
    buffer[pos*3 + 1] = 1;
    buffer[pos*3 + 2] = 1;
    pos++;
    if (pos >= leds)
      pos = 0;
    buffer[pos*3] = 50;
    buffer[pos*3 + 1] = 20;
    buffer[pos*3 + 2] = 20;
    client.write(buffer, 'binary');
}

function start() {
  setInterval(sendPattern, 10);
}

client
  .on('connect', start)
  .on('data', function (data) {
    console.info('client', 'Data: %s', data.toString());
  })
  .on('error', function (err) {
    console.error('client', err);
  })
  .on('end', function () {
    console.info('client', 'client disconnected');
  })
  ;
