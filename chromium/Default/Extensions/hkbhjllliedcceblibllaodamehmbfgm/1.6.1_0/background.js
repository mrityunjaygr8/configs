// background.js

//formanifest
// "content_scripts": [
//   {
//     "matches": [
//       "<all_urls>"
//     ],
//     "js": ["contentscript.js"]
//   }
// ],

// this is the background code...

function meow(tab){
  // for the current tab, inject the "inject.js" file & execute it

	// chrome.tabs.executeScript(null, {
	// 	file: 'inject.js'
	// });
  // chrome.tabs.executeScript(tabId, {
  //      code: "chrome.extension.sendRequest({ loaded: EnhanceLibIsLoaded || false });"
  //  });


  chrome.tabs.executeScript(null, {
    file: 'contentscript.js'
  }, function(results){
    if (chrome.runtime.lastError || !results || !results.length) {
      return;  // Permission error, tab closed, etc.
    }
    if (results[0] !== true) {
      chrome.browserAction.setIcon({path: "iconON.png", tabId: tab.id});
      //chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255], tabId: tab.id });
      //chrome.browserAction.setBadgeText({text: ' ', tabId: tab.id});

      chrome.tabs.executeScript(null, {
    		file: 'inject.js'
    	});
    } else {
      //chrome.browserAction.setBadgeText({text: '', tabId: tab.id});
      //chrome.browserAction.setIcon({path: "icon.png", tabId: tab.id});
      chrome.tabs.executeScript(null, {
        file: 'ejectlite.js'
        //code: 'if( typeof window.eject == "function "){ window.eject(); }'
      });
    }
  });

  // chrome.tabs.executeScript(tabId, {
  //     file: 'contentscript.js',
  // }, function(results) {
  //   alert('fef')
  //     if (chrome.runtime.lastError || !results || !results.length) {
  //         return;  // Permission error, tab closed, etc.
  //     }
  //     if (results[0] !== true) {
  //         // Not already inserted before, do your thing, e.g. add your CSS:
  //         //chrome.tabs.insertCSS(tabId, { file: 'yourstylesheet.css' });
  //         chrome.tabs.executeScript(tabId, { code: "alert('f')" });
  //     }
  // });

  // chrome.tabs.insertCSS(null, {
  //   file: 'styles.css'
  // })
}


// listen for our browerAction to be clicked
chrome.browserAction.onClicked.addListener(meow);


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log(sender.tab ?
    //             "from a content script:" + sender.tab.url :
    //             "from the extension");
    //if (request.greeting == "hello")
    chrome.browserAction.setIcon({path: "icon.png", tabId: sender.tab.id});

      sendResponse({farewell: "goodbye"});
  });


// // listen for requests
// chrome.extension.onRequest.addListener(function(req, sender, sendResponse) {
//     if (req.loaded === false) {
//         chrome.tabs.executeScript(tabId, { code: "alert('f')" }, function() {
//             // set the global variable that the scripts have been loaded
//             // this could also be set as part of the enhance.js lib
//             chrome.tabs.executeScript(tabId, { code: "var EnhanceLibIsLoaded = true;" });
//         });
//      }
// });
