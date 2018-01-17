//console.log("Content Script Online");
SendBGData('LoadCheck','');

//Inserts the buttons onto Pandora
function injectHTML(){
    //console.log("injecting HTML");
    //Download Link
    if(!$("#downloadLink").length){
        var TimeoutPrevention=setInterval(function(){RefreshTimeout()},3540000);
        var imgURL = chrome.extension.getURL("WebFiles/downloadIcon.png");
        var downloadButtonURL = chrome.extension.getURL("WebFiles/downloadButton.html");
        $.get(downloadButtonURL, function(data) {
            $('#trackInfoButtons').children().first().append(data);
            $('.downloadButton div.icon').css('background-image',"url(\""+imgURL+"\")");
            
            //On first run, the attributes have to set in the callback beacuse $.get is async.
            
            $('a#downloadLink').attr({href  : SongLink});
            $('a#downloadLink').attr({download: SongArtist + " - " + SongTitle});
        });
        //console.log("HTMl Injected");
    }
    
    //Youtube
    if(!$("#youtubeLink").length){
        var youtubeLogoURL = chrome.extension.getURL("WebFiles/youtubeIcon.png");
        var youtubeButtonURL = chrome.extension.getURL("WebFiles/youtubeButton.html");
        $.get(youtubeButtonURL, function(data) {
            $('#trackInfoButtons').children().first().append(data);
            $('.youtubeButton div.icon').css('background-image',"url(\""+youtubeLogoURL+"\")");
        });
        //console.log("HTMl Injected");
    }
}

//Gets YouTube Link by Querying the Song Artist/Name to YouTube API and pullying up first result
//Sets the Title Text and HREF YouTube Link at the end.
//Only gets max-results=1 to lower bandwidth usage
function getYoutubeLink(){
    var Query = encodeURIComponent(SongArtist + " - " + SongTitle);
    //console.log('https://gdata.youtube.com/feeds/api/videos?q='+Query+'&orderby=relevance&max-results=1&v=2&alt=json');
    $.getJSON('https://gdata.youtube.com/feeds/api/videos?q='+Query+'&orderby=relevance&max-results=1&v=2&alt=json', function(data) {
        var link = data.feed.entry[0].link[0].href;
        var title = data.feed.entry[0].title.$t;
        $('#youtubeLink').attr({title:title,href:link});
        //console.log( title + " - " + link);
    });
}

//When album information finishes loading
//Binds to all DOM change events
//When Album Title changes, all data is done updating
//Title is grabbed, HTML is reinjected if neccessary and the YouTube link is retreived.
$(document).bind("DOMSubtreeModified", function(evt) {
    var CurText = $('a.albumTitle').text();
    if(CurText != "" && CurText != SongAlbum){
        //console.log("DOM Event "+ CurText);
        grabTitle();
        injectHTML();
        getYoutubeLink();
        SendBGData('EventLogger','New Song');
    }        
});

var SongLink;

//New Song File Loaded
//Updates the DownloadLink on the Download Button.
chrome.extension.onRequest.addListener(function(request) { 
    //HREF Updated with new link.
    $('a#downloadLink').attr({href  : request});
    SongLink = request;
    //console.log('DL Link ' + SongLink);

});

function RefreshTimeout(){
    var PauseStatus = $('.pauseButton').css("display");
    //console.log(PauseStatus);
    if(PauseStatus == "block") //Playing
    {
        $('.pauseButton').click();
        $('.playButton').click();
    }
    else //Paused
    {
        $('.playButton').click();
        $('.pauseButton').click();
    }
    return;
}

var SongTitle, SongArtist, SongAlbum;

//Grabs Title from Elements and sets in Variables
function grabTitle(){
    SongTitle = $('a.songTitle').text();
    SongArtist = $('a.artistSummary').text();
    SongAlbum = $('a.albumTitle').text();
    $('a#downloadLink').attr({download: SongArtist + " - " + SongTitle});
    //console.log(SongArtist + " - " + SongTitle);
    return false;
}

//Register YouTube Click
$(document).on('click','#youtubeLink', function (e) { 
    SendBGData('EventLogger','YouTube Button Pressed');
});

//Register Download Click
$(document).on('click','#downloadLink', function (e) { 
    SendBGData('EventLogger','Download Button Pressed');
});


function SendBGData(method, data){
    chrome.extension.sendRequest({method: method, data: data});
}