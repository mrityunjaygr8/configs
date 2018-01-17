(function (){

  if (window.REGISTERED) {
    document.body.className = document.body.className + ' app-loading';
  }
  
  else {
    
    var isDark = window.localStorage.getItem('theme') === "dark";
    var isFullView = window.localStorage.getItem('halfView') === "true";
    var topSitesDisabled = window.muzli.getRuntime().id === "non_chrome" || window.localStorage.getItem('topSitesDisabled') === "true";
    
    if (isDark) {
      document.body.className = document.body.className + ' dark';
    }
  }
  
})();
