// Wrapping in a function to not leak/modify variables if the script
// was already inserted before.
(function() {
  if ( typeof window.PRISM == 'object'){
    if ( typeof window.PRISM.eject == 'function' ){
      window.PRISM.eject();
    }
  }
})(); // <-- Invoke function. The return value is passed back to executeScript
