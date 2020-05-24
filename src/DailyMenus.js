class DailyMenus {
  constructor(mySpreadsheet) { //console.log("DailyMenus");
    this.mySpreadsheet = mySpreadsheet; //console.log("DailyMenus mySpreadsheet: %s", mySpreadsheet);
  }

  getDefaultSheetName() { //console.log("DailyMenus.getDefaultSheetName");
    const defaultSheetName = "Daily Menus"; //console.log("defaultSheetName: [%s]", defaultSheetName);
    return defaultSheetName;
  }

  getEndDateRow() { //console.log("DailyMenus.getEndDateRow");
    const endDateRow = this.getStartDateRow() + 6; //console.log(endDateRow);
    return endDateRow;
  }

  getHowManyMealsToShopFor() { //console.log("DailyMenus.getHowManyMealsToShopFor");
    const howManyMealsToShopFor = [];
    const mealsToShopFor = this.getMealsToShopFor(); //console.log('DailyMenus.getHowManyMealsToShopFor: mealsToShopFor: [%s]', mealsToShopFor);

    for (const mealIndex in mealsToShopFor) {
      const key = mealsToShopFor[mealIndex]; //console.log('DailyMenus.getHowManyMealsToShopFor: key: [%s]', key);
      howManyMealsToShopFor[key] = howManyMealsToShopFor[key] ? howManyMealsToShopFor[key] + 1 : 1;
    }
  
    return howManyMealsToShopFor;
  }

  getMealsToShopFor() { console.log("DailyMenus.getMealsToShopFor");
    if (typeof this.mealsToShopFor === "undefined") {
      return this.setDefaultMealsToShopFor();
    } else {
      return this.mealsToShopFor;
    }
  }

  getMealsToShopForFromSheet() { //console.log("DailyMenus.getMealsToShopForFromSheet");
    const mealsToShopFor = [];
    const a1Range = "B" + this.getStartDateRow() + ":E" + this.getEndDateRow(); //console.log("a1Range: [%s]", a1Range);
    const meals = this.getSheet().getRange(a1Range).getValues();  //console.log('DailyMenus: meals', meals);
  
    for (const dayIndex in meals) {
      for (const mealIndex in meals[dayIndex]) {
        mealsToShopFor.push(meals[dayIndex][mealIndex]);
      }
    }
  
    return mealsToShopFor;
  }

  getMySpreadsheet() {
    return this.mySpreadsheet;
  }

  getSheetName() { //console.log("DailyMenus.getSheetName");
    const sheetName = this.sheetName || this.getDefaultSheetName(); //console.log("sheetName: [%s]", sheetName);
    return sheetName;
  }

  getSheet() { //console.log("DailyMenus.getSheet");  
    const sheet = this.mySpreadsheet.getActiveSpreadsheet().getSheetByName(this.getSheetName()); //console.log(sheet);
    return sheet;
  }

  getShoppingStartDate() { //console.log("DailyMenus.getShoppingStartDate");
    const shoppingStartDate = this.shoppingStartDate || this.mySpreadsheet.getShoppingStartDate(); //console.log("shoppingStartDate: [%s]", shoppingStartDate);
    return shoppingStartDate;
  }

  getUtilities() { //console.log("DailyMenus.getUtilities");
    return Utilities;
  }

  goToTodaysMenu() { //console.log("DailyMenus.goToTodaysMenu");
    const ui = SpreadsheetApp.getUi();
    const dateToday = this.getUtilities().formatDate(new Date(), "GMT+1", "E, d MMMM yyyy"); //console.log("DailyMenus.goToTodaysMenu dateToday %s", dateToday);
    //ui.alert("dateToday: " + dateToday);
    const textFinder = this.getSheet().createTextFinder(dateToday);
    const searchRow = textFinder.findNext().getRow();
    //ui.alert("searchRow: " + searchRow);
    //console.log("DailyMenus.goToTodaysMenu searchRow %s", searchRow);
    const a1Range = "A" + searchRow + ":E" + (6 + searchRow);
    //ui.alert("a1Range: " + a1Range);
    this.getSheet().setActiveRange(this.getSheet().getRange(a1Range));
  }

  setDefaultMealsToShopFor() { console.log("DailyMenus.setDefaultMealsToShopFor");
    return this.setMealsToShopFor(this.getMealsToShopForFromSheet());
  }

  setMealsToShopFor(mealsToShopFor) { console.log("DailyMenus.setMealsToShopFor mealsToShopFor: %s", mealsToShopFor);
    this.validateMealsToShopFor(mealsToShopFor);
    this.mealsToShopFor = mealsToShopFor;
    return mealsToShopFor;
  }

  validateMealsToShopFor(mealsToShopFor) { //console.log("DailyMenus.validateMealsToShopFor mealsToShopFor: %s", mealsToShopFor);
    if (typeof mealsToShopFor === "undefined") {
      throw new RangeError("mealsToShopFor is undefined");
    }
  }

  setStartDate(startDate) { //console.log("DailyMenus.setStartDate");
    this.startDate = startDate;
  }

  getStartDateRow () { //console.log("DailyMenus.getStartDateRow");
    const startDateColumn = 0; //console.log(startDateColumn);
    const shoppingStartDate = this.getShoppingStartDate(); //console.log(shoppingStartDate);
    const fullDateRange = this.getSheet().getRange("A2:A").getValues(); //console.log('fullDateRange: [%s]', fullDateRange);

    //console.log("fullDateRange.length: [%s]", fullDateRange.length);

    for(let i = 0; i<fullDateRange.length;i++){
      //console.log("fullDateRange[i]: [%s]", fullDateRange[i]);
      //console.log(fullDateRange[i][startDateColumn]);
      //console.log(fullDateRange[i][startDateColumn].toDateString());
      if(fullDateRange[i][startDateColumn].toDateString() == shoppingStartDate){
        //console.log(("i+2: [%s]", i+2))
        return i+2;
      }
    }
  }
  
  setValues(values) {;
    const startRow = 1;
    const startColumn = 1;
    const howManyRows = values.length;
    const howManyColumns = values[0].length;

    this.getSheet().getRange(startRow, startColumn, howManyRows, howManyColumns).setValues(values);
  }
}