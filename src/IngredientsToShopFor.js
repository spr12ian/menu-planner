class IngredientsToShopFor {
  constructor(mySpreadsheet) {
    this.mySpreadsheet = mySpreadsheet;
  }

  getDefaultSheetName() { //console.log("IngredientsToShopFor.getDefaultSheetName");
    const defaultSheetName = "Ingredients To Shop For"; //console.log("defaultSheetName: [%s]", defaultSheetName);
    return defaultSheetName;
  }

  getIngredients() {
    const ingredients = this.getSheet().getDataRange().getValues();
    ingredients.shift();
    ingredients.shift();
    return ingredients;
  }

  getSheet() { //console.log("IngredientsToShopFor.getSheet");  
    const sheet = this.mySpreadsheet.getActiveSpreadsheet().getSheetByName(this.getSheetName()); //console.log(sheet);
    return sheet;
  }

  getSheetName() { //console.log("IngredientsToShopFor.getSheetName");
    const sheetName = this.sheetName || this.getDefaultSheetName(); //console.log("sheetName: [%s]", sheetName);
    return sheetName;
  }
}