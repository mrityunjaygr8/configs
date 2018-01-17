function initwrapper() {
    (function (TBUtils) {

    // We need these before we can do anything.
        TBUtils.modhash = $('form.logout input[name=uh]').val();
        TBUtils.logged = (TBUtils.modhash !== undefined || $('.App__header .Header__user').length > -1) ? $('span.user a:first').html() || $('.App__header .Header__user').html() : '';

        TBUtils.post_site = $('.redditname:not(.pagename) a:first').html();  // This may need to be changed to regex, if this is unreliable.

        // Probably a better way to this but... ah well.
        // We don't need it right away, just when using POST
        if(!TBUtils.modhash && window.location.hostname === 'mod.reddit.com') {
            $.getJSON('https://www.reddit.com/r/toolbox.json',{ limit: 1 }, function(result) {
                TBUtils.modhash = result.data.modhash;

            });

            $('body').addClass('mod-toolbox-new-modmail');
            TBUtils.modCheck = true;
        } else {
            TBUtils.modCheck = $('#modmail, #new_modmail').length > 0;
        }

        // Let's get oauth information
        // We fetch the data on page load but we don't access the variable directly.





        // Token promise.
        TBUtils.oauthToken = function oauthToken() {
            return new Promise(function (resolve) {
                chrome.runtime.sendMessage({action: 'oauthToken'}, resolve);
            }).then(function(response) {
                const responseObject = JSON.parse(response.oauthToken);
                if (!responseObject.ERROR) {

                    return responseObject.accessToken;
                } else {
                    $.log(`ERROR: ${responseObject.ERROR}`, false, SHORTNAME);
                    throw new Error(`ERROR:${responseObject.ERROR}`);
                }
            });
        };






        // If we are on new modmail we use www.reddit.com for all other instances we use whatever is the current domain.
        TBUtils.baseDomain = (window.location.hostname === 'mod.reddit.com' ? 'https://www.reddit.com' :  `https://${window.location.hostname}`);

        const CHROME = 'chrome', FIREFOX = 'firefox', OPERA = 'opera', SAFARI = 'safari', EDGE = 'edge', UNKOWN_BROWSER = 'unknown',
            ECHO = 'echo', SHORTNAME = 'TBUtils', SETTINGS_NAME = 'Utils';

        //Private variables
        var modMineURL = '/subreddits/mine/moderator.json?limit=100',
            now = new Date().getTime(),

            shortLength = TBStorage.getSetting(SETTINGS_NAME, 'shortLength', 15),
            longLength = TBStorage.getSetting(SETTINGS_NAME, 'longLength', 45),

            lastgetLong = TBStorage.getCache(SETTINGS_NAME, 'lastGetLong', -1),
            lastgetShort = TBStorage.getCache(SETTINGS_NAME, 'lastGetShort', -1),
            cacheName = TBStorage.getCache(SETTINGS_NAME, 'cacheName', ''),
            seenNotes = TBStorage.getSetting(SETTINGS_NAME, 'seenNotes', []),
            lastVersion = TBStorage.getSetting(SETTINGS_NAME, 'lastVersion', 0),
            toolboxDevs = TBStorage.getSetting(SETTINGS_NAME, 'tbDevs', []),
            newLogin = (cacheName != TBUtils.logged),
            getnewLong = (((now - lastgetLong) / (60 * 1000) > longLength) || newLogin),
            getnewShort = (((now - lastgetShort) / (60 * 1000) > shortLength) || newLogin),
            betaRelease = false,  /// DO NOT FORGET TO SET FALSE BEFORE FINAL RELEASE! ///
            gettingModSubs = false,
            getModSubsCallbacks = [],
            invalidPostSites = ['subreddits you moderate', 'mod (filtered)', 'all'],
            tabID = 0,

            randomQuotes = ["Dude, in like 24 months, I see you Skyping someone to watch them search someone's comments on reddit.",
                "Simple solution, don't use nightmode....",
                'Nightmode users are a buncha nerds.',
                "Oh, so that's where that code went, I thought i had lost it somehow.",
                'Are all close buttons pretty now?!?!?',
                'As a Business Analyst myself...',
                "TOOLBOX ISN'T YOUR PERSONAL TOOL!",
                'You are now an approvened submitter',
                "Translate creesch's Klingon settings to English.",
                'Cuz Uncle Jessy was hot and knew the Beach Boys',
                "Don't worry too much. There's always extra pieces.",
                'Make the check actually check.',
                "I dunno what this 'Safari' thing is.",
                'eeeeew... why is there PHP code in this room?',
                'nah there is an actual difference between stuff',
                '...have you paid money *out of your own pocket* to anyone to vet this product?',
                'first I want to make sure my thing actually does work sort of',
                "Don't let \"perfect\" get in the way of \"good.\"",
                'damnit creesch, put a spoiler tag, now the ending of toolbox is ruined for me',
                "It's not even kinda bad... It's strangely awful.",
                'Like a good neighbor, /u/andytuba is there',
                'toolbox is build on beer',
                'aww, i thought this was about real tools',
                'my poop never smelled worse than when i lived off pizza bagel bites',
                'Little dot, little dot ♪ You are not so little anymore ♫',
                "How great will it be that trouble's wiki page will also include pizza ordering instructions?",
                'Luu',
                'I go two and hope for the best.',
                'oh dammit, I forgot to include url shit',
                'I think I just released a broken release',
                'BECAUSE I AM THE LAW!!!'],

            RandomFeedbackText = ['Please hold, your call is important to us.',
                'Remember, toolbox loves you.',
                'toolbox will be back later, gone fishing.',
                "toolbox is 'doing things', don't ask.",
                'Tuning probability drive parameters.',
                'Initiating data transfer: NSA_backdoor_package. ',
                'Please post puppy pictures, they are so fluffy!',
                'RES is visiting for a sleepover,  no time right now',
                'toolbox is on strike, we demand more karma!',
                'brb... kicking Gustavobc from #toolbox',
                'Requesting a new insurance quote from /u/andytuba',
                "/u/dakta ran out for a pack of smokes... BUT HE PROMISED HE'D BE RIGHT BACK"];


        // Public variables
        TBUtils.toolboxVersion = `3.7.1${(betaRelease) ? ' (beta)' : ''}`;
        TBUtils.shortVersion = 371; //don't forget to change this one!  This is used for the 'new version' notification.
        TBUtils.releaseName = 'Cleaning Cockcroach';
        TBUtils.configSchema = 1;
        TBUtils.notesSchema = 6;
        TBUtils.notesMinSchema = 4;
        TBUtils.notesDeprecatedSchema = 4;
        TBUtils.notesMaxSchema = 6;     // The non-default max version (to allow phase-in schema releases)
        TBUtils.NO_WIKI_PAGE = 'NO_WIKI_PAGE';
        TBUtils.WIKI_PAGE_UNKNOWN = 'WIKI_PAGE_UNKNOWN';
        TBUtils.isModmail = location.pathname.match(/(\/message\/(?:moderator)\/?)|(\/r\/.*?\/about\/message\/inbox\/?)/);
        TBUtils.isNewModmail = location.host === 'mod.reddit.com';
        TBUtils.isModmailUnread = location.pathname.match(/\/message\/(?:moderator\/unread)\/?/);
        TBUtils.isModpage = location.pathname.match(/\/about\/(?:reports|modqueue|spam|unmoderated|edited)\/?/);
        TBUtils.isEditUserPage = location.pathname.match(/\/about\/(?:contributors|moderator|banned)\/?/);
        TBUtils.isModFakereddit = location.pathname.match(/^\/r\/mod\b/) || location.pathname.match(/^\/me\/f\/mod\b/);
        TBUtils.isToolbarPage = location.pathname.match(/^\/tb\//);
        TBUtils.isUnreadPage = location.pathname.match(/\/message\/(?:unread)\/?/);
        TBUtils.isModLogPage = location.pathname.match(/\/about\/(?:log)\/?/);
        TBUtils.isModQueuePage = location.pathname.match(/\/about\/(?:modqueue)\/?/);
        TBUtils.isUnmoderatedPage = location.pathname.match(/\/about\/(?:unmoderated)\/?/);
        TBUtils.isCommentsPage = location.pathname.match(/\?*\/(?:comments)\/?/);
        TBUtils.isSubCommentsPage = location.pathname.match(/\/r\/.*?\/(?:comments)\/?/);
        TBUtils.isSubAllCommentsPage = location.pathname.match(/\/r\/.*?\/(?:comments)\/?$/);
        TBUtils.isUserPage = location.pathname.match(/\/(?:user)\/?/);
        TBUtils.isNewPage = location.pathname.match(/\?*\/(?:new)\/?/);
        TBUtils.isMultiPage = location.pathname.match(/^\/(?:user\/)?\w+\/m\/\w+/);
        TBUtils.isMod = $('body.moderator').length;
        TBUtils.isNewMMThread = $('body').find('.ThreadViewer').length > 0;
        TBUtils.isExtension = true;
        TBUtils.RandomQuote = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
        TBUtils.RandomFeedback = RandomFeedbackText[Math.floor(Math.random() * RandomFeedbackText.length)];
        TBUtils.log = [];
        TBUtils.logModules = [];
        TBUtils.debugMode = TBStorage.getSetting(SETTINGS_NAME, 'debugMode', false);
        TBUtils.devMode = TBStorage.getSetting(SETTINGS_NAME, 'devMode', false);
        TBUtils.betaMode = TBStorage.getSetting(SETTINGS_NAME, 'betaMode', false);
        TBUtils.advancedMode = TBStorage.getSetting(SETTINGS_NAME, 'advancedMode', false);
        TBUtils.ratelimit = TBStorage.getSetting(SETTINGS_NAME, 'ratelimit', {remaining: 300, reset: 600*1000});
        TBUtils.firstRun = false;
        TBUtils.tbDevs = toolboxDevs;
        TBUtils.betaRelease = betaRelease;

        // Stuff from TBStorage
        TBUtils.browser = TBStorage.browser;
        TBUtils.domain = TBStorage.domain;
        TBUtils.browsers = TBStorage.browsers;

        // Check our post site.  We might want to do some sort or regex fall back here, if it's needed.
        if (TBUtils.isModFakereddit || TBUtils.post_site === undefined || !TBUtils.post_site || invalidPostSites.indexOf(TBUtils.post_site) != -1) {
            TBUtils.post_site = '';
        }


        // Do settings echo before anything else.  If it fails, exit toolbox.
        var ret = TBStorage.setSetting(SETTINGS_NAME, 'echoTest', ECHO);
        if (ret !== ECHO) {
            alert('toolbox can not save settings to localstorage\n\ntoolbox will now exit');
            return;
        }

        $('body').addClass('mod-toolbox');

        // Get cached info.
        TBUtils.noteCache = (getnewShort) ? {} : TBStorage.getCache(SETTINGS_NAME, 'noteCache', {});
        TBUtils.configCache = (getnewLong) ? {} : TBStorage.getCache(SETTINGS_NAME, 'configCache', {});
        TBUtils.rulesCache = (getnewLong) ? {} : TBStorage.getCache(SETTINGS_NAME, 'rulesCache', {});
        TBUtils.noConfig = (getnewShort) ? [] : TBStorage.getCache(SETTINGS_NAME, 'noConfig', []);
        TBUtils.noNotes = (getnewShort) ? [] : TBStorage.getCache(SETTINGS_NAME, 'noNotes', []);
        TBUtils.noRules = (getnewLong) ? [] : TBStorage.getCache(SETTINGS_NAME, 'noRules', []);
        TBUtils.mySubs = (getnewLong) ? [] : TBStorage.getCache(SETTINGS_NAME, 'moderatedSubs', []);
        TBUtils.mySubsData = (getnewLong) ? [] : TBStorage.getCache(SETTINGS_NAME, 'moderatedSubsData', []);

        if (TBUtils.debugMode) {
            var consoleText = `toolbox version: ${TBUtils.toolboxVersion
            }, Browser: ${TBUtils.browser
            }, Extension: ${TBUtils.isExtension
            }, Beta features: ${TBUtils.betaMode
            }\n\n"${TBUtils.RandomQuote}"\n`;

            TBUtils.log.push(consoleText);
        }

        // Update cache vars as needed.
        if (newLogin) {
            $.log('Account changed', false, SHORTNAME);
            TBStorage.setCache(SETTINGS_NAME, 'cacheName', TBUtils.logged);
        }

        if (getnewLong) {
            $.log('Long cache expired', false, SHORTNAME);
            TBStorage.setCache(SETTINGS_NAME, 'lastGetLong', now);
        }

        if (getnewShort) {
            $.log('Short cache expired', false, SHORTNAME);
            TBStorage.setCache(SETTINGS_NAME, 'lastGetShort', now);
        }

        var pushedunread = TBStorage.getSetting('Notifier', 'unreadPushed', []);
        if (pushedunread.length > 250) {
            pushedunread.splice(150, (pushedunread.length - 150));
            TBStorage.setSetting('Notifier', 'unreadPushed', pushedunread);
        }

        var pusheditems = TBStorage.getSetting('Notifier', 'modqueuePushed', []);
        if (pusheditems.length > 250) {
            pusheditems.splice(150, (pusheditems.length - 150));
            TBStorage.setSetting('Notifier', 'modqueuePushed', pusheditems);
        }

        var repliedModmail = TBStorage.getSetting('ModMail', 'replied', []);
        if (repliedModmail.length > 250) {
            pusheditems.splice(150, (repliedModmail.length - 150));
            TBStorage.setSetting('ModMail', 'replied', repliedModmail);
        }

        if (seenNotes.length > 250) {
            $.log('clearing seen notes', false, SHORTNAME);
            seenNotes.splice(150, (seenNotes.length - 150));
            TBStorage.setSetting(SETTINGS_NAME, 'seenNotes', seenNotes);
        }

        if (!toolboxDevs || toolboxDevs.length < 1) {
            getToolboxDevs();
        }

        // First run changes.
        if (TBUtils.shortVersion > lastVersion) {

        // These need to happen for every version change
            TBUtils.firstRun = true; // for use by other modules.
            TBStorage.setSetting(SETTINGS_NAME, 'lastVersion', TBUtils.shortVersion); //set last version to this version.
            getToolboxDevs();  //always repopulate tb devs for each version change

            //** This should be a per-release section of stuff we want to change in each update.  Like setting/converting data/etc.  It should always be removed before the next release. **//

            // Start: version changes.
            /* TBUtils.[get/set]Setting IS NOT DEFINDED YET!!!  Use TBStorage.[get/set]settings */

            // 3.7 version changes

            // End: version changes.

            // This is a super extra check to make sure the wiki page for settings export really is private.
            var settingSubEnabled = TBStorage.getSetting('Utils', 'settingSub', '');
            if (settingSubEnabled) {
                setWikiPrivate('tbsettings', settingSubEnabled, false);
            }

            // These two should be left for every new release. If there is a new beta feature people want, it should be opt-in, not left to old settings.
            //TBStorage.setSetting('Notifier', 'lastSeenModmail', now); // don't spam 100 new mod mails on first install.
            //TBStorage.setSetting('Notifier', 'modmailCount', 0);
            TBStorage.setSetting(SETTINGS_NAME, 'debugMode', false);
            TBStorage.setSetting(SETTINGS_NAME, 'betaMode', false);
            TBUtils.debugMode = false;
            TBUtils.betaMode = false;
        }

        TBUtils.config = {
            ver: TBUtils.configSchema,
            domainTags: '',
            removalReasons: '',
            modMacros: '',
            usernoteColors: '',
            banMacros: ''
        };

        TBUtils.events = {
            TB_ABOUT_PAGE: 'TB_ABOUT_PAGE',
            TB_APPROVE_THING: 'TB_APPROVE_THING',
            TB_FLY_SNOO: 'TB_FLY_SNOO',
            TB_KILL_SNOO: 'TB_KILL_SNOO',
            TB_SAMPLE_SOUND: 'TB_SAMPLE_SOUND',
            TB_SYNTAX_SETTINGS: 'TB_SYNTAX_SETTINGS',
            TB_UPDATE_COUNTERS: 'TB_UPDATE_COUNTERS'
        };

        TBUtils.defaultUsernoteTypes = [
            {key: 'gooduser', color: 'green', text: 'Good Contributor'},
            {key: 'spamwatch', color: 'fuchsia', text: 'Spam Watch'},
            {key: 'spamwarn', color: 'purple', text: 'Spam Warning'},
            {key: 'abusewarn', color: 'orange', text: 'Abuse Warning'},
            {key: 'ban', color: 'red', text: 'Ban'},
            {key: 'permban', color: 'darkred', text: 'Permanent Ban'},
            {key: 'botban', color: 'black', text: 'Bot Ban'}
        ];

        // Methods and stuff

        if (!String.prototype.format) {
            String.prototype.format = function() {
                var args = arguments;
                return this.replace(/{(\d+)}/g, function(match, number) {
                    return typeof args[number] != 'undefined' ? args[number] : match;
                });
            };
        }


        // Puts important debug information in a object so we can easily include it in /r/toolbox posts and comments when people need support.

        TBUtils.debugInformation = function debugInformation() {
        // Using console log so we are more likely to get this information if toolbox is failing.
            console.log('debug information for browser');
            let debugObject = {
                toolboxVersion : TBUtils.toolboxVersion,
                browser: '',
                browserVersion: '',
                platformInformation: '',
                betaMode: TBUtils.betaMode,
                debugMode: TBUtils.debugMode,
                compactMode: TBStorage.getSetting('Modbar', 'compactHide', false),
                advancedSettings: TBUtils.advancedMode,
                cookiesEnabled: navigator.cookieEnabled
            };

            const browserUserAgent = navigator.userAgent;
            let browserMatchedInfo = [];
            switch (TBUtils.browser) {
            case CHROME: {
                // Let's first make sure we are actually dealing with chrome and not some other chrome fork that also supports extension.
                // This way we can also cut some support requests short.
                const vivaldiRegex = new RegExp(/\((.*?)\).*Vivaldi\/([0-9.]*?)$/);
                const yandexRegex = new RegExp(/\((.*?)\).*YaBrowser\/([0-9.]*).*$/);
                const chromeRegex = new RegExp(/\((.*?)\).*Chrome\/([0-9.]*).*$/);
                if (navigator.userAgent.indexOf(' Vivaldi/') >= 0 && vivaldiRegex.test(browserUserAgent)) { // Vivaldi
                    browserMatchedInfo = browserUserAgent.match(vivaldiRegex);
                    debugObject.browser = 'Vivaldi';
                    debugObject.browserVersion = browserMatchedInfo[2];
                    debugObject.platformInformation = browserMatchedInfo[1];

                } else if (navigator.userAgent.indexOf(' YaBrowser/') >= 0 && yandexRegex.test(browserUserAgent)) { // Yandex
                    browserMatchedInfo = browserUserAgent.match(yandexRegex);
                    debugObject.browser = 'Yandex';
                    debugObject.browserVersion = browserMatchedInfo[2];
                    debugObject.platformInformation = browserMatchedInfo[1];

                } else if (chromeRegex.test(browserUserAgent)){
                    browserMatchedInfo = browserUserAgent.match(chromeRegex);
                    debugObject.browser = 'Chrome';
                    debugObject.browserVersion = browserMatchedInfo[2];
                    debugObject.platformInformation = browserMatchedInfo[1];
                } else {
                    debugObject.browser = 'Chrome derivative';
                    debugObject.browserVersion = 'Unknown';
                    debugObject.platformInformation = browserUserAgent;
                }
                break;
            }
            case FIREFOX: {
                const firefoxRegex = new RegExp(/\((.*?)\).*Firefox\/([0-9.]*?)$/);
                const firefoxDerivativeRegex = new RegExp(/\((.*?)\).*(Firefox\/[0-9.].*?)$/);
                if(firefoxRegex.test(browserUserAgent)) {
                    browserMatchedInfo = browserUserAgent.match(firefoxRegex);
                    debugObject.browser = 'Firefox';
                    debugObject.browserVersion = browserMatchedInfo[2];
                    debugObject.platformInformation = browserMatchedInfo[1];
                } else if (firefoxDerivativeRegex.test(browserUserAgent)) {
                    browserMatchedInfo = browserUserAgent.match(firefoxDerivativeRegex);
                    debugObject.browser = 'Firefox derivative';
                    debugObject.browserVersion = browserMatchedInfo[2];
                    debugObject.platformInformation = browserMatchedInfo[1];
                } else {
                    debugObject.browser = 'Firefox derivative';
                    debugObject.browserVersion = 'Unknown';
                    debugObject.platformInformation = browserUserAgent;
                }
                break;
            }
            case OPERA: {
                browserMatchedInfo = browserUserAgent.match(/\((.*?)\).*OPR\/([0-9.]*?)$/);
                debugObject.browser = 'Opera';
                debugObject.browserVersion = browserMatchedInfo[2];
                debugObject.platformInformation = browserMatchedInfo[1];
                break;
            }
            case SAFARI: {
                browserMatchedInfo = browserUserAgent.match(/\((.*?)\).*Safari\/([0-9.]*?)$/);
                debugObject.browser = 'Safari';
                debugObject.browserVersion = browserMatchedInfo[2];
                debugObject.platformInformation = browserMatchedInfo[1];
                break;
            }
            case EDGE: {
                browserMatchedInfo = browserUserAgent.match(/\((.*?)\).*Edge\/([0-9.]*?)$/);
                debugObject.browser = 'Edge';
                debugObject.browserVersion = browserMatchedInfo[2];
                debugObject.platformInformation = browserMatchedInfo[1];
                break;
            }
            case UNKOWN_BROWSER: {
                debugObject.browser = 'Unknown';
                debugObject.browserVersion = 'Unknown';
                debugObject.platformInformation = browserUserAgent;
                break;
            }
            default: {
            // This should really never happen, but just in case I left it in.
                debugObject.browser = 'Error in browser detection';
                debugObject.browserVersion = 'Unknown';
                debugObject.platformInformation = browserUserAgent;
            }
            }

            console.log(debugObject);
            return debugObject;
        };



        TBUtils.getToolboxDevs = function getToolboxDevs() {
            getToolboxDevs();
        };

        TBUtils.sendEvent = function (tbuEvent){
            $.log(`Sending event: ${tbuEvent}`, false, SHORTNAME);
            window.dispatchEvent( new CustomEvent(tbuEvent) );
        };

        TBUtils.catchEvent = function (tbuEvent, callback){
            if (!callback) return;

            window.addEventListener(tbuEvent, callback);
        };

        // https://github.com/brownieboy/array.prototype.move/blob/master/src/array-prototype-move.js
        TBUtils.moveArrayItem = function moveArrayItem(array, old_index, new_index) {
            if ( array.length === 0 ) {
                return array;
            }
            while (old_index < 0) {
                old_index += array.length;
            }
            while (new_index < 0) {
                new_index += array.length;
            }
            if (new_index >= array.length) {
                var k = new_index - array.length;
                while ((k--) + 1) {
                    array.push(undefined);
                }
            }
            array.splice(new_index, 0, array.splice(old_index, 1)[0]);
            return array;
        };

        TBUtils.escapeHTML = function(html)
        {
            var entityMap = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;'
            };

            return String(html).replace(/[&<>"'\/]/g, function (s) {
                return entityMap[s];
            });
        };

        TBUtils.unescapeHTML = function(html)
        {
            var entityMap = {
                '&amp;': '&',
                '&lt;': '<',
                '&gt;': '>',
                '&quot;': '"',
                '&#39;': "'",
                '&#x2F;' : '/'
            };

            return String(html).replace(/[&<>"'\/]/g, function (s) {
                return entityMap[s];
            });
        };

        TBUtils.getTime = function() {
            return new Date().getTime();
        };

        TBUtils.getRandomNumber = function(maxInt){
            return Math.floor((Math.random() * maxInt) + 1);
        };

        //
        TBUtils.minutesToMilliseconds = function (mins) {
            var oneMin = 60000,
                milliseconds = mins * 60 * 1000;

            // Never return less than one min.
            if (milliseconds < oneMin) {
                milliseconds = oneMin;
            }

            return milliseconds;
        };

        TBUtils.daysToMilliseconds = function (days) {
            return days * 86400000;
        };

        TBUtils.millisecondsToDays = function (milliseconds) {
            return milliseconds / 86400000;
        };

        // convert unix epoch timestamps to ISO format
        TBUtils.timeConverterISO = function (UNIX_timestamp) {
            var a = new Date(UNIX_timestamp * 1000);
            var year = a.getFullYear();
            var month = (`0${a.getUTCMonth() + 1}`).slice(-2);
            var date = (`0${a.getUTCDate()}`).slice(-2);
            var hour = (`0${a.getUTCHours()}`).slice(-2);
            var min = (`0${a.getUTCMinutes()}`).slice(-2);
            var sec = (`0${a.getUTCSeconds()}`).slice(-2);
            return `${year}-${month}-${date}T${hour}:${min}:${sec}Z`;
        };

        TBUtils.niceDateDiff = function(origdate, newdate) {
            // Enter the month, day, and year below you want to use as
            // the starting point for the date calculation
            if (!newdate) {
                newdate = new Date();
            }

            var amonth = origdate.getUTCMonth() + 1;
            var aday = origdate.getUTCDate();
            var ayear = origdate.getUTCFullYear();

            var tyear = newdate.getUTCFullYear();
            var tmonth = newdate.getUTCMonth() + 1;
            var tday = newdate.getUTCDate();

            var y = 1;
            var mm = 1;
            var d = 1;
            var a2 = 0;
            var a1 = 0;
            var f = 28;

            if (((tyear % 4 === 0) && (tyear % 100 !== 0)) || (tyear % 400 === 0)) {
                f = 29;
            }

            var m = [31, f, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            var dyear = tyear - ayear;

            var dmonth = tmonth - amonth;
            if (dmonth < 0 && dyear > 0) {
                dmonth = dmonth + 12;
                dyear--;
            }

            var dday = tday - aday;
            if (dday < 0) {
                if (dmonth > 0) {
                    var ma = amonth + tmonth;

                    if (ma >= 12) {
                        ma = ma - 12;
                    }
                    if (ma < 0) {
                        ma = ma + 12;
                    }
                    dday = dday + m[ma];
                    dmonth--;
                    if (dmonth < 0) {
                        dyear--;
                        dmonth = dmonth + 12;
                    }
                } else {
                    dday = 0;
                }
            }

            var returnString = '';

            if (dyear === 0) {
                y = 0;
            }
            if (dmonth === 0) {
                mm = 0;
            }
            if (dday === 0) {
                d = 0;
            }
            if ((y === 1) && (mm === 1)) {
                a1 = 1;
            }
            if ((y === 1) && (d === 1)) {
                a1 = 1;
            }
            if ((mm === 1) && (d === 1)) {
                a2 = 1;
            }
            if (y === 1) {
                if (dyear === 1) {
                    returnString += `${dyear} year`;
                } else {
                    returnString += `${dyear} years`;
                }
            }
            if ((a1 === 1) && (a2 === 0)) {
                returnString += ' and ';
            }
            if ((a1 === 1) && (a2 === 1)) {
                returnString += ', ';
            }
            if (mm === 1) {
                if (dmonth === 1) {
                    returnString += `${dmonth} month`;
                } else {
                    returnString += `${dmonth} months`;
                }
            }
            if (a2 === 1) {
                returnString += ' and ';
            }
            if (d === 1) {
                if (dday === 1) {
                    returnString += `${dday} day`;
                } else {
                    returnString += `${dday} days`;
                }
            }
            if (returnString === '') {
                returnString = '0 days';
            }
            return returnString;
        };

        // convert unix epoch timestamps to readable format dd-mm-yyyy hh:mm:ss UTC
        TBUtils.timeConverterRead = function (UNIX_timestamp) {
            var a = new Date(UNIX_timestamp * 1000);
            var year = a.getFullYear();
            var month = (`0${a.getUTCMonth() + 1}`).slice(-2);
            var date = (`0${a.getUTCDate()}`).slice(-2);
            var hour = (`0${a.getUTCHours()}`).slice(-2);
            var min = (`0${a.getUTCMinutes()}`).slice(-2);
            var sec = (`0${a.getUTCSeconds()}`).slice(-2);
            return `${date}-${month}-${year} ${hour}:${min}:${sec} UTC`;
        };

        // convert titles to a format usable in urls
        // from r2.lib.utils import title_to_url
        TBUtils.title_to_url = function (title) {
            var max_length = 50;

            title = title.replace(/\s+/g, '_');     //remove whitespace
            title = title.replace(/\W+/g, '');      //remove non-printables
            title = title.replace(/_+/g, '_');      //remove double underscores
            title = title.replace(/^_+|_+$/g, '');  //remove trailing underscores
            title = title.toLowerCase();            //lowercase the title

            if (title.length > max_length) {
                title = title.substr(0, max_length);
                title = title.replace(/_[^_]*$/g, '');
            }

            return title || '_';
        };

        // Easy way to use templates. Usage example:
        //    TBUtils.template('/r/{{subreddit}}/comments/{{link_id}}/{{title}}/', {
        //                'subreddit': 'toolbox',
        //                'title':  title_to_url('this is a title we pulled from a post),
        //                'link_id': '2kwx2o'
        //            });
        TBUtils.template = function (tpl, variables) {
            return tpl.replace(/{{([^}]+)}}/g, function (match, variable) {
                return variables[variable];
            });
        };


        TBUtils.alert = function (message, callback, showClose) {
            var $noteDiv = $(`<div id="tb-notification-alert"><span>${message}</span></div>`);
            if (showClose) {
                $noteDiv.append(`<img src="data:image/png;base64,${TBui.iconClose}" class="note-close" title="Close" />`);
            }
            $noteDiv.appendTo('body');

            $noteDiv.click(function (e) {
                $noteDiv.remove();
                if (e.target.className === 'note-close') {
                    callback(false);
                    return;
                }
                callback(true);
            });
        };


        TBUtils.showNote = function (note) {
            if (!note.id || !note.text) return;

            function show() {
                if ($.inArray(note.id, seenNotes) === -1) {
                //TBStorage.setSetting(SETTINGS_NAME, 'noteLastShown', now);

                    TBUtils.alert(note.text, function (resp) {
                        seenNotes.push(note.id);
                        TBStorage.setSetting(SETTINGS_NAME, 'seenNotes', seenNotes);
                        if (note.link && note.link.match(/^(https?\:|\/)/i) && resp) window.open(note.link);
                    }, false);
                }
            }

            //platform check.
            switch (note.platform) {
            case 'firefox':
                if (TBUtils.browser == FIREFOX && TBUtils.isExtension) show();
                break;
            case 'chrome':
                if (TBUtils.browser == CHROME && TBUtils.isExtension) show();
                break;
            case 'opera':
                if (TBUtils.browser == OPERA && TBUtils.isExtension) show();
                break;
            case 'safari':
                if (TBUtils.browser == SAFARI && TBUtils.isExtension) show();
                break;
            case 'edge':
                if (TBUtils.browser == EDGE && TBUtils.isExtension) show();
                break;
            case 'script':
                if (!TBUtils.isExtension) show();
                break;
            case 'all':
                show();
                break;
            default:
                show();
            }
        };


        TBUtils.notification = function (title, body, url, markreadid) {
            var timeout = 10000;

            var toolboxnotificationenabled = true;

            // check if notifications are enabled. When they are not we simply abort the function.
            if (toolboxnotificationenabled === false) {
            //console.log('notifications disabled, stopping function');
                return;
            }

            if (!('Notification' in window) || TBUtils.browser == EDGE) {
            // fallback on a javascript notification
                $.log('boring old rickety browser (or Edge), falling back on jquery based notifications', false, SHORTNAME);
                body = body.substring(0, 600);
                body = body.replace(/(?:\r\n|\r|\n)/g, '<br />');
                $.sticky(`<p>${body}</p>`, title, url, {'autoclose': timeout, 'markreadid': markreadid});

            } else if (Notification.permission === 'granted') {

                var notification = new Notification(title, {
                    dir: 'auto',
                    body: body,
                    icon: `data:image/png;base64,${TBui.logo64}`
                });
                setTimeout(function () {
                    notification.close();
                }, timeout);

                notification.onclick = function () {
                // Open the page
                    $.log('notification clicked', false, SHORTNAME);
                    if (typeof markreadid !== 'undefined') {
                        $.post(`${TBUtils.baseDomain}/api/read_message`, {
                            id: markreadid,
                            uh: TBUtils.modhash,
                            api_type: 'json'
                        });
                    }

                    open(url);
                    // Remove notification
                    this.close();
                };

            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission(function (permission) {

                // Whatever the user answers, we make sure we store the information
                    if (!('permission' in Notification)) {
                        Notification.permission = permission;
                    }

                    // If the user is okay, let's create a notification
                    if (permission === 'granted') {
                        var notification = new Notification(title, {
                            dir: 'auto',
                            body: body,
                            icon: `data:image/png;base64,${TBui.logo64}`
                        });
                        setTimeout(function () {
                            notification.close();
                        }, timeout);

                        notification.onclick = function () {
                        // Open the page
                            $.log('notification clicked', false, SHORTNAME);
                            if (typeof markreadid !== 'undefined') {
                                $.post(`${TBUtils.baseDomain}/api/read_message`, {
                                    id: markreadid,
                                    uh: TBUtils.modhash,
                                    api_type: 'json'
                                });
                            }
                            open(url);
                            // Remove notification
                            this.close();
                        };
                    }
                });
            } else {
            // They have the option enabled, but won't grant permissions, so fall back.
                body = body.replace(/(?:\r\n|\r|\n)/g, '<br />');
                body = body.substring(0, 600);
                $.sticky(`<p>${body}</p>`, title, url, {'autoclose': timeout, 'markreadid': markreadid});
            }
        };


        TBUtils.humaniseDays = function (diff) {
            var str = '';
            var values = {
                ' year': 365,
                ' month': 30,
                ' week': 7,
                ' day': 1
            };

            for (var x in values) {
                var amount = Math.floor(diff / values[x]);

                if (amount >= 1) {
                    str += `${amount + x + (amount > 1 ? 's' : '')} `;
                    diff -= amount * values[x];
                }
            }
            return str.slice(0, -1);
        };

        TBUtils.stringFormat = function(format) {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
        };


        TBUtils.sortBy = function (arr, prop) {
            return arr.sort(function (a, b) {
                if (a[prop] < b[prop]) return 1;
                if (a[prop] > b[prop]) return -1;
                return 0;
            });
        };

        TBUtils.getHead = function (url, doneCallback) {
            $.ajax({
                type: 'HEAD',
                url: TBUtils.baseDomain + url
            })
                .done(function (data, status, jqxhr) {
                // data isn't needed; just the tip
                    doneCallback(status, jqxhr);
                });
        };

        // Because normal .sort() is case sensitive.
        TBUtils.saneSort = function (arr) {
            return arr.sort(function (a, b) {
                if (a.toLowerCase() < b.toLowerCase()) return -1;
                if (a.toLowerCase() > b.toLowerCase()) return 1;
                return 0;
            });
        };


        TBUtils.saneSortAs = function (arr) {
            return arr.sort(function (a, b) {
                if (a.toLowerCase() > b.toLowerCase()) return -1;
                if (a.toLowerCase() < b.toLowerCase()) return 1;
                return 0;
            });
        };

        TBUtils.replaceAll = function (find, replace, str) {
            find = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
            return str.replace(new RegExp(find, 'g'), replace);
        };

        TBUtils.cleanSubredditName = function (dirtySub) {
            dirtySub = dirtySub.replace('/r/', '').replace('r/', '').replace('/', '').replace('−', '').replace('+', '').trim();
            return dirtySub;
        };


        TBUtils.getModSubs = function (callback) {
            $.log('getting mod subs', false, SHORTNAME);
            // If it has been more than ten minutes, refresh mod cache.
            if (TBUtils.mySubs.length < 1 || TBUtils.mySubsData.length < 1) {
            // time to refresh
                if (gettingModSubs) {
                // we're already fetching a new list, so enqueue the callback
                    $.log('Enqueueing getModSubs callback', false, SHORTNAME);
                    getModSubsCallbacks.push(callback);
                } else {
                // start the process
                    $.log('getting new subs.', false, SHORTNAME);

                    gettingModSubs = true;
                    TBUtils.mySubs = []; // reset
                    TBUtils.mySubsData = [];
                    getSubs(modMineURL);
                }
            } else {
            // run callback on cached sublist
                TBUtils.mySubs = TBUtils.saneSort(TBUtils.mySubs);
                TBUtils.mySubsData = TBUtils.sortBy(TBUtils.mySubsData, 'subscribers');
                // Go!
                callback();
            }

            function getSubs(URL) {
                $.getJSON(TBUtils.baseDomain + URL, function (json) {
                    getSubsResult(json.data.children, json.data.after);
                });
            }

            // Callback because reddits/mod/mine is paginated.
            function getSubsResult(subs, after) {
                $(subs).each(function () {
                    var sub = this.data.display_name.trim();
                    if ($.inArray(sub, TBUtils.mySubs) === -1) {
                        TBUtils.mySubs.push(sub);
                    }

                    var isinthere = false;
                    $(TBUtils.mySubsData).each(function () {
                        if (this.subreddit === sub) {
                            isinthere = true;
                        }
                    });

                    if (!isinthere) {
                        var subredditData = {
                            'subreddit': sub,
                            'subscribers': this.data.subscribers,
                            'over18': this.data.over18,
                            'created_utc': this.data.created_utc,
                            'subreddit_type': this.data.subreddit_type,
                            'submission_type': this.data.submission_type
                        };

                        TBUtils.mySubsData.push(subredditData);
                    }
                });

                if (after) {
                    var URL = `${modMineURL}&after=${after}`;
                    getSubs(URL);
                } else {
                    TBUtils.mySubs = TBUtils.saneSort(TBUtils.mySubs);
                    TBUtils.mySubsData = TBUtils.sortBy(TBUtils.mySubsData, 'subscribers');
                    // Update the cache.
                    TBStorage.setCache(SETTINGS_NAME, 'moderatedSubs', TBUtils.mySubs);
                    TBStorage.setCache(SETTINGS_NAME, 'moderatedSubsData', TBUtils.mySubsData);

                    callback();
                    // no idea what the following shit is.
                    // Go!
                    while (getModSubsCallbacks.length > 0) {
                    // call them in the order they were added
                        $.log(`calling callback ${getModSubsCallbacks[0].name}`, false, SHORTNAME);
                        getModSubsCallbacks[0]();
                        getModSubsCallbacks.splice(0, 1); // pop first element
                    }
                    // done
                    gettingModSubs = false;
                }
            }
        };

        TBUtils.modSubCheck = function(callback) {
            TBUtils.getModSubs(function () {
                const subCount = TBUtils.mySubsData.length;
                let subscriberCount = 0;
                TBUtils.mySubsData.forEach(function(subreddit) {
                    subscriberCount += subreddit.subscribers;
                });
                subscriberCount -= subCount;
                if (subscriberCount > 25) {
                    return callback(true);
                } else {
                    return callback(false);
                }

            });
        };

        TBUtils.modsSub = function (subreddit) {
            return $.inArray(subreddit, TBUtils.mySubs) > -1;
        };

        TBUtils.getHashParameter = function(ParameterKey)
        {
            var hash = window.location.hash.substring(1);
            var params = hash.split('&');
            for (var i = 0; i < params.length; i++)
            {
                var keyval = params[i].split('='),
                    key = keyval[0].replace('?','');
                if (key == ParameterKey)
                {
                    return keyval[1];
                }
            }
        };

        TBUtils.getThingInfo = function (sender, modCheck) {

        // declare what we will need.
            var $sender = $(sender);
            var $body = $('body');

            var subreddit,
                permalink,
                domain,
                id,
                body,
                title,
                kind,
                postlink,
                banned_by,
                spam,
                ham,
                user,
                removal,
                approved_text,
                approved_by = [],
                $textBody;
            // First we check if we are in new modmail thread and for now we take a very simple.
            // Everything we need info for is centered around threads.
            if (TBUtils.isNewModmail) {



            // Lack of a better name, can be a thread_message or infobar.
                var $threadBase = $($sender.closest('.Thread__message')[0] || $sender.find('.InfoBar')[0] || $sender);
                var browserUrl = window.location.href;


                var idRegex = new RegExp('.*mod\.reddit\.com\/mail\/.*?\/(.*?)$', 'i');

                subreddit = $body.find('.ThreadTitle__community').text();
                permalink = ($threadBase.find('.m-link').length ? `https://mod.reddit.com${$threadBase.find('.m-link').attr('href')}` : `https://mod.reddit.com/mail/perma/${browserUrl.match(idRegex)[1]}`);
                id = browserUrl.match(idRegex)[1];

                // Funny story, there is currently no functionality in new modmail that can make use of the body.
                // Macros look at the sidebar and other modules don't need the body.
                // Todo: Figure out what body to present when activated from modmacro.
                $textBody = $threadBase.find('.Message__body .md').clone();
                console.log($textBody);
                $textBody.find('.RESUserTag, .voteWeight, .keyNavAnnotation').remove();
                body = $textBody.text() || '';
                body = body.replace(/^\s+|\s+$/g, '');
                $textBody.remove();
                title = $body.find('.ThreadTitle__title').text();
                kind = $threadBase.hasClass('.Thread__message') ? 'modmailmessage' : 'modmailthread';
                spam = false;
                ham = false;
                user = $threadBase.find('.Message__author').text() || $body.find('.InfoBar__username').text();
            } else {
            // do our regular stuff to gather data.


            // If we were passed in a .thing, we may have to walk down the tree to
            // find the associated .entry


                var $entry = $($sender.closest('.entry')[0] || $sender.find('.entry')[0] || $sender);
                var $thing = $($sender.closest('.thing')[0] || $sender);

                user = $entry.find('.author:first').text() || $thing.find('.author:first').text();
                subreddit = $thing.data('subreddit') || TBUtils.post_site || $entry.find('.subreddit:first').text() || $thing.find('.subreddit:first').text() || $entry.find('.tagline .head b > a[href^="/r/"]:not(.moderator)').text();
                permalink = $entry.find('a.bylink').attr('href') || $entry.find('.buttons:first .first a').attr('href') || $thing.find('a.bylink').attr('href') || $thing.find('.buttons:first .first a').attr('href');
                domain = ($entry.find('span.domain:first').text() || $thing.find('span.domain:first').text()).replace('(', '').replace(')', '');
                id = $entry.attr('data-fullname') || $thing.attr('data-fullname') || $sender.closest('.usertext').find('input[name=thing_id]').val();
                $textBody = $entry.find('.usertext-body:first').clone() || $thing.find('.usertext-body:first').clone();
                $textBody.find('.RESUserTag, .voteWeight, .keyNavAnnotation').remove();
                body = $textBody.text() || '';
                body = body.replace(/^\s+|\s+$/g, '');

                $textBody.remove();


                // These need some fall backs, but only removal reasons use them for now.
                title = $thing.find('a.title').length ? $thing.find('a.title').text() : '';
                kind = $thing.hasClass('link') ? 'submission' : 'comment';
                postlink = $thing.find('a.title').attr('href');

                // removed? spam or ham?
                removal = ($entry.find('.flat-list.buttons li b:contains("removed by")').text() || '').match(/removed by (.+) \(((?:remove not |confirm )?spam)/) || [];

                banned_by = removal[1] || '';
                spam = removal[2] == 'spam' || removal[2] == 'confirm spam';
                ham = removal[2] == 'remove not spam';

                if (TBUtils.isEditUserPage && !user) {
                    user = $sender.closest('.user').find('a:first').text() || $entry.closest('.user').find('a:first').text() || $thing.closest('.user').find('a:first').text();
                }

                // If we still don't have a sub, we're in mod mail, or PMs.
                if (TBUtils.isModmail || $sender.closest('.message-parent')[0] !== undefined) {
                // Change it to use the parent's title.
                    title = $sender.find('.subject-text:first').text();

                    subreddit = (subreddit) ? subreddit : ($entry.find('.head a:last').text() || $thing.find('.head a:last').text());

                    //This is a weird palce to go about this, and the conditions are strange,
                    //but if we're going to assume we're us, we better make damned well sure that is likely the case.
                    // if ($entry.find('.remove-button').text() === '') {
                    // The previous check would mistakenly catch removed modmail messages as the user's messages.
                    // This check should be safe, since the only time we get no username in modmail is the user's own message. -dakta
                    // The '.message-parent' check fixes reddit.com/message/messages/, which contains mod mail and PMs.

                    // There are two users in the tagline, the first one is the user sending the message so we want to target that user.
                    user = $entry.find('.sender a.author').text();

                    // If there is only one use present and it says "to" it means that this is not the user sending the message.

                    if ($entry.find('.sender a.author').length < 1 && $entry.find('.recipient a.author').length > 0) {
                        user = TBUtils.logged;
                    }

                    if (user === '') {
                        user = TBUtils.logged;

                        if (!subreddit || subreddit.indexOf('/r/') < 1) {
                        // Find a better way, I double dog dare ya!
                            subreddit = $thing.closest('.message-parent').find('.correspondent.reddit.rounded a').text();
                        }
                    }
                }
                approved_text = $entry.find('.approval-checkmark').attr('title') || $thing.find('.approval-checkmark').attr('title') || '',
                approved_by = approved_text.match(/by\s(.+?)\s/) || '';
            }
            // A recent reddit change makes subreddit names sometimes start with "/r/".
            // Mod mail subreddit names additionally end with "/".
            // reddit pls, need consistency
            subreddit = TBUtils.cleanSubredditName(subreddit);

            // Not a mod, reset current sub.
            if (modCheck && $.inArray(subreddit, TBUtils.mySubs) === -1) {
                subreddit = '';
            }

            if (user == '[deleted]') {
                user = '';
            }



            // If the permalink is relative, stick the current domain name in.
            // Only do so if a permalink is found.
            if (permalink && permalink.slice(0,1) == '/')
            {
                permalink = TBUtils.baseDomain + permalink;
            }

            var info = {
                subreddit: subreddit,
                user: user,
                author: user,
                permalink: permalink,
                url: permalink,
                domain: domain,
                id: id,
                body: `> ${body.split('\n').join('\n> ')}`,
                raw_body: body,
                uri_body: encodeURIComponent(body).replace(/\)/g, '\\)'),
                approved_by: approved_by[1],
                title: title,
                uri_title: encodeURIComponent(title).replace(/\)/g, '\\)'),
                kind: kind,
                postlink: postlink,
                link: postlink,
                banned_by: banned_by,
                spam: spam,
                ham: ham,
                rules: subreddit ? `${TBUtils.baseDomain}/r/${subreddit}/about/rules` : '',
                sidebar: subreddit ? `${TBUtils.baseDomain}/r/${subreddit}/about/sidebar` : '',
                wiki: subreddit ? `${TBUtils.baseDomain}/r/${subreddit}/wiki/index` : '',
                mod: TBUtils.logged
            };
            //$.log(info, false, SHORTNAME);
            return info;
        };

        TBUtils.replaceTokens = function (info, content) {
            $.log(info, false, SHORTNAME);
            for (var i in info) {
                var pattern = new RegExp(`{${i}}`, 'mig');
                content = content.replace(pattern, info[i]);
            }

            return content;
        };


        // Prevent page lock while parsing things.  (stolen from RES)
        TBUtils.forEachChunked = function (array, chunkSize, delay, call, complete, start) {
            if (array === null) finish();
            if (chunkSize === null || chunkSize < 1) finish();
            if (delay === null || delay < 0) finish();
            if (call === null) finish();
            var counter = 0;
            //var length = array.length;

            function doChunk() {
                if (counter == 0 && start) {
                    start();
                }

                for (var end = Math.min(array.length, counter + chunkSize); counter < end; counter++) {
                    var ret = call(array[counter], counter, array);
                    if (ret === false) return window.setTimeout(finish, delay);
                }
                if (counter < array.length) {
                    window.setTimeout(doChunk, delay);
                } else {
                    window.setTimeout(finish, delay);
                }
            }

            window.setTimeout(doChunk, delay);

            function finish() {
                return complete ? complete() : false;
            }
        };


        // Chunking abused for ratelimiting
        TBUtils.forEachChunkedRateLimit = function (array, chunkSize, call, complete, start) {
            if (array === null) finish();
            if (chunkSize === null || chunkSize < 1) finish();
            if (call === null) finish();

            var length = array.length,
                counter = 0,
                delay = 100,
                limit = (length > chunkSize) ? 20 : 0;


            if (length < chunkSize) {
                chunkSize = length;
            }

            function doChunk() {
                if (counter == 0 && start) {
                    start();
                }

                for (var end = Math.min(array.length, counter + chunkSize); counter < end; counter++) {
                    var ret = call(array[counter], counter, array);
                    if (ret === false) return window.setTimeout(finish, delay);
                }
                if (counter < array.length) {
                    window.setTimeout(getRatelimit, delay);
                } else {
                    window.setTimeout(finish, delay);
                }
            }

            function getRatelimit() {
            //return doChunk();
                TBUtils.getHead('/r/toolbox/wiki/ratelimit.json',
                    function (status, jqxhr) {
                        var $body = $('body'),
                            ratelimitRemaining = jqxhr.getResponseHeader('x-ratelimit-remaining'),
                            ratelimitReset = jqxhr.getResponseHeader('x-ratelimit-reset');
                        $.log(`ratelimitRemaining: ${ratelimitRemaining} ratelimitReset: ${ratelimitReset / 60}`, false, SHORTNAME);

                        if (!$body.find('#ratelimit-counter').length) {
                            $('div[role="main"].content').append('<span id="ratelimit-counter"></span>');
                        }

                        if (chunkSize + limit > parseInt(ratelimitRemaining)) {
                            $body.find('#ratelimit-counter').show();
                            var count = parseInt(ratelimitReset),
                                counter = 0;

                            function timer() {
                                count = count - 1;
                                if (count <= 0) {
                                    clearInterval(counter);
                                    $body.find('#ratelimit-counter').empty();
                                    $body.find('#ratelimit-counter').hide();
                                    doChunk();
                                    return;
                                }

                                var minutes = Math.floor(count / 60);
                                var seconds = count - minutes * 60;

                                $body.find('#ratelimit-counter').html(`<b>Oh dear, it seems we have hit a limit, waiting for ${minutes} minutes and ${seconds} seconds before resuming operations.</b>
                    <br><br>
                    <span class="rate-limit-explain"><b>tl;dr</b> <br> Reddit's current ratelimit allows for <i>${ratelimitRemaining} requests</i>. We are currently trying to process <i>${parseInt(chunkSize)} items</i>. Together with toolbox requests in the background that is cutting it a little bit too close. Luckily for us reddit tells us when the ratelimit will be reset, that is the timer you see now.</span>
                    `);
                            }

                            counter = setInterval(timer, 1000);

                        } else {
                            doChunk();
                        }
                    });
            }

            getRatelimit();

            function finish() {
                return complete ? complete() : false;
            }
        };

        TBUtils.forEachChunkedDynamic = function(array, process, options){
            if(typeof process !== 'function') return;
            var arr = Array.from(array),
                start,
                stop,
                fr,
                started = false,
                opt = Object.assign({
                    size: 25, //starting size
                    framerate: 30, //target framerate
                    nerf: 0.9, //Be careful with this one
                }, options),
                size = opt.size,
                nerf = opt.nerf,
                framerate = opt.framerate,

                now = function(){ return window.performance.now(); },

                again = (typeof window.requestAnimationFrame == 'function')?
                    function(callback){ window.requestAnimationFrame(callback); }:
                    function(callback){ setTimeout(callback, 1000/opt.framerate); },

                optimize = function(){
                    stop = now();
                    fr = 1000/(stop - start);
                    size = Math.ceil(size*(1 + (fr/framerate - 1)*nerf));
                    return (start = stop);
                };

            return new Promise(function(resolve){
                var doChunk = function(){
                    if (started){
                        optimize();
                    } else {
                        started = true;
                    }

                    arr.splice(0, size).forEach(process);

                    if (arr.length) return again( doChunk );
                    return resolve(array);
                };
                start = now();
                again( doChunk );
            });
        };

        TBUtils.reloadToolbox = function () {
            if (typeof chrome !== 'undefined') {
                TBui.textFeedback('toolbox is reloading', TBui.FEEDBACK_POSITIVE, 10000, TBui.DISPLAY_BOTTOM);
                chrome.runtime.sendMessage({action: 'tb-reload'}, function () {
                    window.location.reload();
                });
            }
        };

        //
        // Reddit Oauth api stuff
        //

        // Generic promise based POST request. Can be used to construct all api calls involving post.
        // Example usage:
        //
        // TBUtils.apiOauthPOST('api/mod/conversations', {
        //     body: 'sending this with the new api through toolbox',
        //     subject: 'api testing',
        //     srName: 'toolbox'
        // }).then(function(data) {
        //     console.log(data)
        // }).catch(function(error) {
        //     console.log(error)
        // });

        TBUtils.apiOauthPOST = function apiOauthPost(endpoint, data) {
            // let's fetch the token we need first.
            return TBUtils.oauthToken().then(function(token) {
                return $.ajax({
                    url: `https://oauth.reddit.com/${endpoint}`,
                    type: 'POST',
                    data: data,
                    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', `bearer ${token}`);},
                }).then(function(data, textStatus, jqXHR) {
                    return {
                        data: data,
                        textStatus: textStatus,
                        jqXHR: jqXHR
                    };
                }, function(jqXHR, textStatus, errorThrown) {
                    throw {
                        jqXHR: jqXHR,
                        textStatus: textStatus,
                        errorThrown: errorThrown
                    };

                });
            });
        };

        // Generic promise based POST request. Can be used to construct all api calls involving post.
        TBUtils.apiOauthGET = function apiOauthPost(endpoint, data) {
            // let's fetch the token we need first.
            return TBUtils.oauthToken().then(function(token) {
                return $.ajax({
                    url: `https://oauth.reddit.com/${endpoint}`,
                    type: 'GET',
                    data: data,
                    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', `bearer ${token}`);},
                }).then(function(data, textStatus, jqXHR) {
                    return {
                        data: data,
                        textStatus: textStatus,
                        jqXHR: jqXHR
                    };
                }, function(jqXHR, textStatus, errorThrown) {
                    throw {
                        jqXHR: jqXHR,
                        textStatus: textStatus,
                        errorThrown: errorThrown
                    };

                });
            });

        };


        //
        // Reddit 'legacy' API stuff. Still very much in use.
        //
        TBUtils.getRatelimit = function getRatelimit(callback) {
            TBUtils.getHead('/r/toolbox/wiki/ratelimit.json',
                function (status, jqxhr) {
                    var ratelimitRemaining = jqxhr.getResponseHeader('x-ratelimit-remaining'),
                        ratelimitReset = jqxhr.getResponseHeader('x-ratelimit-reset');
                    $.log(`ratelimitRemaining: ${ratelimitRemaining} ratelimitReset: ${ratelimitReset / 60}`, false, SHORTNAME);

                    if (typeof callback !== 'undefined') {
                        callback({
                            'ratelimitRemaining': ratelimitRemaining,
                            'ratelimitReset': ratelimitReset
                        });
                    }
                });
        };


        TBUtils.setWikiPrivate = function setWikiPrivate(page, subreddit, failAlert) {
            setWikiPrivate(subreddit, page, failAlert);
        };


        TBUtils.postToWiki = function postToWiki(page, subreddit, data, reason, isJSON, updateAM, callback) {
            if (reason) {
                reason = `"${reason}" via toolbox`;
            } else {
                reason = 'updated via toolbox';
            }

            if (isJSON) {
            // Not indenting saves precious bytes.
            //data = JSON.stringify(data, undefined, TBUtils.debugMode ? 2 : undefined);
                data = JSON.stringify(data);
            }

            $.log(`Posting /r/${subreddit}/api/wiki/edit/${page}`, false, SHORTNAME);


            // If we update automoderator we want to replace any tabs with four spaces.
            if (updateAM) {
                data = data.replace(/\t/g, '    ');
            }

            $.post(`${TBUtils.baseDomain}/r/${subreddit}/api/wiki/edit`, {
                content: data,
                page: page,
                reason: reason,
                uh: TBUtils.modhash
            })

                .fail(function postToWiki_error(jqXHR) {
                    $.log(jqXHR.responseText, false, SHORTNAME);
                    callback(false, jqXHR);
                })

                .done(function () {
                    setTimeout(function () {
                    // Callback regardless of what happens next.  We wrote to the page.
                    // In order to make sure the callback followup doesn't mess with the mod only call we let it wait a bit longer.

                        callback(true);

                    }, 750);

                    setTimeout(function () {


                    // Set page access to 'mod only'.
                        $.post(`${TBUtils.baseDomain}/r/${subreddit}/wiki/settings/`, {
                            page: page,
                            listed: true, //hrm, may need to make this a config setting.
                            permlevel: 2,
                            uh: TBUtils.modhash
                        })

                        // Super extra double-secret secure, just to be safe.
                            .fail(function () {
                                alert('error setting wiki page to mod only access');
                                window.location = `https://www.reddit.com/r/${subreddit}/wiki/settings/${page}`;
                            });

                    }, 500);
                });
        };


        // reddit HTML encodes all of their JSON responses, we need to HTMLdecode
        // them before parsing.
        TBUtils.unescapeJSON = function (val) {
            if (typeof(val) == 'string') {
                val = val.replace(/&quot;/g, '"')
                    .replace(/&gt;/g, '>').replace(/&lt;/g, '<')
                    .replace(/&amp;/g, '&');
            }
            return val;
        };


        TBUtils.readFromWiki = function (subreddit, page, isJSON, callback) {
        // We need to demangle the JSON ourselves, so we have to go about it this way :(
            $.ajax(`${TBUtils.baseDomain}/r/${subreddit}/wiki/${page}.json`, {
                dataType: 'json',
                dataFilter: function (data) {
                //TODO: right now a lot of functions implicitly rely on reddit
                //returning escaped JSON to operate safely. add this back in once
                //everything's been audited.

                //return TBUtils.unescapeJSON(data);
                    return data;
                }
            })
                .done(function (json) {
                    var wikiData = json.data.content_md;

                    if (!wikiData) {
                        callback(TBUtils.NO_WIKI_PAGE);
                        return;
                    }

                    if (isJSON) {
                        var parsedWikiData;
                        try {
                            parsedWikiData = JSON.parse(wikiData);
                        }
                        catch (err) {
                        // we should really have a INVAILD_DATA error for this.
                            $.log(err, false, SHORTNAME);
                            callback(TBUtils.NO_WIKI_PAGE);
                        }

                        // Moved out of the try so random exceptions don't erase the entire wiki page
                        if (parsedWikiData) {
                            callback(parsedWikiData);
                        } else {
                            callback(TBUtils.NO_WIKI_PAGE);
                        }

                        return;
                    }

                    // We have valid data, but it's not JSON.
                    callback(wikiData);

                })
                .fail(function (jqXHR, textStatus, e) {
                    $.log(`Wiki error (${subreddit}/${page}): ${e}`, false, SHORTNAME);
                    if (jqXHR.responseText === undefined) {
                        callback(TBUtils.WIKI_PAGE_UNKNOWN);
                        return;
                    }
                    let reason;
                    if (jqXHR.responseText.startsWith('<!doctype html>')) {
                        reason = 'WIKI_PAGE_UNKNOWN';
                    } else {
                        reason = JSON.parse(jqXHR.responseText).reason || '';
                    }

                    if (reason == 'PAGE_NOT_CREATED' || reason == 'WIKI_DISABLED') {
                        callback(TBUtils.NO_WIKI_PAGE);
                    } else {
                    // we don't know why it failed, we should not try to write to it.
                        callback(TBUtils.WIKI_PAGE_UNKNOWN);
                    }
                });
        };


        TBUtils.getBanState = function (subreddit, user, callback) {
            $.get(`${TBUtils.baseDomain}/r/${subreddit}/about/banned/.json`, {user: user}, function (data) {
                var banned = data.data.children;

                // If it's over or under exactly one item they are not banned or that is not their full name.
                if (banned.length !== 1) {
                    return callback(false);
                }

                callback(true, banned[0].note, banned[0].date, banned[0].name);
            });
        };


        TBUtils.flairPost = function (postLink, subreddit, text, cssClass, callback) {
            $.post(`${TBUtils.baseDomain}/api/flair`, {
                api_type: 'json',
                link: postLink,
                text: text,
                css_class: cssClass,
                r: subreddit,
                uh: TBUtils.modhash
            })
                .done(function () {
                    if (typeof callback !== 'undefined')
                        callback(true);
                })
                .fail(function (error) {
                    if (typeof callback !== 'undefined')
                        callback(false, error);
                });
        };

        TBUtils.flairUser = function (user, subreddit, text, cssClass, callback) {
            $.post(`${TBUtils.baseDomain}/api/flair`, {
                api_type: 'json',
                name: user,
                r: subreddit,
                text: text,
                css_class: cssClass,
                uh: TBUtils.modhash
            })
                .done(function () {
                    if (typeof callback !== 'undefined')
                        callback(true);
                })
                .fail(function (error) {
                    if (typeof callback !== 'undefined')
                        callback(false, error);
                });
        };

        TBUtils.friendUser = function (user, action, subreddit, banReason, banMessage, banDuration, callback) {
            const trimmedBanMessage = banMessage.length > 999 ? banMessage.substring(0, 999) : banMessage;
            const trimmedBanReason = banReason.length > 99 ? banReason.substring(0, 99) : banReason;
            if (banDuration) {
                if (banDuration > 999) {
                    banDuration = 999;
                }
                if (banDuration < 0) {
                    banDuration = 0;
                }
            }

            $.post(`${TBUtils.baseDomain}/api/friend`, {
                api_type: 'json',
                uh: TBUtils.modhash,
                type: action,
                name: user,
                r: subreddit,
                note: trimmedBanReason,
                ban_message: trimmedBanMessage,
                duration: banDuration
            })
                .done(function (response) {
                    if (typeof callback !== 'undefined')
                        callback(true, response);
                })
                .fail(function (error) {
                    if (typeof callback !== 'undefined')
                        callback(false, error);
                });
        };

        TBUtils.unfriendUser = function (user, action, subreddit, callback) {
            $.post(`${TBUtils.baseDomain}/api/unfriend`, {
                api_type: 'json',
                uh: TBUtils.modhash,
                type: action,
                name: user,
                r: subreddit
            })
                .done(function (response) {
                    if (typeof callback !== 'undefined')
                        callback(true, response);
                })
                .fail(function (error) {
                    if (typeof callback !== 'undefined')
                        callback(false, error);
                });
        };

        TBUtils.distinguishThing = function (id, sticky, callback) {
            $.post(`${TBUtils.baseDomain}/api/distinguish/yes`, {
                id: id,
                sticky: sticky,
                uh: TBUtils.modhash
            })
                .done(function () {
                    if (typeof callback !== 'undefined')
                        callback(true);
                })
                .fail(function (error) {
                    if (typeof callback !== 'undefined')
                        callback(false, error);
                });
        };


        TBUtils.approveThing = function (id, callback) {
            $.post(`${TBUtils.baseDomain}/api/approve`, {
                id: id,
                uh: TBUtils.modhash
            })
                .done(function () {
                    if (typeof callback !== 'undefined')
                        callback(true);
                })
                .fail(function (error) {
                    if (typeof callback !== 'undefined')
                        callback(false, error);
                });
        };

        TBUtils.removeThing = function (id, spam, callback) {
            $.post(`${TBUtils.baseDomain}/api/remove`, {
                uh: TBUtils.modhash,
                id: id,
                spam: spam
            })
                .done(function () {
                    if (typeof callback !== 'undefined')
                        callback(true);
                })
                .fail(function (error) {
                    if (typeof callback !== 'undefined')
                        callback(false, error);
                });
        };

        TBUtils.lockThread = function (id, callback) {
            $.post(`${TBUtils.baseDomain}/api/lock`, {
                id: id,
                uh: TBUtils.modhash
            })
                .done(function () {
                    if (typeof callback !== 'undefined')
                        callback(true);
                })
                .fail(function (error) {
                    if (typeof callback !== 'undefined')
                        callback(false, error);
                });
        };

        TBUtils.unlockThread = function (id, callback) {
            $.post(`${TBUtils.baseDomain}/api/unlock`, {
                uh: TBUtils.modhash,
                id: id
            })
                .done(function () {
                    if (typeof callback !== 'undefined')
                        callback(true);
                })
                .fail(function (error) {
                    if (typeof callback !== 'undefined')
                        callback(false, error);
                });
        };

        TBUtils.stickyThread = function(id, callback, state) {
            if (state === undefined) {
                state = true;
            }

            $.post(`${TBUtils.baseDomain}/api/set_subreddit_sticky`, {
                id: id,
                state: state,
                uh: TBUtils.modhash
            })
                .done(function () {
                    if (typeof callback !== 'undefined')
                        callback(true);
                })
                .fail(function (error) {
                    if (typeof callback !== 'undefined')
                        callback(false, error);
                });
        };

        TBUtils.unstickyThread = function(id, callback) {
            TBUtils.stickyThread(id, callback, false);
        };

        TBUtils.postComment = function (parent, text, callback) {
            $.post(`${TBUtils.baseDomain}/api/comment`, {
                parent: parent,
                uh: TBUtils.modhash,
                text: text,
                api_type: 'json'
            })
                .done(function (response) {
                    if (response.json.hasOwnProperty('errors') && response.json.errors.length > 0) {
                        $.log(`Failed to post comment to on ${parent}`, false, SHORTNAME);
                        $.log(response.json.fails, false, SHORTNAME);
                        if (typeof callback !== 'undefined')
                            callback(false, response.json.errors);
                        return;
                    }

                    $.log(`Successfully posted comment on ${parent}`, false, SHORTNAME);
                    if (typeof callback !== 'undefined')
                        callback(true, response);
                })
                .fail(function (error) {
                    $.log(`Failed to post link to on${parent}`, false, SHORTNAME);
                    $.log(error, false, SHORTNAME);
                    if (typeof callback !== 'undefined')
                        callback(false, error);
                });
        };

        TBUtils.postLink = function (link, title, subreddit, callback) {
            $.post(`${TBUtils.baseDomain}/api/submit`, {
                kind: 'link',
                resubmit: 'true',
                url: link,
                uh: TBUtils.modhash,
                title: title,
                sr: subreddit,
                sendreplies: 'true', //this is the default on reddit.com, so it should be our default.
                api_type: 'json'
            })
                .done(function (response) {
                    if (response.json.hasOwnProperty('errors') && response.json.errors.length > 0) {
                        $.log(`Failed to post link to /r/${subreddit}`, false, SHORTNAME);
                        $.log(response.json.errors, false, SHORTNAME);
                        if (typeof callback !== 'undefined')
                            callback(false, response.json.errors);
                        return;
                    }

                    $.log(`Successfully posted link to /r/${subreddit}`, false, SHORTNAME);
                    if (typeof callback !== 'undefined')
                        callback(true, response);
                })
                .fail(function (error) {
                    $.log(`Failed to post link to /r/${subreddit}`, false, SHORTNAME);
                    $.log(error, false, SHORTNAME);
                    if (typeof callback !== 'undefined')
                        callback(false, error);
                });
        };

        TBUtils.sendMessage = function (user, subject, message, subreddit, callback) {
            $.post(`${TBUtils.baseDomain}/api/compose`, {
                from_sr: subreddit,
                subject: subject.substr(0, 99),
                text: message,
                to: user,
                uh: TBUtils.modhash,
                api_type: 'json'
            })
                .done(function (response) {
                    if (response.json.hasOwnProperty('errors') && response.json.errors.length > 0) {
                        $.log(`Failed to send link to /u/${user}`, false, SHORTNAME);
                        $.log(response.json.errors, false, SHORTNAME);
                        if (typeof callback !== 'undefined')
                            callback(false, response.json.errors);
                        return;
                    }

                    $.log(`Successfully send link to /u/${user}`, false, SHORTNAME);
                    if (typeof callback !== 'undefined')
                        callback(true, response);
                })
                .fail(function (error) {
                    $.log(`Failed to send link to /u/${user}`, false, SHORTNAME);
                    $.log(error, false, SHORTNAME);
                    if (typeof callback !== 'undefined')
                        callback(false, error);
                });
        };

        TBUtils.sendPM = function (to, subject, message, callback) {
            $.post(`${TBUtils.baseDomain}/api/compose`, {
                to: to,
                uh: TBUtils.modhash,
                subject: subject,
                text: message
            })
                .done(function () {
                    if (typeof callback !== 'undefined')
                        callback(true);
                })
                .fail(function (error) {
                    if (typeof callback !== 'undefined')
                        callback(false, error.responseText);
                });
        };

        TBUtils.markMessageRead = function (id, callback) {
            $.post(`${TBUtils.baseDomain}/api/read_message`, {
                api_type: 'json',
                id: id,
                uh: TBUtils.modhash
            }).done(function () {
                if (typeof callback !== 'undefined')
                    callback(true);
            });
        };

        TBUtils.aboutUser = function (user, callback) {
            $.get(`${TBUtils.baseDomain}/user/${user}/about.json`, {
                uh: TBUtils.modhash
            })
                .done(function (response) {
                    if (typeof callback !== 'undefined')
                        callback(true, response);
                })
                .fail(function (error) {
                    if (typeof callback !== 'undefined')
                        callback(false, error.responseText);
                });
        };

        TBUtils.getLastActive = function(user, callback){
            $.get(`${TBUtils.baseDomain}/user/${user}.json?limit=1&sort=new`, {
                uh: TBUtils.modhash
            })
                .done(function (response) {
                    if (typeof callback !== 'undefined')
                        callback(true, response.data.children[0].data.created_utc);
                })
                .fail(function (error) {
                    if (typeof callback !== 'undefined')
                        callback(false, error.responseText);
                });
        };

        TBUtils.getRules = function (sub, callback) {
            $.get(`${TBUtils.baseDomain}/r/${sub}/about/rules.json`, {
                uh: TBUtils.modhash
            })
                .done(function (response) {
                    if (typeof callback !== 'undefined')
                        callback(true, response);
                })
                .fail(function (error) {
                    if (typeof callback !== 'undefined')
                        callback(false, error.responseText);
                });
        };

        TBUtils.getReportReasons = function (postURL, callback) {
            $.log('getting reports', false, SHORTNAME);
            $.get(`${TBUtils.baseDomain + postURL}.json?limit=1`, {
                uh: TBUtils.modhash
            })
                .done(function (response) {
                    if (typeof callback !== 'undefined') {
                        var data = response[0].data.children[0].data;

                        if (!data) return callback(false);

                        callback(true, {
                            user_reports: data.user_reports,
                            mod_reports: data.mod_reports
                        });
                    }
                })
                .fail(function (error) {
                    if (typeof callback !== 'undefined')
                        callback(false, error.responseText);
                });
        };


        // Import export methods
        TBUtils.exportSettings = function (subreddit, callback) {
            var settingsObject = {};
            $(TBStorage.settings).each(function () {
                if (this == 'Storage.settings') return; // don't backup the setting registry.

                var key = this.split('.'),
                    setting = TBStorage.getSetting(key[0], key[1], null);

                if (setting !== null && setting !== undefined) { // DO NOT, EVER save null (or undefined, but we shouldn't ever get that)
                    settingsObject[this] = setting;
                }
            });

            TBUtils.postToWiki('tbsettings', subreddit, settingsObject, 'exportSettings', true, false, function () {
                callback();
            });
        };

        TBUtils.importSettings = function (subreddit, callback) {
            TBUtils.readFromWiki(subreddit, 'tbsettings', true, function (resp) {
                if (!resp || resp === TBUtils.WIKI_PAGE_UNKNOWN || resp === TBUtils.NO_WIKI_PAGE) {
                    $.log('Error loading wiki page', false, SHORTNAME);
                    return;
                }

                if (TBUtils.domain != 'www') {
                    TBui.textFeedback(`Cannot import from ${TBUtils.domain}.reddit.com.`);
                    $.log(`Cannot import from ${TBUtils.domain}.reddit.com.`, false, SHORTNAME);
                    return;
                }

                if (resp['Utils.lastversion'] < 300) {
                    TBui.textFeedback('Cannot import from a toolbox version under 3.0');
                    $.log('Cannot import from a toolbox version under 3.0', false, SHORTNAME);
                    return;
                }

                $.each(resp, function (fullKey, value) {
                    var key = fullKey.split('.');

                    TBStorage.setSetting(key[0], key[1], value);
                });

                callback();
            });
        };


        // Utility methods
        TBUtils.removeQuotes = function (string) {
            return string.replace(/['"]/g, '');
        };

        TBUtils.stringToColor = function (str) {
        // str to hash
            for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));

            // int/hash to hex
            for (var index = 0, color = '#'; index < 3; color += (`00${((hash >> index++ * 8) & 0xFF).toString(16)}`).slice(-2));

            return color;
        };


        // Added back for MMP's live mod mail.
        TBUtils.compressHTML = function (src) {
            return src.replace(/(\n+|\s+)?&lt;/g, '<').replace(/&gt;(\n+|\s+)?/g, '>').replace(/&amp;/g, '&').replace(/\n/g, '').replace(/child" > {2}False/, 'child">');
        };


        TBUtils.addToSiteTable = function (URL, callback) {
            if (!URL || !callback) callback(null);

            $.get(URL, function (resp) {
                if (!resp) callback(null);

                resp = resp.replace(/<script(.|\s)*?\/script>/g, '');
                var $sitetable = $(resp).find('#siteTable');
                $sitetable.find('.nextprev').remove();

                if ($sitetable) {
                    callback($sitetable);
                } else {
                    callback(null);
                }

            });
        };


        // easy way to simulate the php html encode and decode functions
        TBUtils.htmlEncode = function (value) {
        //create a in-memory div, set it's inner text(which jQuery automatically encodes)
        //then grab the encoded contents back out.  The div never exists on the page.
            return $('<div/>').text(value).html();
        };

        TBUtils.htmlDecode = function (value) {
            return $('<div/>').html(value).text();
        };


        TBUtils.zlibInflate = function (stringThing) {
        // Expand base64
            stringThing = atob(stringThing);
            // zlib time!
            var inflate = new pako.Inflate({to:'string'});
            inflate.push(stringThing);
            return inflate.result;
        };

        TBUtils.zlibDeflate = function (objThing) {
        // zlib time!
            var deflate = new pako.Deflate({to:'string'});
            deflate.push(objThing, true);
            objThing = deflate.result;
            // Collapse to base64
            return btoa(objThing);
        };


        // Cache manipulation

        TBUtils.clearCache = function (calledFromBackground) {
            $.log('TBUtils.clearCache()', false, SHORTNAME);

            TBUtils.noteCache = {};
            TBUtils.configCache = {};
            TBUtils.rulesCache = {};
            TBUtils.noConfig = [];
            TBUtils.noNotes = [];
            TBUtils.noRules = [];
            TBUtils.mySubs = [];
            TBUtils.mySubsData = [];

            TBStorage.clearCache();

            if(!calledFromBackground) {
                chrome.runtime.sendMessage({
                    action: 'tb-global',
                    globalEvent: 'clearCache'
                });
            }

        };

        TBUtils.getReasonsFromCSS = function (sub, callback) {

        // If not, build a new one, getting the XML from the stylesheet
            $.get(`${TBUtils.baseDomain}/r/${sub}/about/stylesheet.json`).done(function (response) {
                if (!response.data) {
                    callback(false);
                    return;
                }

                // See if this subreddit is configured for leaving reasons using <removalreasons2>
                var match = response.data.stylesheet.replace(/\n+|\s+/g, ' ')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .match(/<removereasons2>.+<\/removereasons2>/i);

                // Try falling back to <removalreasons>
                if (!match) {
                    match = response.data.stylesheet.replace(/\n+|\s+/g, ' ')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .match(/<removereasons>.+<\/removereasons>/i);
                }

                // Neither can be found.
                if (!match) {
                    callback(false);
                    return;
                }

                // Create valid XML from parsed string and convert it to a JSON object.
                var XML = $(match[0]);
                var reasons = [];

                XML.find('reason').each(function () {
                    var reason = {
                        text: escape(this.innerHTML)
                    };
                    reasons.push(reason);
                });

                var oldReasons = {
                    pmsubject: XML.find('pmsubject').text() || '',
                    logreason: XML.find('logreason').text() || '',
                    header: escape(XML.find('header').text() || ''),
                    footer: escape(XML.find('footer').text() || ''),
                    logsub: XML.find('logsub').text() || '',
                    logtitle: XML.find('logtitle').text() || '',
                    bantitle: XML.find('bantitle').text() || '',
                    getfrom: XML.find('getfrom').text() || '',
                    reasons: reasons
                };

                callback(oldReasons);
            }).fail(function () {
                callback(false);
            });
        };

        TBUtils.hasNoConfig = function (sub) {
            return TBUtils.noConfig.indexOf(sub) != -1;
        };

        TBUtils.hasConfig = function (sub) {
            return TBUtils.configCache[sub] !== undefined;
        };

        TBUtils.getConfig = function(sub, callback) {
            if (TBUtils.hasNoConfig(sub)) {
                callback(false, sub);
            }
            else if (TBUtils.hasConfig(sub)) {
                callback(TBUtils.configCache[sub], sub);
            }
            else {
                TBUtils.readFromWiki(sub, 'toolbox', true, function (resp) {
                // Complete and utter failure
                    if (!resp || resp === TBUtils.WIKI_PAGE_UNKNOWN) {
                        callback(false, sub);
                    }
                    // Subreddit not configured yet
                    else if (resp === TBUtils.NO_WIKI_PAGE) {
                        TBUtils.noConfig.push(sub);
                        callback(false, sub);
                    }
                    // It works!
                    else {
                        TBUtils.configCache[sub] = resp;
                        callback(resp, sub);
                    }
                });
            }
        };

        // Listen to background page communication and act based on that.
        chrome.runtime.onMessage.addListener(function(message) {
            switch (message.action) {
            case 'clearCache': {
                TBUtils.clearCache(true);
                break;
            }
            default: {
                const event = new CustomEvent(message.action, {detail: message.payload });
                window.dispatchEvent(event);
            }


            }
        });

        // private functions
        function setWikiPrivate(subreddit, page, failAlert) {
            $.post(`${TBUtils.baseDomain}/r/${subreddit}/wiki/settings/`, {
                page: page,
                listed: true, //hrm, may need to make this a config setting.
                permlevel: 2,
                uh: TBUtils.modhash
            })
            // Super extra double-secret secure, just to be safe.
                .fail(function () {
                // used if it is important for the user to know that a wiki page has not been set to private.
                    if (failAlert) {
                        alert('error setting wiki page to mod only access');
                        window.location = `https://www.reddit.com/r/${subreddit}/wiki/settings/${page}`;
                    } else {
                        $.log('error setting wiki page to mod only access');
                    }
                });
        }


        function getToolboxDevs() {
            $.getJSON(`${TBUtils.baseDomain}/r/toolbox/about/moderators.json`).done(function (resp) {

                var children = resp.data.children,
                    devs = [];

                $.each(children, function (index, child) {
                    devs.push(child.name);
                });
                TBUtils.tbDevs = devs;
                TBStorage.setSetting(SETTINGS_NAME, 'tbDevs', devs);
            }).fail(function () {
                var devs = [
                    'agentlame',
                    'creesch',
                    'LowSociety ',
                    'TheEnigmaBlade',
                    'dakta',
                    'largenocream',
                    'psdtwk',
                    'amici_ursi',
                    'noeatnosleep',
                    'Garethp',
                    'WorseThanHipster',
                    'geo1088'
                ];
                TBUtils.tbDevs = devs;
                TBStorage.setSetting(SETTINGS_NAME, 'tbDevs', devs);
            });
        }

        // Prep new modmail for toolbox stuff.
        // We wait a short while because new modmail is sneaky sneaky loading things after the dom is ready.


        function addTbModmailSidebar() {
            setTimeout(function () {
                var $body = $('body');
                if (TBUtils.isNewModmail && $body.find('.ThreadViewer').length > 0 && $body.find('.tb-recents').length === 0) {
                    $body.find('.ThreadViewer__infobar').append('<div class="InfoBar__recents tb-recents"><div class="InfoBar__recentsTitle">Toolbox functions:</div></div>');
                }
            }, 500);
        }
        addTbModmailSidebar();

        if(!TBUtils.isNewModmail) {
            let newThingRunning = false;
            // NER, load more comments, and mod frame support.
            var target = document.querySelector('div.content');

            // create an observer instance
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    var $target = $(mutation.target), $parentNode = $(mutation.target.parentNode);
                    if (!($target.hasClass('sitetable') && ($target.hasClass('nestedlisting') || $target.hasClass('listing') || $target.hasClass('linklisting') ||
                    $target.hasClass('modactionlisting'))) && !$parentNode.hasClass('morecomments') && !$target.hasClass('flowwit')) return;

                    $.log(`TBNewThings firing from: ${$target.attr('class')}`, false, SHORTNAME);
                    // It is entirely possible that TBNewThings is fired multiple times.
                    // That is why we only set a new timeout if there isn't one set already.
                    if(!newThingRunning) {
                        newThingRunning = true;
                        // Wait a sec for stuff to load.
                        setTimeout(function () {
                            newThingRunning = false;
                            var event = new CustomEvent('TBNewThings');
                            window.dispatchEvent(event);
                        }, 1000);
                    }
                });
            });

            // configuration of the observer:
            // We specifically want all child elements but nothing else.
            var config = {
                attributes: false,
                childList: true,
                characterData: false,
                subtree: true
            };

            // pass in the target node, as well as the observer options
            observer.observe(target, config);
        } else {

        // For new modmail we do things a bit different.
        // We only listen for dom changes after a user interaction.
        // Resulting in this event being fired less and less wasted requests.
            let newThingRunning = false;
            let locationHref = location.href;
            document.body.addEventListener('click', function(){
                // First we are going to check if this click resulted in a page change.
                setTimeout(function(){
                    let samePage = locationHref === location.href;
                    if (!samePage) {
                        locationHref = location.href;
                        var event = new CustomEvent('TBNewPage', {
                            detail: {
                                locationHref: locationHref
                            }
                        });
                        window.dispatchEvent(event);
                    }
                }, 500);

                var newMMtarget = document.querySelector('body');

                // create an observer instance
                var newMMobserver = new MutationObserver(function (mutations) {

                    var doAddTbModmailSidebar = false;
                    var doTBNewThings = false;

                    mutations.forEach(function (mutation) {
                        var $target = $(mutation.target);

                        if ($target.find('.ThreadViewer__infobar').length > 0) {
                            doAddTbModmailSidebar = true;


                        }
                        if ($target.is('.Thread__message, .ThreadViewer, .Thread__messages')) {
                            doTBNewThings = true;

                        }
                    });

                    if (doAddTbModmailSidebar) {
                        $.log('DOM: new modmail sidebar found.', false, SHORTNAME);
                        addTbModmailSidebar();
                    }

                    if (doTBNewThings) {

                        $.log('DOM: processable elements found.', false, SHORTNAME);

                        // It is entirely possible that TBNewThings is fired multiple times.
                        // That is why we only set a new timeout if there isn't one set already.
                        if(!newThingRunning) {
                            newThingRunning = true;
                            // Wait a sec for stuff to load.
                            setTimeout(function () {
                                newThingRunning = false;
                                var event = new CustomEvent('TBNewThings');
                                window.dispatchEvent(event);
                            }, 1000);
                        }
                    }
                });

                // configuration of the observer:
                // We specifically want all child elements but nothing else.
                var newMMconfig = {
                    attributes: false,
                    childList: true,
                    characterData: false,
                    subtree: true
                };

                // pass in the target node, as well as the observer options
                newMMobserver.observe(newMMtarget, newMMconfig);

                // Wait a bit for dom changes to occur and then disconnect it again.
                setTimeout(function () {
                    newMMobserver.disconnect();


                }, 2000);
            });

        }





        // NER support. todo: finish this.
        //window.addEventListener("neverEndingLoad", function () {
        //    $.log('NER! NER! NER! NER!');
        //});


        window.onbeforeunload = function () {
        // TBUI now handles the long load array.
            if (TBui.longLoadArray.length > 0) {
                return 'toolbox is still busy!';
            }


            // Cache data.
            TBStorage.setCache(SETTINGS_NAME, 'configCache', TBUtils.configCache);
            TBStorage.setCache(SETTINGS_NAME, 'noteCache', TBUtils.noteCache);
            TBStorage.setCache(SETTINGS_NAME, 'noConfig', TBUtils.noConfig);
            TBStorage.setCache(SETTINGS_NAME, 'noNotes', TBUtils.noNotes);
            TBStorage.setCache(SETTINGS_NAME, 'moderatedSubs', TBUtils.mySubs);
            TBStorage.setCache(SETTINGS_NAME, 'moderatedSubsData', TBUtils.mySubsData);

        // Just in case.
        //TBStorage.unloading();
        };


        // get toolbox news
        (function getNotes() {
            TBUtils.readFromWiki('toolbox', 'tbnotes', true, function (resp) {
                if (!resp || resp === TBUtils.WIKI_PAGE_UNKNOWN || resp === TBUtils.NO_WIKI_PAGE || resp.length < 1) return;

                // Custom FF nag for updates.
                if (resp.ffVersion > TBUtils.shortVersion && TBUtils.browser == FIREFOX && TBUtils.isExtension) {
                    TBUtils.alert('There is a new version of toolbox for Firefox!  Click here to update.', function (clicked) {
                        if (clicked) window.open(`http://creesch.github.io/reddit-moderator-toolbox/downloads/reddit_mod_tb_${resp.ffVersion}.xpi`);
                    });
                    return; //don't spam the user with notes until they have the current version.
                }

                // Custom Safari nag for updates.
                if (resp.safariVersion > TBUtils.shortVersion && TBUtils.browser == SAFARI && TBUtils.isExtension) {
                    TBUtils.alert('There is a new version of toolbox for Safari!  Click here to update.', function (clicked) {
                        if (clicked) window.open(`http://creesch.github.io/reddit-moderator-toolbox/downloads/reddit_mod_tb_${resp.safariVersion}.safariextz`);
                    });
                    return; //don't spam the user with notes until they have the current version.
                }

                if (TBUtils.debugMode && resp.devVersion > TBUtils.shortVersion && TBUtils.isExtension) {
                    TBUtils.alert('There is a new development version of toolbox!  Click here to update.', function (clicked) {
                        if (clicked) window.open('https://github.com/creesch/reddit-moderator-toolbox');
                    });
                }

                $(resp.notes).each(function () {
                    TBUtils.showNote(this);
                });
            });

            if (betaRelease) {
                TBUtils.readFromWiki('tb_beta', 'tbnotes', true, function (resp) {
                    if (!resp || resp === TBUtils.WIKI_PAGE_UNKNOWN || resp === TBUtils.NO_WIKI_PAGE || resp.length < 1) return;
                    $(resp.notes).each(function () {
                        TBUtils.showNote(this);
                    });
                });
            }

            //check dev sub, if debugMode
            if (TBUtils.debugMode) {
                TBUtils.readFromWiki('tb_dev', 'tbnotes', true, function (resp) {
                    if (!resp || resp === TBUtils.WIKI_PAGE_UNKNOWN || resp === TBUtils.NO_WIKI_PAGE || resp.length < 1) {
                        TBUtils.devMode = false;
                        TBUtils.devModeLock = true;
                        return;
                    }

                    $(resp.notes).each(function () {
                        TBUtils.showNote(this);
                    });
                });
            }
        })();

        // get rate limit
        if (TBUtils.debugMode) {
            (function getRateLimit() {
                TBUtils.getRatelimit();
            })();
        }

    }(TBUtils = window.TBUtils || {}));
}

(function () {
    // wait for storage
    window.addEventListener('TBStorageLoaded', function () {
        initwrapper();

        var event = new CustomEvent('TBUtilsLoaded');
        window.dispatchEvent(event);
    });
})();
