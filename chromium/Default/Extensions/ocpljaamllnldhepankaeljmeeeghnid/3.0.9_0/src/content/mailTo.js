// Whether we should take over the mailto links.
var enabled = false;

function setEnabled() {
  chrome.storage.local.get(null  , function(storage) {
    enabled = Object.keys(storage).some(function(key) {
      return /^onboarded_(.+)_[a-z]+$/.test(key) && storage[key];
    });
  });
}

// Set now and every time the environment changes.
setEnabled();
chrome.storage.onChanged.addListener(setEnabled);

// Take over mailto links.
document.documentElement.addEventListener('click', function(e) {
  if (!enabled) return;
  if (e.defaultPrevented) return;

  var link = $(e.target).closest('a[href^="mailto:"]')[0];
  if (!link) return;

  e.preventDefault();
    e.stopPropagation();
  e.stopImmediatePropagation();

  var href = link.href;

  chrome.runtime.sendMessage({
    method: 'mailTo',
    payload: {
      href: href
    }
  });
}, true );
