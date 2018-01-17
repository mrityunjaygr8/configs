(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
(function() {
    ga('create', window.GA_TRACKING_CODE, 'auto');
    ga('set', 'checkProtocolTask', function() {}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
    ga('require', 'displayfeatures');
})();

//install / uninstall
(function() {

    var requestSize = 15;
    var newItems = (Math.floor(Math.random() * (requestSize - 5)) + 5).toString();
    var setUninstallURLDone = false;
    var cacheTime = 15;
    var activeRefreshTime = 15;
    var server = window.MUZLI_SERVER;
    var cachedImages = [];

    //Event listener to track scroll distance events
    window.chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.scrollDistance || request.scrollDistance === 0) {
            ga('send', 'event', 'Scroll distance', request.state, request.source, request.scrollDistance);
        }
    });

    //uninstall
    function setUninstallURL() {

        if (setUninstallURLDone) {
            return;
        }

        window.chrome.storage.local.get("installDate", function(obj) {
            if (obj.installDate) {
                setUninstallURLDone = true;
                var date = new Date();
                var udate = ("0" + (date.getMonth() + 1)).slice(-2).toString() + ("0" + (date.getDate())).slice(-2).toString() + date.getFullYear().toString();
                window.chrome.runtime.setUninstallURL(window.MUZLI_WEBSITE_URL + "/stay/?idate=" + obj.installDate + "&udate=" + udate, function() {})
            }
        });
    }

    function cacheFeed() {
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;

        function reqListener() {

            var data = JSON.parse(this.responseText);
            window.chrome.storage.local.set({ 'cachedFeed': data }, function() {});

            //Cache up to 10 images to display in home view
            cachedImages = [];
            
            for (i = 0, length = Math.min(data.feed.length, 10); i < length; ++i) {
                cachedImages[i] = new Image();
                cachedImages[i].src = data.feed[i].image;
            }
        }

        oReq.open('get', server + '/feed/muzli?limit=' + window.muzli.paging.server, true);
        oReq.send();

        //set badge
        window.chrome.browserAction.setBadgeBackgroundColor({ "color": [255, 52, 102, 255] });
        window.chrome.browserAction.getBadgeText({}, function(r) {
            if (r > 0) {
                r = parseInt(r);
                r = r + 1;
                window.chrome.browserAction.setBadgeText({ "text": r.toString() });
            } else {
                window.chrome.browserAction.setBadgeText({ "text": newItems });
            }
        })
    }

    //Load cookies from muz.li website to local storage
    function fetchZonePromotion() {

        //The server code executes callback function when loaded
        window.JSON_CALLBACK = function(res) {

            if (res.isLite) {
                window.localStorage.setItem('lite', true);
                window.localStorage.setItem('halfView', true);
            }

            window.localStorage.userCookieData = JSON.stringify(res);
            window.chrome.storage.sync.set({ 'userCookieData': res, 'installTime': new Date().getTime() }, function() {});
        };

        var a = document.createElement('script');
        a.sync = 0;
        a.src = window.MUZLI_WEBSITE_URL + '/partners/partner.php';
        document.body.appendChild(a);
    }

    function updateActiveTime() {

        var script = document.createElement('script');
        script.sync = 0;
        script.src = window.MUZLI_WEBSITE_URL + '/partners/checkin.php';

        document.body.appendChild(script);
        document.body.removeChild(script);
    }

    window.chrome.browserAction.onClicked.addListener(function() {
        window.chrome.tabs.create({ 'url': window.chrome.extension.getURL('index.html?button') }, function(tab) {});
    });

    //install reason
    window.chrome.runtime.onInstalled.addListener(function(obj) {

        ga('send', 'event', 'Install', 'load', obj.reason);
        cacheFeed();

        if (obj.reason === 'install') {
            var date = new Date();
            window.chrome.storage.local.set({ 'installDate': ("0" + (date.getMonth() + 1)).slice(-2).toString() + ("0" + (date.getDate())).slice(-2).toString() + date.getFullYear().toString() });
            setUninstallURL();
            fetchZonePromotion();
        }

        if (obj.reason === 'update') {
            var date = new Date();
            window.chrome.storage.local.set({ 'updateDate': ("0" + (date.getMonth() + 1)).slice(-2).toString() + ("0" + (date.getDate())).slice(-2).toString() + date.getFullYear().toString() });
        }
    });

    //Cache Muli feed every 15 mins 
    window.chrome.alarms.create("cacheFeed", { periodInMinutes: cacheTime });
    window.chrome.alarms.create("updateActiveTime", { periodInMinutes: activeRefreshTime });

    window.chrome.alarms.onAlarm.addListener(function(alarm) {
        
        if (alarm.name === "cacheFeed") {
            cacheFeed();
        }

        if (alarm.name === "updateActiveTime") {
            updateActiveTime();
        }

    });

    window.chrome.storage.local.get('openAfterInit', function(storage) {
        if (storage.openAfterInit) {
            window.chrome.tabs.create({ 'url': window.chrome.extension.getURL('index.html') }, function(tab) {});
        };

        window.chrome.storage.local.set({openAfterInit: false});
    })


    updateActiveTime();
    setUninstallURL();

})();

