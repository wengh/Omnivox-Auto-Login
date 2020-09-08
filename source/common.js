function getDateString(date = new Date()) {
  // sv-SE seems to be similar to ISO 8601
  return date.toLocaleString("sv-SE");
}

function getK() {
  //t1=1599507598.515297, k1=637350917992510779

  const m = 10000;
  const k = 621355842007357696;
  return Date.now() * m + k;
}

function serializeForm(f) {
  let array = f.serializeArray();
  let map = {};
  array.forEach(function (item) {
    map[item.name] = item.value;
  });
  return map;
}

function deserializeForm(f, map) {
  for (var key in map) {
    if (!map.hasOwnProperty(key)) continue;
    $('[name="' + key + '"]').val(map[key]);
  }
}

function displayNothing() {
  var style = document.createElement("style");
  style.innerHTML="body { display:none !important; }";
  document.getElementsByTagName("HEAD")[0].appendChild(style);
}