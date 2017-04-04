import {LEDStripBackend} from "../backends/backends";

export class StripBehavior {

  private readonly numberOfLeds: number;
  private readonly backend: LEDStripBackend;
  private readonly buffer: Buffer;
  private intervalID: NodeJS.Timer;

  constructor(numberOfLeds: number, backend: LEDStripBackend) {
    this.numberOfLeds = numberOfLeds;
    this.backend = backend;
    this.buffer = new Buffer(numberOfLeds * 3);

    // Zero-Out buffer
    for (var i = 0; i < this.buffer.length; i++)
      this.buffer[i] = 20;

    backend.setupBuffer(this.buffer);
    backend.addReadyListener(this.connected.bind(this));
    backend.addDisconnectedListener(this.disconnected.bind(this));
  }

  private connected() {
    this.startPattern();
  }

  private disconnected() {
    clearInterval(this.intervalID);
  }

  private startPattern() {
    let pos = 0;
    const sendPattern = () => {
        this.buffer[pos*3] = 20;
        this.buffer[pos*3 + 1] = 20;
        this.buffer[pos*3 + 2] = 20;
        pos++;
        if (pos >= this.numberOfLeds)
          pos = 0;
        this.buffer[pos*3] = 250;
        this.buffer[pos*3 + 1] = 120;
        this.buffer[pos*3 + 2] = 120;
        this.backend.updateStrip();
    }
    this.intervalID = setInterval(sendPattern, 10);
  }

}
