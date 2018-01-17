// Load settings on page load
$(window).on('load', function() {
  if (localStorage.getItem("apkmirror") === "true") {
    $("#apkmirror").prop("checked", true);
  }
  if (localStorage.getItem("androidpolice") === "true") {
    $("#androidpolice").prop("checked", true);
  }
  if (localStorage.getItem("appbrain") === "true") {
    $("#appbrain").prop("checked", true);
  }
  if (localStorage.getItem("testing") === "true") {
    $("#testing").prop("checked", true);
  }
  if (localStorage.getItem("ampersand") === "true") {
    $("#ampersand").prop("checked", true);
  }
  if (localStorage.getItem("devmode") === "false") {
    $("#devmode").hide();
  }
  if ($(".version").length) {
    $(".version").html(chrome.runtime.getManifest().version);
  }
});

// Update settings on any input change
$(document).on('change', "input", function() {
  if ($("#apkmirror").is(":checked")) {
    localStorage["apkmirror"] = "true";
  } else {
    localStorage["apkmirror"] = "false";
  }
  if ($("#androidpolice").is(":checked")) {
    localStorage["androidpolice"] = "true";
  } else {
    localStorage["androidpolice"] = "false";
  }
  if ($("#appbrain").is(":checked")) {
    localStorage["appbrain"] = "true";
  } else {
    localStorage["appbrain"] = "false";
  }
  if ($("#testing").is(":checked")) {
    localStorage["testing"] = "true";
  } else {
    localStorage["testing"] = "false";
  }
  if ($("#ampersand").is(":checked")) {
    localStorage["ampersand"] = "true";
  } else {
    localStorage["ampersand"] = "false";
  }
  if (!($("body").hasClass("popup"))) {
    Materialize.toast('Saved!', 2000, 'rounded');
  }
});

// Clear cache functionality
$(document).on("click", ".cachebutton" , function() {
  localStorage["cache"] = "[]";
  Materialize.toast('Cache cleared!', 2000, 'rounded');
});

// Developer mode functionality
function devMode() {
  if (localStorage.getItem("devmode") === "true") {
    localStorage["devmode"] = "false";
    console.log("[Toolbox] Developer mode now disabled.");
    $("#devmode .btn").removeClass("red");
    $("#devmode .btn").addClass("green");
    $("#devmode .btn").text("Enable developer mode");
    if (!($("body").hasClass("popup"))) {
      Materialize.toast("To re-enable Developer Mode, press CTRL + X.", 10000, 'rounded');
    }
  } else {
    localStorage["devmode"] = "true";
    console.log("[Toolbox] Developer mode now enabled.");
    $("#devmode .btn").removeClass("green");
    $("#devmode .btn").addClass("red");
    $("#devmode .btn").text("Disable developer mode");
    $("#devmode").fadeIn("fast");
    if (!($("body").hasClass("popup"))) {
      Materialize.toast("Developer mode now enabled.", 10000, 'rounded');
    }
  }
}

$(document).on("click", "#devmode .btn" , function() {
  devMode();
});

function doc_keyUp(e) {
  if (e.ctrlKey && e.keyCode == 88) {
    devMode();
  }
}

document.addEventListener('keyup', doc_keyUp, false);

// Tweaks for popup settings only
if ($("body").hasClass("popup")) {
  // Fix bug where invisible dev mode button would still increase height of popup
  if (localStorage.getItem("devmode") === "false") {
    var newheight = $("body").height() - 40;
    $("html, body").css("height", newheight);
  }
}