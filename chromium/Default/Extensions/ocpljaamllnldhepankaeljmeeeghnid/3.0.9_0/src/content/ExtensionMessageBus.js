// Listen to events from background page.
chrome.runtime.onMessage.addListener(function(request, sender) {
  // Forward to the extension source.
  window.postMessage({
    sender: '__MIXMAX_MESSAGING_EXTENSION',
    version: 1, // In case we need to know if the source is out of sync with the extension.
    method: request.method,
    payload: request.payload
  }, '*');
});

// Listen to events from extension source.
$(window).on('message', function(e) {
    if (e.originalEvent.source !== window) return;

    var data = e.originalEvent.data;
  if (!data || (data.sender !== '__MIXMAX_MESSAGING_SOURCE')) return;

  // Send to background page.
  try {
    chrome.runtime.sendMessage({
      canonicalUrl: data.canonicalUrl,
      invocationId: data.invocationId,
      method: data.method,
      payload: data.payload
    });
  } catch(err) {
    // Synchronously catch errors occurring when the Chrome runtime loses its connection to the
    // extension, which occurs when the extension is updated, and reload. We try to proactively
    // refresh in the `chrome.runtime.onInstalled` listener in `refreshBrowser.js`, but a
    // `beforeUnload` handler can block this. Who knows why this is thrown synchronously, the
    // `chrome.runtime.sendMessage` documentation suggests it should be the value of
    // `chrome.runtime.lastError` in `sendMessage`'s callback (and it's not even if a callback is
    // provided). https://app.asana.com/0/19141607276671/204618784968741
    if (/Invocation.+doesn't match/i.test(err.message)) {
      window.location.reload();
    } else {
      error.captureException(err, {
        culprit: 'Could not message extension',
        extra: {
          method: data.method,
          payload: data.payload
        }
      });
    }
  }
});
