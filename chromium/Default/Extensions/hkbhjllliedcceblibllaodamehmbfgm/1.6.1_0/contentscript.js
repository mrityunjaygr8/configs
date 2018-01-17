// Wrapping in a function to not leak/modify variables if the script
// was already inserted before.
(function() {
    if (window.PRISMhasRun){
        return true;  // Will ultimately be passed back to executeScript
    }
    window.PRISMhasRun = true;
    // rest of code ...
    // No return value here, so the return value is "undefined" (without quotes).
})(); // <-- Invoke function. The return value is passed back to executeScript


function PRISMeject(){
  //alert('fff')
  chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    console.log(response.farewell);
  });
}
