/*
 Social Fixer
 (c) 2009-2017 Matt Kruse
 http://SocialFixer.com/
 */
// Extension API
var Extension = (function () {
    return {
        "storage": {
            "get": function (keys, def, callback, prefix) {
                var defaults = {};
                var defaults_with_prefix = {};
                var single = true;
                var p, ret2;
                if (typeof keys == "string") {
                    defaults[keys] = def;
                    defaults_with_prefix[prefix+keys] = def;
                }
                else {
                    single = false;
                    for (var i = 0; i < keys.length; i++) {
                        defaults[keys[i]] = def[i];
                        defaults_with_prefix[prefix+keys[i]] = def[i];
                    }
                }
//X.log("getting obj",defaults_with_prefix);
                chrome.storage.local.get(defaults_with_prefix, function (ret) {
//X.log("ret",ret);
                    if (chrome && chrome.extension && chrome.extension.lastError) {
                        console.log("Chrome error: " + chrome.extension.lastError.message);
                        callback(null, chrome.extension.lastError.message);
                    }
                    else {
                        if (single) {
                            callback(ret[prefix+keys]);
                        } else {
                            // We have to return an object back without the prefix in the keys
                            if (ret) {
                              ret2 = {};
                              for (p in ret) {
                                ret2[p.replace(prefix, '')] = ret[p];
                              }
//X.log("ret2",ret2);
                              callback(ret2);
                            }
                            else {
                              callback(ret);
                            }
                        }
                    }
                });
            }
            ,
            "set": function (key, val, callback, prefix) {
                var values = {};
                values[prefix+key] = val;
//X.log("set",values);
                chrome.storage.local.set(values, function () {
                    if (chrome && chrome.extension && chrome.extension.lastError) {
                        console.log("Chrome error: " + chrome.extension.lastError.message);
                    } else if (typeof callback == "function") {
                        callback(key, val);
                    }
                });
            }
        }
        ,
        "ajax":function(urlOrObject,callback) {
            var details;
            var internalCallback = function (response) {
                var headers = {};
                response.responseHeaders.split(/\r?\n/).forEach(function (header) {
                    var val = header.split(/\s*:\s*/, 2);
                    headers[val[0].toLowerCase()] = val[1];
                });
                callback(response.responseText, response.status, headers);
            };

            if (typeof urlOrObject == "string") {
                details = {"method": "GET", "url": urlOrObject, "onload": internalCallback};
            }
            else if (urlOrObject.url) {
                details = urlOrObject;
                details.onload = internalCallback;
            }
            else {
                alert("Invalid parameter passed to Extension.ajax");
                callback(null);
            }
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    var response = {
                        "responseText":xhr.responseText,
                        "responseHeaders":xhr.getAllResponseHeaders(),
                        "status":xhr.status
                    };
                    internalCallback(response);
                }
            };
            xhr.open(details.method, details.url, true);
            xhr.send();
        }
    };
})();
try {
var sfx_version = "21.1.0";
var sfx_buildtype = "web_extension";
var sfx_buildstr = sfx_version + " (" + sfx_buildtype + ")";
var sfx_user_agent = "Browser: " + navigator.userAgent;
var sfx_userscript_agent = undefined;
if (sfx_buildtype == "greasemonkey") {
   sfx_userscript_agent = "Script running under " +
      ((typeof GM_info === "undefined") ?
         "unknown v:unknown" :
         (GM_info.scriptHandler || "Greasemonkey") + " v:" + (GM_info.version || "unknown"));
}
var global_options = {
	"use_mutation_observers":true
};
var global = {};

// Stop running under certain conditions
// =====================================
var prevent_running = false;
if (window.top != window.self) { prevent_running=true; } // no frames
else if (/\/l.php\?u|\/ai.php|\/plugins\/|morestories\.php/.test(location.href)) { prevent_running=true; }
var runat = X.is_document_ready()?"document-end":"document-start";

// This actually executes module code by firing X.ready()
var run_modules = function() {
	// This tells each module to run itself
	X.ready();
	// First add any CSS that has been built up
	FX.css_dump();
	// Queue or Fire the DOMContentLoaded functions
	FX.fire_content_loaded();
};

// Should we even run at all?
if (!prevent_running) {
	// Allow modules to delay early execution of modules (until prefs are loaded) by returning false from beforeReady()
	if (X.beforeReady()!==false) {
		run_modules();
	}

  // Load Options (async)
  var bootstrap = function() {
    X.storage.get(['options', 'filters', 'tweaks', 'hiddens', 'postdata', 'friends', 'stats', 'tasks', 'messages'], [{}, [], [], {}, {}, {}, {}, {}, {}], function (options) {
      if (X.beforeReady(options) !== false) {
        run_modules();
        FX.options_loaded(options);
      }
    });
  };

  // Find out who we are
	// ===================
  userid = X.cookie.get('c_user') || "anonymous";
  // Prefix stored pref keys with userid so multiple FB users in the same browser can have separate prefs
  X.storage.prefix = userid;
	// If there is no user-level data stored, check to see if there is a global non-prefixed data.
	// If so, offer the user the chance to copy over those prefs
	// This is only needed for a while, until every user is transitioned over, then this code can be removed.
	X.storage.get('stats',null,function(stats) {
		var migrate_prefs = false;
		if (stats==null) {
			// No user-level data
			// Grab global data
      X.storage.prefix = null;
      X.storage.get(['options', 'filters', 'tweaks', 'hiddens', 'postdata', 'friends', 'stats', 'tasks', 'messages'], [{}, [], [], {}, {}, {}, {}, {}, {}], function (options) {
        if ((!stats || !stats.installed_on) && options && options.stats && options.stats.installed_on) {
          migrate_prefs = true;
          // Save all the options to user-level
          X.storage.prefix = userid;
          // These are all async, but it's fine
          X.storage.save('options', options.options);
          X.storage.save('filters', options.filters);
          X.storage.save('tweaks', options.tweaks);
          X.storage.save('hiddens', options.hiddens);
          X.storage.save('postdata', options.postdata);
          // Clear out the friends, because this is particularly problematic
          X.storage.save('friends', {});
          X.storage.save('stats', options.stats);
          X.storage.save('tasks', options.tasks);
          X.storage.save('messages', options.messages);

          // Inform the user of what happened
          alert('Social Fixer preferences will now be stored separately per user. Your existing settings have been copied over to your current user.\n\nClick OK to automatically refresh the page and have it take effect.');
          setTimeout(function () {
            window.location.reload(true);
          }, 750);
        }
        else {
          bootstrap();
        }
      });
		}
		else {
      bootstrap();
    }
	});
}

} catch(e) {
    console.log(e);
}
