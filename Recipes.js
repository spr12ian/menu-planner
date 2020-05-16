function Recipes(mySpreadsheet) { //console.log("Meals");
  this.mySpreadsheet = mySpreadsheet; //console.log(mySpreadsheet);
}

Recipes.prototype.getDefaultSheetName = function() { //console.log("Recipes.getDefaultSheetName");
  const defaultSheetName = "Recipes"; //console.log("defaultSheetName: [%s]", defaultSheetName);
  return defaultSheetName;
}

Recipes.prototype.getRecipes = function() {
  return this.getSheet().getDataRange().getValues();
}

Recipes.prototype.getSheet = function() { //console.log("Recipes.getSheet");  
  const sheet = this.mySpreadsheet.getActiveSpreadsheet().getSheetByName(this.getSheetName()); //console.log(sheet);
  return sheet;
}

Recipes.prototype.getSheetName = function() { //console.log("Recipes.getSheetName");
  const sheetName = this.sheetName || this.getDefaultSheetName(); //console.log("sheetName: [%s]", sheetName);
  return sheetName;
}