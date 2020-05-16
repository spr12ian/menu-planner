function getActiveSpreadsheet() { console.log("getActiveSpreadsheet");
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet(); console.log(activeSpreadsheet);
  return activeSpreadsheet;
}

function testSpreadsheetFunctions() { console.log("testSpreadsheet");
  var activeSpreadsheet = getActiveSpreadsheet(); console.log(activeSpreadsheet);
}
