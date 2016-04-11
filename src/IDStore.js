// Converts |n| to hex and pads to |l| digits.
var intToHexPadded = function(n, l) {
  var r = n.toString(16);
  while (r.length < l) {
    r = '0' + r;
  }
  return r;
};

module.exports = function() {
  var ids = {};
  return {
    // Takes a user-formatted (i.e. 4-hex-digit) id
    setCallsign: function(id, callsign) {
      ids[id] = callsign;
    },
    // Takes an integer id (i.e. what's returned from MdcDecoder)
    seenId: function(id) {
      var unit = intToHexPadded(data.unitID, 4);
      ids[unit] = null;
    },
    prettyPrint: function(data) {
      var unit = intToHexPadded(data.unitID, 4);
      var display_unit = unit;
      if (ids[unit]) {
        display_unit = ids[unit] + ' (' + unit + ')';
      }
      if (data.op == 1 && data.arg == 0) {
        return 'Last station: ' + display_unit;
      } else if (data.op == 1 && data.arg == 128) {
        return 'Current station: ' + display_unit;
      } else {
        var r = intToHexPadded(data.op, 2) + ' '
              + intToHexPadded(data.arg, 2) + ' ' + display_unit;
        if (data.extra0 != undefined) {
          r += ' ' + intToHexPadded(extra0, 2);
          r += ' ' + intToHexPadded(extra1, 2);
          r += ' ' + intToHexPadded(extra2, 2);
          r += ' ' + intToHexPadded(extra3, 2);
        }
        return r;
      }
    },
    shouldDisplay: function(data) {
      return data.op != 1 || data.arg == 0;
    },
  };
}();
