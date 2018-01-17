// Function for printing messages in the JS console
function log(data) {
	chrome.runtime.sendMessage({method: "getAllSettings", key: ""}, function(response) {
		if (response.data[5] === "true") {
			console.log('%c[Toolbox] ' + data, 'color: #673AB7');
		}
	});
}

// Function for checking if the Play Store site is desktop or mobile
function ifDesktop() {
	if ($("body").hasClass("phone-optimized")) {
		return false
	} else {
		return true
	}
}

// Function for checking if current page is a Play Store app page
function ifAppPage() {
	if ($('.apps-secondary-color').length || $(".details-wrapper").hasClass("apps")) {
		return true
	} else {
		return false
	}
}

// Function for determining button type that should be used
// All pages on mobile Play Store + pre-register apps on desktop+mobile use medium size
// Rest use large size
function getSize() {
	if ($(".details-info").find(".preregistration-content").length || !(ifDesktop())) {
		return "medium"
	} else {
		return "large"
	}
}

// Function for retrieving parameters from URLs, used for grabbing 'authuser' variable and app package name
// Credit: https://stackoverflow.com/a/901144/2255592
function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Function for creating APKMirror button
// Paremeter is true/false (true if app exists on APKM, false if not)
function createAPKButton(appExists){
	if (appExists == true) {
		if ($(".apkmirror-live-placeholder-button").length) {
			$(".apkmirror-live-placeholder-button").replaceWith('<span class="' + getSize() + ' apps play-button apkmirror-button" title="Download the APK for this application at APKMirror"><button>APKM</button></span>')
		} else if ($(".apkmirror-beta-placeholder-button").length) {
			$(".apkmirror-beta-placeholder-button").replaceWith('<button class="apps default play-button preregistration-content apkmirror-preregister-button apkmirror-button" title="Download the APK for this application at APKMirror"><div class="preregistration-text">APKM</div></button>')
		}
	} else {
		if ($(".apkmirror-live-placeholder-button").length) {
			$(".apkmirror-live-placeholder-button").replaceWith('<span class="' + getSize() + ' apps play-button apkmirror-disabled-button" title="This app is not available on APKMirror"><button>APKM</button></span>')
		} else if ($(".apkmirror-beta-placeholder-button").length) {
			$(".apkmirror-beta-placeholder-button").replaceWith('<button class="apps default play-button preregistration-content apkmirror-disabled-button" title="This app is not available on APKMirror"><div class="preregistration-text">APKM</div></button>')
		}
	}
}

/* TODO: Finish this
// Add Manage Devices link next to device list when installing an application
function addDevicesLink() {
	chrome.runtime.sendMessage({method: "getAllSettings", key: ""}, function(response) {
		// Only fix ampersands if enabled in settings
		if (response.data[6] === "true") {
			if ($(".base-dialog-content-wrapper").length) {
				
			}
		}
	});
}
*/

// Function for injecting all buttons and messages
function insertElements() {
	log("Running insertElements function.");
	chrome.runtime.sendMessage({method: "getAllSettings", key: ""}, function(response) {
		// Only insert buttons if one of the button-related settings are enabled, if page doesn't already have buttons inserted, and if it's an app page
		var buttons = ((response.data[0] === "true") || (response.data[1] === "true") || (response.data[2] === "true"));
		if (buttons && ($('.apkmirror-extension-container').length === 0) && (ifAppPage())) {
			// Add shortcut for extension settings, but only if it's not already there, and only for mobile
			if ((!(ifDesktop())) && (!($(".apkmirror-settings-toolbar").length))) {
				log("Inserted extension settings shortcut.")
				$("#wrapper").prepend('<div class="apkmirror-settings-toolbar">Toolbox extension settings &#187;</div>');
				$(document).on('click', ".apkmirror-settings-toolbar", function() {
					window.open(chrome.extension.getURL("settings.html"));
					return false;
				});
			}
			// Container for apps that are live
			var livebuttons = '<span class="apkmirror-extension-container">';
			// Container for apps in pre-registration
			var betabuttons = '<span class="apkmirror-extension-container">';
			// Insert Appbrain button if enabled in settings
			if (response.data[2] === "true") {
				livebuttons += '<span class="' + getSize() + ' apps play-button appbrain-button" title="View this application at Appbrain"><button>AB</button></span>';
				betabuttons += '<button class="apps default play-button preregistration-content appbrain-preregister-button appbrain-button" title="View this application at Appbrain"><div class="preregistration-text">AB</div></button>';
			}
			// Insert Android Police button if enabled in settings
			if (response.data[1] === "true") {
				livebuttons += '<span class="' + getSize() + ' apps play-button ap-button" title="Search this application on Android Police"><button>AP</button></span>';
				betabuttons += '<button class="apps default play-button preregistration-content ap-preregister-button ap-button" title="Search for news about this app on Android Police"><div class="preregistration-text">AP</div></button>';
			}
			// Insert APKMirror button
			if (response.data[0] === "true") {
				livebuttons += '<span class="' + getSize() + ' apps play-button apkmirror-disabled-button apkmirror-live-placeholder-button" title="Loading APKMirror button..."><button>Loading...</button></span>';
				betabuttons += '<button class="apps default play-button preregistration-content apkmirror-disabled-button apkmirror-beta-placeholder-button" title="Loading APKMirror button..."><div class="preregistration-text">Loading...</div></button>';
				log("Checking cache for data about " + getParameterByName("id", window.location.href) + "...")
				chrome.runtime.sendMessage({method: "checkCache", key: getParameterByName("id", window.location.href)}, function(response) {
					if (response.data != null) {
						log("Local cache returns " + response.data + " for " + getParameterByName("id", window.location.href));
						createAPKButton(response.data);
					} else {
						// If there's an API error, inject the buttons anyway
						log("APKMirror API error detected, see extension background page console for details.");
						createAPKButton(true);
					}
					return true;
				});
			}
			// Close container tags
			livebuttons += '</span>';
			betabuttons += '</span>';
			// Finally inject the container
			if ($(".details-info").find(".buy-button-container").length) {
				// App is live
				var installbutton = $(".details-info").find(".buy-button-container").parent();
				$(livebuttons).insertBefore(installbutton);
			} else if ($(".details-info").find(".preregistration-content").length) {
				// App is in pre-registration
				var installbutton = $(".details-info").find(".preregistration-content").parent();
				$(betabuttons).insertBefore(installbutton);
			}
			log("Injected main buttons.");
			// Reduce spacing on Add to Wishlist button and move it to a new row
			$(".info-box-top").css("padding-bottom", "100px");
			$(".wishlist-display").css("float", "right");
			$(".wishlist-display").insertAfter(".details-actions");
			$(".wishlist-text-default").css("min-width", "auto");
			// Fix random spacing issues
			$(".cover-container").css("float", "left");
			$(".details-section").css("margin-top", "10px");
		}
		// Make sure there isn't already a beta message, that the page is about an app, and that the testing program option is enabled
		if (($('.extension-beta-message').length === 0) && (ifAppPage()) && (response.data[3] === "true")) {
			// Check if application has a beta version and insert button (if enabled in settings)
			if (!($('.extension-beta-message').length)) {
				$('<div class="app-compatibility-final extension-beta-message"><div class="compatibility-loading compatibility-image"></div><span>Looking for testing program...</span></div>').insertAfter(".app-compatibility");
				log("Injected beta program message, waiting for AJAX response.")
			}
			var betalink = "https://play.google.com/apps/testing/" + getParameterByName("id", window.location.href);
			// Detect multiple accounts
			if ($("div[aria-label='Google apps']").find($("a")).length) {
				var authuser = getParameterByName("authuser", $("div[aria-label='Google apps']").find($("a")).attr("href"));
				// If authuser is not explicitly stated in the URL, set it as 0
				if (authuser === null) {
					authuser = 0;
				}
				log("Detected authuser as " + authuser);
				betalink += "?authuser=" + authuser;
				var testinglink = betalink + "&hl=en";
			} else {
				var testinglink = betalink + "?hl=en";
			}
			$(document).on("click", ".apkmirror-more-info" , function() {
					window.location = betalink;
				});
			$.ajax({
				// Ensure English version of testing program is parsed, while the link stays in user's language
				url: testinglink,
				type: 'GET',
				success: function(res) {
					log("Received response from app testing page: " + testinglink);
					// Insert More info button after existing Play Store beta tester message, if it's visible
					if ($(".app-compatibility-beta").find("span").length) {
						$(".extension-beta-message").html("");
						$(".app-compatibility-beta").find("span").append(' <span class="apkmirror-more-info">More info</span>');
					} else {
						// Create a beta test message
						if (res.includes("You are a tester")){
							$(".extension-beta-message").html('<div class="app-compatibility-final extension-beta-message"><div class="compatibility-image compatibility-info-img"></div> You are enrolled in the testing program for this app. <span class="apkmirror-more-info">More info</span></div>');
						} else if (res.includes("Become a tester")){
							$(".extension-beta-message").html('<div class="app-compatibility-final extension-beta-message"><div class="compatibility-image compatibility-info-img"></div> A testing program for this app is available. <span class="apkmirror-more-info">More info</span></div>');
						} else if (res.includes("App not available")){
							$(".extension-beta-message").html('<div class="app-compatibility-final extension-beta-message"><div class="compatibility-image compatibility-no-img"></div> Testing version not available for this account. <span class="apkmirror-more-info">More info</span></div></div>');
						} else {
							$(".extension-beta-message").html('<div class="app-compatibility-final extension-beta-message"><div class="compatibility-image compatibility-no-img"></div> There is no testing version of this app available.</div>');
						}
					}
				},
				error: function(xhr){
					$(".extension-beta-message").html('<div class="app-compatibility-final extension-beta-message"><div class="compatibility-image compatibility-no-img"></div> You must be logged in to check for a testing program.</div>');
				}
			});
		}
	});
};

// Since clicking a link inside the Play Store doesn't actually reload the whole page, this extension monitors changes to the <body> element's attributes
if ((window.location.href.includes("play.google.com")) && (window.location.href.includes("testing") === false)) {
	// Run the function on inital page load
	log("Waiting for page load...");
	$(window).on("load", function() {
		log("Browser reports page load is complete.");
		// Only run the insertElements function on page load if it's an app page
		if (ifAppPage()) {
			insertElements();
		}
		// Run the insertElements function whenever the Play Store loads a new app page
		var pageobserver = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (ifAppPage()) {
					log("Detected a page change, injecting all elements again.");
					insertElements();
				}
			});
		});
		// Enable the observer
		pageobserver.observe($("#page-load-indicator")[0], { attributes: true });
		if ($(".modal-dialog-overlay").length) {
			modalobserver.observe($(".modal-dialog-overlay")[0], { attributes: true });
		}
		});
}

// When the APKMirror button is clicked, open the app on APKMirror
$(document).on("click", ".apkmirror-button" , function() {
	window.open("https://www.apkmirror.com/?s=" + getParameterByName("id", window.location.href) + "&post_type=app_release&searchtype=apk");
});
// When the disabled APKMirror button is clicked, show an alert
$(document).on("click", ".apkmirror-disabled-button" , function() {
	window.open("https://www.apkmirror.com/?s=" + getParameterByName("id", window.location.href) + "&post_type=app_release&searchtype=apk");
});
// When the Android Police button is clicked, search the app's package name on Android Police
$(document).on("click", ".ap-button" , function() {
	window.open("http://www.androidpolice.com/?s=" + getParameterByName("id", window.location.href));
});
// When the Appbrain button is clicked, open the app on Appbrain
$(document).on("click", ".appbrain-button" , function() {
	window.open("http://www.appbrain.com/app/" + getParameterByName("id", window.location.href));
});