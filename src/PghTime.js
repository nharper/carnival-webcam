module.exports = function() {
  var local_date = new Date();
  var pgh_date = new Date(
      local_date.getTime() + (local_date.getTimezoneOffset() - 240) * 60000);
  var h = pgh_date.getHours();
  var m = pgh_date.getMinutes();
  var s = pgh_date.getSeconds();
  h = (h < 10 ? '0' : '') + h;
  m = (m < 10 ? '0' : '') + m;
  s = (s < 10 ? '0' : '') + s;
  return h + ':' + m + ':' + s;
};
