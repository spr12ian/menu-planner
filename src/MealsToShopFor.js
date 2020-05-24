class MealsToShopFor {
  constructor(mySpreadsheet) { //console.log("Meals");
    this.mySpreadsheet = mySpreadsheet; //console.log(mySpreadsheet);
  }

  getDefaultSheetName() { //console.log("MealsToShopFor.getDefaultSheetName");
    const defaultSheetName = "Meals To Shop For"; //console.log("defaultSheetName: [%s]", defaultSheetName);
    return defaultSheetName;
  }

  getMealsToShopFor() {
    return this.getSheet().getDataRange().getValues();
  }

  getSheet() { //console.log("MealsToShopFor.getSheet");  
    const sheet = this.mySpreadsheet.getActiveSpreadsheet().getSheetByName(this.getSheetName()); //console.log(sheet);
    return sheet;
  }

  getSheetName() { //console.log("MealsToShopFor.getSheetName");
    const sheetName = this.sheetName || this.getDefaultSheetName(); //console.log("sheetName: [%s]", sheetName);
    return sheetName;
  }

  setActiveCell(a1Notation) {
    this.getSheet().setActiveCell(this.getSheet().getRange(a1Notation));
  }

  updateMealsToShopFor(daysToShopFor = 7) { //console.log("MealsToShopFor.updateMealsToShopFor");
    function endsWith(str, search) {
      return str.substring(str.length - search.length, str.length) === search;
    };
  
    const mealsToShopFor = this.mySpreadsheet.getMealsToShopFor();
    mealsToShopFor.sort();

    let previousMeal = "";
    const reducedMeals = [];
    mealsToShopFor.forEach(function(meal) {
      if (meal === previousMeal) {
        if (endsWith(meal, "(2 meals)")) {
        } else {
          reducedMeals.push(meal);
        }
      } else {
        previousMeal = meal;
        reducedMeals.push(meal);
      }
    }, this);
  
    this.getSheet().clear();
  
    reducedMeals.forEach(function(meal) {
      this.getSheet().appendRow([meal]);
    }, this);
  
    return reducedMeals;
  }
}