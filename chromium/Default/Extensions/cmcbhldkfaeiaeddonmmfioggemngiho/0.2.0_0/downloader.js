var ExtensionTabID;
/*
chrome.browserAction.onClicked.addListener(function(tab) {
    SendExtensionMessage("pause",tab.id);
});*/

//When Pandora makes a request
chrome.webRequest.onHeadersReceived.addListener(function(details) {
    for (var i = 0; i < details.responseHeaders.length; ++i) {
        if (details.responseHeaders[i].name === 'Content-Type') {
            if(details.responseHeaders[i].value == "audio/mp4"){
                //Check if the file is MP4, if it is it's most likely a song
                //chrome.extension.getBackgroundPage().console.log(details.url);
                //chrome.extension.getBackgroundPage().console.log(details.tabId);
                //ExtensionTabID = details.tabId;
                SendExtensionMessage(details.url,details.tabId);
                //SendGlobalMessage(details.url);
            }
            break;
        }
    }    
    return {requestHeaders: details.requestHeaders};
},
{urls: ["<all_urls>"]},
["responseHeaders"]);

//To Content Script Messsages
function SendExtensionMessage(message,tabID){
    chrome.tabs.sendRequest(tabID, message);
}

//Content Script to Backgroud Communication
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request.method === "LoadCheck"){
        //ExtensionTabID=sender.tab.id;
        //chrome.extension.getBackgroundPage().console.log(ExtensionTabID);
    }
    if (request.method === "EventLogger") {
        switch(request.data)
        {
            case "YouTube Button Pressed":
                _gaq.push(['_trackEvent', "Youtube Button", 'clicked']);
                break;
            case "Download Button Pressed":
                _gaq.push(['_trackEvent', "Download Button", 'clicked']);
                break;
            case "New Song":
                _gaq.push(['_trackEvent', "Songs", 'elapsed']);
                break;
        }
    }
});

//GA Connection
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-42112567-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function strCont(str,cont)
{
  return (str.indexOf(cont) !== -1);
}
  
  
  
  
  
  
  
  
  
  
  
  
/*
 *
 *

//Send to all Tabs
function SendGlobalMessage(message){
    chrome.windows.getAll({populate: true}, function(windows) {
        var w,t;
        for (w=0; w<windows.length; w++) {
           for (t=0; t<windows[w].tabs.length; t++) {
              chrome.tabs.sendRequest(windows[w].tabs[t].id, message);
           }
        }
    });
}

 *
 *
http://www.pandora.com/radio/xmlrpc/v35?rid=6017864P&lid=210859630&method=getFragment&arg1=1463844323497965166&arg2=40720000&arg3=2846054&arg4=&arg5=aacplus&arg6=158&arg7=1371974741740
getFragment
/radio/xmlrpc

<member><name>albumTitle</name><value>Promises</value></member><member><name>artistSummary</name><value>Nero</value></member>


var filter = {urls: ["https://www.google.com/"]};
var opt_extraInfoSpec = [""];
chrome.webRequest.onSendHeaders.addListener(function(details) {
    chrome.extension.getBackgroundPage().console.log(details.url.toString());
},{urls: ["<all_urls>"]},
  ["blocking", "requestHeaders"]);
  
  */