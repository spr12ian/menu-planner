
function identifyTriggers () {
  var triggers = ScriptApp.getProjectTriggers();
  for (trigger in triggers) {
    //console.log(trigger);
    //console.log(triggers[trigger]);
    //console.log(triggers[trigger].getHandlerFunction());
  }
}