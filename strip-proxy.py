#!/usr/bin/python

import os
import socket
import struct
import sys
import time
from dotstar import Adafruit_DotStar

numpixels = 60 # Number of LEDs in strip
datapin   = 17
clockpin  = 18
strip     = Adafruit_DotStar(numpixels, datapin, clockpin)

strip.begin()           # Initialize pins for output
#strip.setBrightness(25)

SOCKET_ADDRESS = '/tmp/led-socket'

sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)

# Make sure the socket does not already exist
try:
    os.unlink(SOCKET_ADDRESS)
except OSError:
    if os.path.exists(server_address):
        raise

sock.bind(SOCKET_ADDRESS)
os.chmod(SOCKET_ADDRESS, 666)
sock.listen(5)

BYTES_REQUIRED = numpixels * 3;

def setStripColours(string):
    for i in xrange(0, numpixels):
        r, g, b = ord(string[i*3]), ord(string[i*3+1]), ord(string[i*3+2])
        c = (r << 16) + (g << 8) + b
        strip.setPixelColor(i, c)
    strip.show() # Refresh strip

while True:
    # Wait for a connection
    print >>sys.stderr, 'waiting for a connection'
    connection, client_address = sock.accept()
    try:
        print >>sys.stderr, 'connection from', client_address
        active = True
        # Receive the data in chunks for the full strip
        while active:
            currentStrip = ''
            while len(currentStrip) < BYTES_REQUIRED:
                data = connection.recv(BYTES_REQUIRED - len(currentStrip))
                if not data:
                    connection.close()
                    active = False
                    break
                currentStrip += data
            if len(currentStrip) > BYTES_REQUIRED:
                print >>sys.stderr, 'unexpected data'
                connection.close()
                active = False
                break
            if active :
                setStripColours(currentStrip)
                currentStrip = ''
    finally:
        # Clean up the connection
        connection.close()
