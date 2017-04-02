import * as net from 'net';
import {LEDStripBackend} from "./backends";

/**
 * An LED Backend controller that connects to a running strip-proxy.py
 * that passes on the new strip display
 */
export class AdafruitDotstarsProxyBackend implements LEDStripBackend {

  private readonly numberOfPixels: number;
  private readonly sockFile: string;
  private buffer: Buffer;
  private socket: net.Socket;

  private readonly readyListeners: (() => void)[] = [];
  private readonly disconnectedListeners: (() => void)[] = [];

  public constructor(numberOfPixels: number, sockFile: string) {
    this.numberOfPixels = numberOfPixels;
    this.sockFile = sockFile;
  }

  public setupBuffer(buffer: Buffer) {
    if (buffer.length !== this.numberOfPixels * 3) {
      throw new Error("Unexpected Buffer Size");
    }
    this.buffer = buffer;
  }


  public addReadyListener(l: () => void): void {
    this.readyListeners.push(l);
  }

  public addDisconnectedListener(l: () => void): void {
    this.disconnectedListeners.push(l);
  }

  public connect() {
    const socket = net.connect(this.sockFile);
    this.socket = socket;
    socket
      .on('connect', () => {
        if (this.socket === socket) {
          this.readyListeners.map(l => l());
        }
      })
      .on('data', (data) => {
        console.info('client', 'Data: %s', data.toString());
      })
      .on('error', (err) => {
        console.error('client', err);
      })
      .on('end', () => {
        if (this.socket === socket) {
          this.disconnectedListeners.map(l => l());
        }
      })
      ;
  }

  public updateStrip() {
    if (!this.buffer) {
      throw new Error("setupBuffer() has not been called");
    }
    this.socket.write(this.buffer, 'binary');
  }
}
