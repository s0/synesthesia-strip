import {AdafruitDotstarsProxyBackend} from "./backends/adafruit-dotstars-proxy";
import {LEDStripBackend} from "./backends/backends";
import {DemoBackend} from "./backends/demo";
import {StripBehavior} from "./behavior/behavior";

const sockfile = '/tmp/led-socket';
const leds = 60;

const backend: LEDStripBackend = new DemoBackend(leds);
// const backend: LEDStripBackend = new AdafruitDotstarsProxyBackend(leds, sockfile);

const behaviour = new StripBehavior(leds, backend);

backend.connect();
