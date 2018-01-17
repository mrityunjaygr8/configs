// Function for AJAX Basic authentication (used for APKMirror API)
// From here: https://stackoverflow.com/a/9613117
function make_base_auth(user, password) {
	var tok = user + ':' + password;
	var hash = btoa(tok);
	return "Basic " + hash;
}

// Function to print cache in extension background page console, for debugging purposes
function viewCache() {
  var cache = JSON.parse(localStorage["cache"]);
  console.log(cache)
}

// Function to find difference in hours/days between two Date() objects
function timeDiff(dt2, dt1, format) {
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60);
  if (format == "hours") {
    return Math.abs(Math.round(diff));
  } else if (format == "days") {
    return Math.abs(Math.round(diff)) / 24;
  }
}

chrome.runtime.onInstalled.addListener(function() {
  // Open message for Firefox Android users on first install
  if (localStorage.getItem("mobilemessage") === null || localStorage.getItem("mobilemessage") === "") {
    if (navigator.userAgent.includes('Firefox') && navigator.userAgent.includes("Android")) {
      chrome.tabs.create({'url': chrome.extension.getURL('mobile-message.html')});
    }
    // Set variable so the check is never run again
    localStorage["mobilemessage"] = "true";
  }
  // Set switch for APKMirror button
  if (localStorage.getItem("apkmirror") === null || localStorage.getItem("apkmirror") === "") {
    localStorage["apkmirror"] = "true";
  }
  // Set switch for Android Police button
  if (localStorage.getItem("androidpolice") === null || localStorage.getItem("androidpolice") === "") {
    localStorage["androidpolice"] = "true";
  }
  // Set switch for Appbrain button
  if (localStorage.getItem("appbrain") === null || localStorage.getItem("appbrain") === "") {
    localStorage["appbrain"] = "true";
  }
  // Set switch for testing button
  if (localStorage.getItem("testing") === null || localStorage.getItem("testing") === "") {
    localStorage["testing"] = "true";
  }
  // Set switch for developer mode
  if (localStorage.getItem("devmode") === null || localStorage.getItem("devmode") === "") {
    localStorage["devmode"] = "false";
  }
  // Set switch for Manage Devices link on install modal
  if (localStorage.getItem("managedevices") === null || localStorage.getItem("managedevices") === "") {
    localStorage["managedevices"] = "true";
  }
  if (localStorage.getItem("cache") === null || localStorage.getItem("devmode") === "") {
    // Create cache used to store APKMirror API responses
    localStorage["cache"] = "[]";
    /*
    Example formatting:
    [
      ["com.google.android.apps.genie.geniewidget", [
        true, // If app exists or not
        "Sat Sep 30 2017 16:41:21 GMT-0400 (Eastern Daylight Time)" // Cached date in standard JS format
      ]],
      ["flipboard.app", [
        true,
        "Sat Sep 30 2017 16:41:21 GMT-0400 (Eastern Daylight Time)"
      ]]
    ]
    */
  }
});

// Function to allow the content script (ccontentscript.js) to read extension settings
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.method == "getLocalStorage") {
    sendResponse({data: localStorage[request.key]});
  } else if (request.method == "getAllSettings") {
    // One of the values is set to null because the setting was removed, and removing it would disrupt the order of subsequent values
    var settingsarray = new Array(localStorage["apkmirror"], localStorage["androidpolice"], localStorage["appbrain"], localStorage["testing"], "null", localStorage["devmode"], localStorage["managedevices"]);
    sendResponse({data: settingsarray});
  } else if (request.method == "checkCache") {
    // Pull existing array from localStorage and convert it from a string into an object
    var cache = JSON.parse(localStorage["cache"]);
    // Create nested array with package name, boolean (if app exists), and date converted to string
    if (cache.find(el => el[0] === request.key)) {
      console.log("Found " + request.key + " in cache with value of " + cache.find(el => el[0] === request.key)[1][0] + ", status last checked on: " + cache.find(el => el[0] === request.key)[1][1])
      var cachedate = new Date(cache.find(el => el[0] === request.key)[1][1]);
      var start = new Date();
      var daydiff = timeDiff(cachedate, start, 'days'); // Difference between cache date and now in days
      var hourdiff = timeDiff(cachedate, start, 'hours'); // Difference between cache date and now in hours
      // Determine if the cache needs to be updated
      // If app is already in cache with value of TRUE (app exists on APKM), wait seven days before checking again
      // If app is already in cache with value of FALSE (app does not exist on APKM), wait three hours before checking again
      // If app is not in cache at all, check APKMirror and store result
      if (((cache.find(el => el[0] === request.key)[1][0] == true) && daydiff > 6) || ((cache.find(el => el[0] === request.key)[1][0] == false) && hourdiff > 2)) {
        console.log("Cache info is out of date (info is from " + cachedate + ", " + hourdiff + " hours ago), checking APKMirror.")
        $.ajax({
          method: "POST",
          async: false,
          beforeSend: function (xhr){ 
            xhr.setRequestHeader('Authorization', make_base_auth("api-toolbox-for-google-play", "CbUW AULg MERW u83r KK4H DnbK")); 
          },
          url: "https://www.apkmirror.com/wp-json/apkm/v1/app_exists/",
          data: {
            "pnames":[
              {"pname": request.key.toString()}
            ]
          },
          dataType: "json",
          success: function(data) {
            var app = data.data[0];
            console.log("APKMirror API returns " + app.exists + " for " + app.pname);
            // Remove existing entry from cache
            var index = cache.indexOf(cache.find(el => el[0] === request.key));
            if (index > -1) {
              cache.splice(index, 1)
            }
            // Add new entry to cache
            var currentTime = Date().toString();
            cache.push([app.pname, [app.exists, currentTime]])
            // Send response back to contentscript.js
            sendResponse({data: app.exists});
          },
          error: function(data) {
            console.log("Error with APKMirror API:");
            console.log(data);
            sendResponse({data: null});
          }
        });
      } else {
        console.log("Cache data is only from from " + hourdiff + " hours (" + daydiff + " days) ago, no need to check APKMirror.")
        // Send response back to contentscript.js
        sendResponse({data: cache.find(el => el[0] === request.key)[1][0]});
      }
    } else {
      console.log("Did not find " + request.key + " in cache, checking APKMirror...");
      $.ajax({
        method: "POST",
        async: false,
        beforeSend: function (xhr){ 
          xhr.setRequestHeader('Authorization', make_base_auth("api-toolbox-for-google-play", "CbUW AULg MERW u83r KK4H DnbK")); 
        },
        url: "https://www.apkmirror.com/wp-json/apkm/v1/app_exists/",
        data: {
          "pnames":[
            {"pname": request.key.toString()}
          ]
        },
        dataType: "json",
        success: function(data) {
          var app = data.data[0];
          console.log("APKMirror API returns " + app.exists + " for " + app.pname + ".");
          // Add entry to cache
          var currentTime = Date().toString();
          cache.push([app.pname, [app.exists, currentTime]])
          console.log("Added " + app.pname + " to cache with value " + app.exists + ".")
          // Send response back to contentscript.js
          sendResponse({data: app.exists});
        },
        error: function(data) {
          console.log("Error with APKMirror API:");
          console.log(data);
          // Send null response back to contentscript.js
          sendResponse({data: null});
        }
      });
    }
    // Save the new array in localStorage
    localStorage["cache"] = JSON.stringify(cache);
  } else {
    sendResponse({});
  }
});