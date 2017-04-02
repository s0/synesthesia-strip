import {AdafruitDotstarsProxyBackend} from "./backends/adafruit-dotstars-proxy";
import {LEDStripBackend} from "./backends/backends";

const sockfile = '/tmp/led-socket';
const leds = 60;

const buffer = new Buffer(leds * 3);
const backend: LEDStripBackend = new AdafruitDotstarsProxyBackend(leds, sockfile);
backend.setupBuffer(buffer);


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
    backend.updateStrip();
}

function start() {
  setInterval(sendPattern, 10);
}

backend.addReadyListener(start);

backend.connect();
