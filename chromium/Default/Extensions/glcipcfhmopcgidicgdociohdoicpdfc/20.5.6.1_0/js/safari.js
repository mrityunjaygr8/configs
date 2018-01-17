function reqListener() {
  var data = JSON.parse(this.responseText);
  window.localStorage.setItem('cachedFeed', JSON.stringify(data));
}

safari.application.addEventListener("command", function (a) {
  if ("openmuzli" === a.command) {
    var newTab = safari.application.activeBrowserWindow.openTab();
    newTab.url = safari.extension.baseURI + 'app.html';
  }
}, false);

setInterval(function () {
  var oReq = new XMLHttpRequest();
  oReq.onload = reqListener;
  oReq.open('get', 'https://api.muz.li/v1/feed/muzli?limit=15', true);
  oReq.send();
}, 1000 * 60 * 15);