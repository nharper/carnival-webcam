/*
 * This file is a port of Matthew Kaufman's MDC Decoder library into
 * javascript. The original header follows below.
 */
/*-
 * Author: Matthew Kaufman (matthew@eeph.com)
 *
 * Copyright (c) 2005, 2010  Matthew Kaufman  All rights reserved.
 *
 *  This file is part of Matthew Kaufman's MDC Encoder/Decoder Library
 *
 *  The MDC Encoder/Decoder Library is free software; you can
 *  redistribute it and/or modify it under the terms of version 2 of
 *  the GNU General Public License as published by the Free Software
 *  Foundation.
 *
 *  If you cannot comply with the terms of this license, contact
 *  the author for alternative license arrangements or do not use
 *  or redistribute this software.
 *
 *  The MDC Encoder/Decoder Library is distributed in the hope
 *  that it will be useful, but WITHOUT ANY WARRANTY; without even the
 *  implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 *  PURPOSE.  See the GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this software; if not, write to the Free Software
 *  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301
 *  USA.
 *
 *  or see http://www.gnu.org/copyleft/gpl.html
 *
-*/

module.exports = function(sampleRate) {
  var MDC_ND = 5;
  var MDC_GDTHRESH = 5;

  sampleRate = sampleRate|0;
  if (sampleRate == 8000) {
    this.incru = 644245094|0;
  } else if (sampleRate == 16000) {
    this.incru = 322122547|0;
  } else if (sampleRate == 32000) {
    this.incru = 233739716|0;
  } else if (sampleRate == 44100) {
    this.incru = 116869858|0;
  } else if (sampleRate == 48000) {
    this.incru = 107374182;
  } else {
    this.incru = (1200 * 2 * (0x80000000 / sampleRate))|0;
  }

  this.good = 0;
  this.indouble = false;
  this.du = new Array(MDC_ND);
  for (var i = 0; i < MDC_ND; i++) {
    this.du[i] = {};
    this.du[i].thu = (i * 2 * (0x80000000 / MDC_ND))|0;
    this.du[i].xorb = false;
    this.du[i].invert = false;
    this.du[i].shstate = -1|0;
    this.du[i].nlstep = i|0;
    this.du[i].nlevel = new Float32Array(10);
    /*
    this.du[i].synclow = 0;
    this.du[i].synchigh = 0;
    this.du[i].shcount = 0;
    */
    this.du[i].bits = new Array(112);
  }

  var _flip = function(crc, bitnum) {
    var j = 1;
    var crcout = 0;
    for (var i = 1 << (bitnum - 1); i; i >>= 1) {
      if (crc & i) {
        crcout |= j;
      }
      j <<= 1;
    }
    return crcout;
  };

  var _docrc = function(data, len) {
    var p = 0;
    var crc = 0|0;
    for (var i = 0; i < len; ++i) {
      var c = data[p++];
      c = _flip(c, 8);
      for (var j = 0x80; j; j>>= 1) {
        var bit = crc & 0x8000;
        crc <<= 1;
        crc &= 0xffff;
        if (c & j) {
          bit ^= 0x8000;
        }
        if (bit) {
          crc ^= 0x1021;
        }
      }
    }

    crc = _flip(crc, 16);
    crc ^= 0xffff;
    crc &= 0xffff;

    return crc;
  };

  var _clearbits = function(x) {
    for (var i = 0; i < 112; i++) {
      this.du[x].bits[i] = false;
    }
  };

  var _gofix = function(data) {
    var csr = new Int32Array(7);
    var syn = 0;
    for (var i = 0; i < 7; i++) {
      csr[i] = 0;
    }
    
    for (var i = 0; i < 7; i++) {
      for (var j = 0; j <=7; j++) {
        for (var k = 6; k > 0; k--) {
          csr[k] = csr[k - 1];
        }

        csr[0] = (data[i] >> j) & 1;
        var b = csr[0] + csr[2] + csr[5] + csr[6];
        syn <<= 1;
        if ((b & 1) ^ ((data[i + 7] >> j) & 1)) {
          syn |= 1;
        }
        var ec = 0;
        if (syn & 0x80) {
          ++ec;
        }
        if (syn & 0x20) {
          ++ec;
        }
        if (syn & 0x04) {
          ++ec;
        }
        if (syn & 0x02) {
          ++ec;
        }
        if (ec >= 3) {
          syn ^= 0xa6;
          var fixi = i;
          var fixj = j - 7;
          if (fixj < 0) {
            --fixi;
            fixj += 8;
          }
          if (fixi >= 0) {
            data[fixi] ^= 1 << fixj; // flip
          }
        }
      }
    }
  };

  var _procbits = function(x) {
    var lbits = new Array(112);
    var lbc = 0|0;
    var data = new Uint8Array(14);

    for (var i = 0; i < 16; i++) {
      for (var j = 0; j < 7; j++) {
        var k = j * 16 + i;
        lbits[lbc] = this.du[x].bits[k];
        ++lbc;
      }
    }

    for (var i = 0; i < 14; i++) {
      data[i] = 0;
      for (var j = 0; j < 8; j++) {
        var k = i * 8 + j;
        if (lbits[k]) {
          data[i] |= 1 << j;
        }
      }
    }
    _gofix(data);

    var ccrc = _docrc(data, 4);
    var rcrc = data[5] << 8 | data[4];

    if (ccrc == rcrc) {
      if (this.du[x].shstate == 2) {
        this.extra0 = data[0];
        this.extra1 = data[1];
        this.extra2 = data[2];
        this.extra3 = data[3];
        
        for (var k = 0; k < MDC_ND; k++) {
          this.du[k].shstate = -1;
        }

        this.good = 2;
        this.indouble = false;
      } else {
        if (!this.indouble) {
          this.good = 1;
          this.op = data[0];
          this.arg = data[1];
          this.unitID = (data[2] << 8) | data[3];

          switch (this.op) {
            case 0x35:
            case 0x55:
              this.good = 0;
              this.indouble = true;
              this.du[x].shstate = 2;
              this.du[x].shcount = 0;
              _clearbits.bind(this)(x);
              break;
            default:
              for (var k = 0; k < MDC_ND; k++) {
                this.du[k].shstate = -1;
              }
              break;
          }
        } else {
          this.du[x].shstate = 2;
          this.du[x].shcount = 0;
          _clearbits.bind(this)(x);
        }
      }
    } else {
      this.du[x].shstate = -1;
    }

    if (this.callback_) {
      switch (this.good) {
        case 1:
          this.callback_({op: this.op, arg: this.arg, unitID: this.unitID});
          break;
        case 2:
          this.callback_({
            op: this.op,
            arg: this.arg,
            unitID: this.unitID,
            extra0: this.extra0,
            extra1: this.extra1,
            extra2: this.extra2,
            extra3: this.extra3
          });
          break;
        default:
      }
    }
  };

  var _onebits = function(n) {
    var i = 0|0;
    n = n|0;
    while (n != 0) {
      ++i;
      n &= (n - 1);
    }
    return i;
  };

  var _shiftin = function(x) {
    bit = this.du[x].xorb;
    var gcount;
    switch (this.du[x].shstate) {
      case -1:
        this.du[x].synchigh = 0;
        this.du[x].synclow = 0;
        this.du[x].shstate = 0;
        // fallthrough
      case 0:
        this.du[x].synchigh <<= 1;
        if (this.du[x].synclow & 0x80000000) {
          this.du[x].synchigh |= 1;
        }
        this.du[x].synclow <<= 1;
        if (bit) {
          this.du[x].synclow |= 1;
        }

        gcount = _onebits(0xff & (0x07 ^ this.du[x].synchigh));
        gcount += _onebits(0x092a446f ^ this.du[x].synclow);

        if (gcount <= MDC_GDTHRESH) {
          this.du[x].shstate = 1;
          this.du[x].shcount = 0;
          _clearbits.bind(this)(x);
        } else if (gcount >= 40 - MDC_GDTHRESH) {
          this.du[x].shstate = 1;
          this.du[x].shcount = 0;
          this.du[x].xorb = !this.du[x].xorb;
          this.du[x].invert = !this.du[x].invert;
        }
        _clearbits.bind(this)(x);
        return;
      case 1:
      case 2:
        this.du[x].bits[this.du[x].shcount] = bit;
        this.du[x].shcount++;
        if (this.du[x].shcount > 111) {
          _procbits.bind(this)(x);
        }
        return;
      default:
        return;
    }
  };

  var _nlproc = function(x) {
    var vnow, vpast;
    switch (this.du[x].nlstep) {
      case 3:
        vnow = (-0.60 * this.du[x].nlevel[3]) + (0.97 * this.du[x].nlevel[1]);
        vpast = (-0.60 * this.du[x].nlevel[7]) + (0.97 * this.du[x].nlevel[9]);
        break;
      case 8:
        vnow = (-0.60 * this.du[x].nlevel[8]) + (0.97 * this.du[x].nlevel[6]);
        vpast = (-0.60 * this.du[x].nlevel[2]) + (0.97 * this.du[x].nlevel[4]);
        break;
      default:
        return;
    }

    this.du[x].xorb = (vnow > vpast);
    if (this.du[x].invert) {
      this.du[x].xorb = !this.du[x].xorb;
    }
    _shiftin.bind(this)(x);
  };

  this.processSamples = function(/* Float32Array */ samples) {
    if (! samples instanceof Float32Array) {
      return -1;
    }
    for (var i = 0; i < samples.length; i++) {
      for (var j = 0; j < MDC_ND; j++) {
        var lthu = this.du[j].thu;
        this.du[j].thu = (this.du[j].thu + 5 * this.incru) % 4294967296;
        // XXX is this relying on overflow behavior?
        if (this.du[j].thu < lthu) { // wrapped
        // if (this.du[j].thu >= 4294967296) {
          this.du[j].nlstep++;
          if (this.du[j].nlstep > 9) {
            this.du[j].nlstep = 0;
          }
          this.du[j].nlevel[this.du[j].nlstep] = samples[i];
          _nlproc.bind(this)(j);
        }
      }
    }

    return this.good;
  };

  this.getPacket = function() {
    var packet = {
      op: this.op,
      arg: this.arg,
      unitID: this.unitID
    };
    this.good = 0;
    return packet;
  };

  this.setCallback = function(callback) {
    this.callback_ = callback;
  };
}
