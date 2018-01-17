domains = null;

chrome.extension.sendRequest({ call : "calculateDomains" }, 
  function(response) {
    domains = response.domains;
  }
);


// If url is relative, convert to absolute.
function relativeToAbsoluteUrl(url) {
  // Author: Tom Joseph of AdThwart
  if(!url)
    return url;
  // If URL is already absolute, don't mess with it
  if(/^http/.test(url))
    return url;
  // Leading / means absolute path
  if(url[0] == '/')
    return document.location.protocol + "//" + document.location.host + url;

  // Remove filename and add relative URL to it
  var base = document.baseURI.match(/.+\//);
  if(!base) return document.baseURI + "/" + url;
    return base[0] + url; 
}

var ElementTypes = { 
  NONE: 0,
  script: 1,
  image: 2,
  background: 4,
  stylesheet: 8,
  'object': 16, 
  subdocument: 32, 
  //BELOW ISN'T SUPPORTED YET
  object_subrequest: 64, 
  media: 128,
  font: 256,
  dtd: 512,
  other: 1024,
  xbl: 2048,
  ping: 4096,
  xmlhttprequest: 8192
  // if you add something here, update .ALL below
}
ElementTypes.ALL = 16383; // all bits turned on

// Return the ElementType element type of the given element.
function typeForElement(el) {
  // TODO: handle background images that aren't just the BODY.
  switch (el.nodeName) {
    case 'IMG': return ElementTypes.image;
    case 'SCRIPT': return ElementTypes.script;
    case 'OBJECT': 
    case 'EMBED': return ElementTypes.object;
    case 'IFRAME': return ElementTypes.subdocument;
    case 'LINK': return ElementTypes.stylesheet;
    case 'BODY': return ElementTypes.background;
    default: return ElementTypes.NONE;
  } 
}

// Browser-agnostic canLoad function.
// Returns false if data.url, data.elType, and data.pageDomain together
// should not be blocked.
function browser_canLoad(event, data) {
  return isWidgetOnOwnerDomain(data.url) || !isWidgetBlocked(data.url); 
} 

beforeLoadHandler = function(event) {
  var el = event.target;
  // Cancel the load if canLoad is false.
  var elType = typeForElement(el);
  var url = event.url;

  if (event.target.href && elType == ElementTypes.stylesheet)
    url = event.target.href;
  if (event.target.src) 
    url = event.target.src;

  if (!url) { return; }

  var data = { 
    url: relativeToAbsoluteUrl(url),
    elType: elType,
    pageDomain: document.domain,
    isTopFrame: (window == window.top) 
  };
  if (false == browser_canLoad(event, data)) { 
    if (!(elType & (ElementTypes.background | ElementTypes.image))) {
      event.preventDefault();
      $(el).remove();
    }
  }
}

onInserted = function(event) {
  beforeLoadHandler(event);
}

document.addEventListener("beforeload", beforeLoadHandler, true);
document.addEventListener("DOMNodeInsertedIntoDocument", onInserted, true);

top_win_url = null;

if (window.top) {
  top_win_url = window.top.location.toString(); 
}

function isWidgetBlocked(url) {
  for (var domain in domains) {
    if (url.indexOf(domain) >= 0) {
      return true;
    }
  }
  return false;
}

function isWidgetOnOwnerDomain(url) {
  if (!top_win_url) { return false; }
  for (var domain in domains) {
    if (url.indexOf(domain) >= 0) {
      var hasone = false;
      for (var reverse_domain in domains[domain]) {
        hasone = true;
        if (top_win_url.indexOf(reverse_domain) >= 0) {
          return true;
        }
      }
      if (!hasone) {
        if (top_win_url.indexOf(domain) >= 0) {
          return true;
        }
      }
    }
  }
  return false;
}
