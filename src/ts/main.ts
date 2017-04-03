import {AdafruitDotstarsProxyBackend} from "./backends/adafruit-dotstars-proxy";
import {LEDStripBackend} from "./backends/backends";
import {DemoBackend} from "./backends/demo";

const sockfile = '/tmp/led-socket';
const leds = 60;

const buffer = new Buffer(leds * 3);
const backend: LEDStripBackend = new DemoBackend(leds);
// const backend: LEDStripBackend = new AdafruitDotstarsProxyBackend(leds, sockfile);
backend.setupBuffer(buffer);


// Zero-Out buffer
for (var i = leds * 3 - 1; i > 0; i--)
  buffer[i] = 20;

var pos = 0;

function sendPattern() {
    buffer[pos*3] = 20;
    buffer[pos*3 + 1] = 20;
    buffer[pos*3 + 2] = 20;
    pos++;
    if (pos >= leds)
      pos = 0;
    buffer[pos*3] = 250;
    buffer[pos*3 + 1] = 120;
    buffer[pos*3 + 2] = 120;
    backend.updateStrip();
}

function start() {
  setInterval(sendPattern, 10);
}

backend.addReadyListener(start);

backend.connect();
