'use strict';

// don't show on chrome newtab pages
// the content script will not be run on any other chrome:// pages
// because of chrome policies and it would look weird to show it
// on the new tab page
if (document && document.location && document.location.pathname && !document.location.pathname.includes('/chrome/newtab')) {
  var iframe = null;

  var iframeStyle = {
    overflow: 'hidden',
    position: 'fixed',
    height: '70px',
    width: '70px',
    bottom: '7px',
    right: '11px',
    background: 'none',
    border: 'none',
    zIndex: '2147483646',
    '-webkit-user-select': 'none'
  };

  // get initial status
  chrome.runtime.sendMessage({
    subject: 'getWidgetStatus'
  });

  // resize mechanism used by the widget to not obstruct the ui of webpages
  var lastTimeout = null;
  window.onmessage = function (msg) {
    if (msg.data.action === 'zm:resize' && iframe) {
      clearTimeout(lastTimeout);
      lastTimeout = setTimeout(function () {
        iframe.style.height = msg.data.height + 'px';
        iframe.style.width = msg.data.width + 'px';
      }, msg.data.timeout || 10);
    }
  };

  chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.subject === 'widgetStatus') {
      if (msg.payload.active) {
        if (!iframe) {
          iframe = document.createElement('iframe');
          iframe.src = msg.payload.extUrl + 'widget.html';

          for (var k in iframeStyle) {
            var v = iframeStyle[k];
            iframe.style[k] = v;
          }

          document.body.appendChild(iframe);
        }
        iframe.style.display = 'block';
      } else if (iframe) {
        iframe.style.display = 'none';
      }
    }
  });
}