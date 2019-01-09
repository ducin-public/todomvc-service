const hashCode = function (s) {
  var h = 0, l = s.length, i = 0;
  if (l > 0)
    while (i < l)
      h = (h << 5) - h + s.charCodeAt(i++) | 0;
  return Math.abs(h);
};

const randomId = () => Math.random().toString(36).substring(2)

const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
  .toString(16)
  .substring(1);

const randomGuid = () => s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

const getDelay = (base) =>
  (fn) =>
    setTimeout(fn, base + Math.ceil(Math.random() * 1000))

const stringify = json => JSON.stringify(json, null, 2)

module.exports = {
  hashCode,
  randomId,
  randomGuid,
  getDelay,
  stringify,
}
