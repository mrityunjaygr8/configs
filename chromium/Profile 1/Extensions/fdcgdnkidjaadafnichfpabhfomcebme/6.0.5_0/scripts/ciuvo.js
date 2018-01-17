'use strict';

/* eslint-disable
    consistent-return,
    func-names,
    no-alert,
    no-underscore-dangle,
    no-unused-vars,
    no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Ciuvo

var onRequest = function onRequest(request, sender, sendResponse) {
  if (request.action !== 'runCiuvo') {
    return;
  }
  chrome.storage.local.get(function (data) {
    var _addDisableButtonCallback = void 0;
    if (data && data.disable_smartprice) {
      return;
    }
    // Don't show to premium users if they haven't enabled it manually
    if ((data != null ? data.disable_smartprice : undefined) === undefined && __guard__(data != null ? data.user : undefined, function (x2) {
      return x2.is_premium;
    }) === true) {
      return;
    }

    // Continue
    // NOTE: we did change vendor script (ciuvo-contentscript(.min).js) to handle provided "uuid" correctly
    if (data && data.install_id) {
      request.settings.uuid = data.install_id;
    }

    var contentScript = new window.ciuvoSDK.ContentScript(window.document, request.settings);
    contentScript.run();

    // Hackfix: Add button to optionally disable this feature for good
    var addDisableButton = function addDisableButton() {
      var ctaContainer = __guard__(__guard__(__guard__(__guard__(__guard__(window.document.querySelector("span[data-url^='https://ciuvo.com/message/firstrun/z3Nnno43']"), function (x7) {
        return x7.parentNode;
      }), function (x6) {
        return x6.parentNode;
      }), function (x5) {
        return x5.parentNode;
      }), function (x4) {
        return x4.childNodes;
      }), function (x3) {
        return x3[3];
      });
      if (ctaContainer == null) {
        return;
      }
      var newDiv = window.document.createElement('div');
      newDiv.innerHTML = '<span style="\n    position: absolute;\n    color: #fff;\n    color: #ffffff;\n    display: block;\n    position: absolute;\n    top: -40px;\n    font-family: Helvetica,Arial,sans-serif;\n    font-size: 13px;\n    text-decoration: underline;\n    word-spacing: normal;\n    -webkit-touch-callout: none;\n    -webkit-user-select: none;\n    right: 100px;\n    width: 200px;\n    height: 40px;\n    text-align: center;\n    line-height: 40px;\n    background-color: rgb(73, 168, 215);\n    z-index: 999999999999;\n    cursor: pointer;\n">Disable SmartPrice</span>';
      newDiv.addEventListener('click', function (e) {
        var isOverlayOpen = window.document.querySelector("iframe[src^='https://ciuvo.com/message/firstrun/z3Nnno43']") != null;
        if (!isOverlayOpen) {
          return false;
        }
        var sure = confirm('Are you sure to disable ZenMate SmartPrice?');
        if (!sure) {
          return false;
        }
        // Set flag to disable Ciuvo
        chrome.runtime.sendMessage({
          action: 'disableSmartPrice'
        });
        // Remove Ciuvo master container
        __guard__(__guard__(__guard__(__guard__(window.document.querySelector("span[data-url^='https://ciuvo.com/message/firstrun/z3Nnno43']"), function (x11) {
          return x11.parentNode;
        }), function (x10) {
          return x10.parentNode;
        }), function (x9) {
          return x9.parentNode;
        }), function (x8) {
          return x8.remove();
        });
        return false;
      }, false);
      var cta = ctaContainer.childNodes != null ? ctaContainer.childNodes[0] : undefined;
      ctaContainer.insertBefore(newDiv, cta);
      return true;
    };

    var i = 0;
    return (_addDisableButtonCallback = function addDisableButtonCallback() {
      var success = addDisableButton();
      i += 1;
      if (!(i > 20) && !success) {
        return setTimeout(_addDisableButtonCallback, 1000);
      }
    })();
  });
};

chrome.runtime.onMessage.addListener(onRequest);

// send the content to the manager and receive the settings from
// the background page in the response
chrome.runtime.sendMessage({
  action: 'pageLoaded',
  url: window.document.location.href,
  visibility: document.webkitVisibilityState,
  top: window === window.top
});

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}