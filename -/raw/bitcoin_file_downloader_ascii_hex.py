#!/usr/bin/env python3
import sys
import os
import struct
from binascii import crc32,hexlify,unhexlify
import urllib.request

if len(sys.argv) != 2:
    print("""\
Usage: %s https://blockchain.info/tx/6c53cd987119ef797d5adccd76241247988a0a5ef783572a9972e7371c5fb0cc?format=hex
""" % sys.argv[0], file=sys.stderr)
    sys.exit()
data_ascii = urllib.request.urlopen(sys.argv[1]).read()
data = bytes.fromhex(data_ascii.decode('ascii'))
# TODO port by parsing transaction.
#data = b''
#for txout in tx['vout'][0:-2]:
#    for op in txout['scriptPubKey']['asm'].split(' '):
#        if not op.startswith('OP_') and len(op) >= 40:
#            data += unhexlify(op.encode('utf8'))
length = struct.unpack('<L', data[0:4])[0]
checksum = struct.unpack('<L', data[4:8])[0]
data = data[8:8+length]
if checksum != crc32(data):
    print('Checksum mismatch; expected %d but calculated %d' % (checksum, crc32(data)),
          file=sys.stderr)
    sys.exit()
sys.stdout.buffer.write(data)
