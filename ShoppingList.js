class ShoppingList {
  constructor(mySpreadsheet) { //console.log("ShoppingList");
    this.mySpreadsheet = mySpreadsheet; //console.log(mySpreadsheet);
    //console.log(this);
  }

  clearShoppingList() { //console.log("ShoppingList.clearShoppingList");
    const fullSheetRange = this.sheet.getRange(1,1,this.sheet.getMaxRows(), this.sheet.getMaxColumns() )  
    this.sheet.unhideColumn( fullSheetRange );
    this.sheet.unhideRow( fullSheetRange ) ;   

    this.sheet.clearContents();
  }

  getDailyMenuMeals(a1Meals, mealColumn) { //console.log("ShoppingList.getDailyMenuMeals");
    const isWeekCorrectThis = { weekToShopFor: this.weekToShopFor }; //console.log(isWeekCorrectThis);
    this.meals = this.sheet.getRange(a1Meals); //console.log("this.meals: [%s]", this.meals);
    this.mealValues = this.meals.getValues(); //console.log("this.mealValues: [%s]", this.mealValues);
    this.filteredMeals = this.mealValues.filter(this.isWeekCorrect, isWeekCorrectThis); //console.log("this.filteredMeals: [%s]", this.filteredMeals);
    this.shopForMeals = this.filteredMeals.map(function(value,index) { return value[mealColumn]; }); //console.log("this.shopForMeals: [%s]", this.shopForMeals);
  
    return this.shopForMeals;
  }

  getDefaultSheetName() { //console.log("ShoppingList.getDefaultSheetName");
    const defaultSheetName = "Shopping List"; //console.log("defaultSheetName: [%s]", defaultSheetName);
    return defaultSheetName;
  }

  geDefaulttWeekToShopFor() { //console.log("ShoppingList.geDefaulttWeekToShopFor");
    const defaultWeekToShopFor = 1; //console.log("ShoppingList.geDefaulttWeekToShopFor.defaultWeekToShopFor: [%s]", defaultWeekToShopFor);
    return defaultWeekToShopFor;
  }

  getHowManyMealsToShopFor() { //console.log("ShoppingList.getHowManyMealsToShopFor");
    const howManyMealsToShopFor = this.getMySpreadsheet().getHowManyMealsToShopFor(); //console.log("getHowManyMealsToShopFor: howManyMealsToShopFor", howManyMealsToShopFor);
    return howManyMealsToShopFor;
  }

  getIngredientsToShopFor() { //console.log("ShoppingList.getIngredientsToShopFor");
    const ingredientsToShopFor = this.getMySpreadsheet().getIngredientsToShopFor(); //console.log("getIngredientsToShopFor: ingredientsToShopFor", ingredientsToShopFor);
    return ingredientsToShopFor;
  }

  getMealsToShopFor() { console.log("ShoppingList.getMealsToShopFor");
    const mealsToShopFor = this.getMySpreadsheet().getMealsToShopFor(); //console.log("getMealsToShopFor: mealsToShopFor", mealsToShopFor);
    console.log("ShoppingList.getMealsToShopFor typeof mealsToShopFor: %s", typeof mealsToShopFor);
    return mealsToShopFor;
  }

  getMySpreadsheet() { //console.log("ShoppingList.getMySpreadsheet");
    return this.mySpreadsheet;
  }

  getQuery() {
    const data = "B1:D";
    const query = "SELECT B, SUM(C), D GROUP BY B, D LABEL B 'Ingredient', SUM(C) 'Quantity'";
    return '=QUERY(' + data + ', "' + query + '")';
  }

  getServingsToShopFor() { //console.log("ShoppingList.getServingsToShopFor");
    const servingsToShopFor = this.getMySpreadsheet().getServingsToShopFor(); //console.log("getServingsToShopFor: servingsToShopFor", servingsToShopFor);
    return servingsToShopFor;
  }

  getSheet() { //console.log("ShoppingList.getSheet");  
    const sheet = this.getMySpreadsheet().getActiveSpreadsheet().getSheetByName(this.getSheetName()); //console.log(sheet);
    return sheet;
  }

  getSheetName() { //console.log("ShoppingList.getSheetName");
    const sheetName = this.sheetName || this.getDefaultSheetName(); //console.log("sheetName: [%s]", sheetName);
    return sheetName;
  }

  getShopForRecipes() {
    return this.getSheet().getDataRange().getValues();
  }

  getShoppingListType(abbreviation) { //console.log("ShoppingList.getShoppingListType");
    for (const typeListIndex in this.quantityTypeList) {
      if (abbreviation === this.quantityTypeList[typeListIndex][0]) {
        const shoppingListType = this.quantityTypeList[typeListIndex][2];
        return shoppingListType;
      }
    }
    return abbreviation + ' not found in Quantity Types';
  }

  getWeekToShopFor() { //console.log("ShoppingList.getWeekToShopFor");
    const weekToShopFor = this.weekToShopFor || this.getDefaultWeekToShopFor(); //console.log("weekToShopFor: [%s]", weekToShopFor);
    return weekToShopFor;
  }

  howManyIngredients() { //console.log('ShoppingList.howManyIngredients');
    const IngredientsToBuy = this.sheet.getRange("E1:E").getValues(); //console.log('IngredientsToBuy: [%s]', IngredientsToBuy);
    const howManyIngredients = IngredientsToBuy.filter(String).length; //console.log('howManyIngredients: [%s]', howManyIngredients);
    return howManyIngredients;
  }

  isColBNotTwo(arr) {
    return arr[1] != 2;
  }

  isColCYes(arr) {
    return arr[0].toLowerCase() == "yes";
  }

  isRecipeSelected(arr) {
  return this.includes(arr[0]);
}

  isWeekCorrect(element) { //console.log("ShoppingList.isWeekCorrect");For);
    return element[0] == this.weekToShopFor;
  }

  makeSingleList() { //console.log("ShoppingList.makeSingleList");
    const filteredMealsNotForTwo = this.mealList.filter(this.isColBNotTwo); //console.log(filteredMealsNotForTwo);
    const rowsToDeleteFromSingleList = filteredMealsNotForTwo.map(function(value,index) { return [value[0],(value[1]/2)-1]; }); //console.log(rowsToDeleteFromSingleList);
  
    this.singleList = this.breakfastList.concat(this.lunchList).concat(this.dinnerList); //console.log(this.singleList);
    //console.log(this.singleList.length);
  
    for (const rowToDeleteFromSingleList in rowsToDeleteFromSingleList) { //console.log(rowToDeleteFromSingleList);
      const itemToDelete = rowsToDeleteFromSingleList[rowToDeleteFromSingleList][0]; //console.log(itemToDelete);
      const howManyToDelete = rowsToDeleteFromSingleList[rowToDeleteFromSingleList][1]; //console.log(howManyToDelete);
      for (let i=0; i < howManyToDelete; i++) { //console.log(i);
        const index = this.singleList.indexOf(itemToDelete); //console.log(index);
        if (index > -1) {
          this.singleList.splice(index, 1);
        }
      }
    }
    //console.log(this.singleList);
    //console.log(this.singleList.length);
  }

  readBreakfasts() { //console.log("ShoppingList.readBreakfasts");
    const a1Breakfasts = "Seven Day Menus!A2:B"; //console.log(a1Breakfasts);
    const breakfastColumn = 1;
    this.breakfastList = this.getDailyMenuMeals(a1Breakfasts, breakfastColumn); //console.log(this.breakfastList);
  }

  readDailyMenus() { //console.log("ShoppingList.readDailyMenus");
    this.readDailyMenusBreakfasts();
    this.readDailyMenusLunches();
    this.readDailyMenusDinners();
    this.readDailyMenusSnacks();
    this.makeSingleList();
  }

  readDinners() { //console.log("ShoppingList.readDinners");
    const a1Dinners = "Seven Day Menus!A2:D"; //console.log(a1Dinners);
    const dinnerColumn = 3;
    this.dinnerList = this.getDailyMenuMeals(a1Dinners, dinnerColumn); //console.log(this.dinnerList);
  }

  readLunches() { //console.log("ShoppingList.readLunches");
    const a1Lunches = "Seven Day Menus!A2:C"; //console.log(a1Lunches);
    const lunchColumn = 2;
    this.lunchList = this.getDailyMenuMeals(a1Lunches, lunchColumn); //console.log(this.lunchList);
  }

  readMeals() { //console.log('ShoppingList.readMeals');
    const a1Meals = "Meals!A2:D"; //console.log(a1Meals);
    this.mealList = this.sheet.getRange(a1Meals).getValues(); //console.log(this.mealList);
  }

  readQuantityTypes() { //console.log("ShoppingList.readQuantityTypes");
    const a1QuantityTypes = "Quantity Types!A2:D"; //console.log(a1QuantityTypes);
    this.quantityTypeList = this.sheet.getRange(a1QuantityTypes).getValues(); //console.log(this.quantityTypeList);
  }

  readRecipes() { //console.log("ShoppingList.readRecipes");
    const a1Recipes = "Recipes!A2:D";
    this.shopForRecipes = [];
    this.recipes = this.sheet.getRange(a1Recipes);
    this.recipesValues = this.recipes.getValues();
    for (const listIndex in this.singleList) {
      for (const recipeIndex in this.recipesValues) {
        if (this.singleList[listIndex] === this.recipesValues[recipeIndex][0]) {
          this.shopForRecipes.push(this.recipesValues[recipeIndex]);
        }
      }
    }
  }

  readSevenDayMenus() { //console.log("ShoppingList.readSevenDayMenus");
    this.readBreakfasts();
    this.readLunches();
    this.readDinners();
    this.makeSingleList();
  }

  reduceList() { //console.log("ShoppingList.reduceList");
    const maxRows = this.sheet.getMaxRows(); //console.log('maxRows: [%s]', maxRows);
  
    this.sheet.getRange("E1").setValue(this.getQuery());
    this.sheet.hideColumns(1,4);
  
    const howManyIngredients = this.howManyIngredients(); //console.log('howManyIngredients: [%s]', howManyIngredients);
    this.sheet.hideRows(howManyIngredients+2,((maxRows-1)-howManyIngredients));
  }

  reduceSevenDayMenus() { //console.log("ShoppingList.reduceSevenDayMenus");
    const newArr = [];

    for (let i = 0; i < this.sevenDayMenus.length; i++) {
      newArr = newArr.concat(this.sevenDayMenus[i]);
    }
  }

  setShopForRecipes(shopForRecipes) {
    this.shopForRecipes = shopForRecipes; //console.log("this.shopForRecipes: [%s]", this.shopForRecipes);
  }

  setWeekToShopFor(weekToShopFor) { //console.log("ShoppingList.setWeekToShopFor");
    this.weekToShopFor = weekToShopFor; //console.log("this.weekToShopFor: [%s]", this.weekToShopFor);
  }

  updateList() { //console.log("ShoppingList.updateList");
    const mealsToShopFor = this.getMealsToShopFor(); //console.log("ShoppingList.updateList mealsToShopFor", mealsToShopFor);
    const howManyMealsToShopFor = this.getHowManyMealsToShopFor(); //console.log("ShoppingList.updateList howManyMealsToShopFor", howManyMealsToShopFor);
    const servingsToShopFor = this.getServingsToShopFor(); //console.log("ShoppingList.updateList servingsToShopFor", servingsToShopFor);
    const ingredientsToShopFor = this.getIngredientsToShopFor(); //console.log("ShoppingList.updateList ingredientsToShopFor", ingredientsToShopFor);
  }

  updateRecipeQuantities() { //console.log("ShoppingList.updateRecipes");
    for (const typeListIndex in this.quantityTypeList) {
      for (var recipeIndex in this.recipesValues) {
        if (this.recipesValues[recipeIndex][3] === this.quantityTypeList[typeListIndex][0]) {
          this.recipesValues[recipeIndex][2] *= this.quantityTypeList[typeListIndex][3];
          this.recipesValues[recipeIndex][3] = this.quantityTypeList[typeListIndex][2];
        }
      }
    }
  }

  writeList() { //console.log("ShoppingList.writeList");
    const startRow = 1;
    const startColumn = 1;
    const howManyRows = this.shopForRecipes.length;
    const howManyColumns = this.shopForRecipes[0].length;
    const range = this.getSheet().getRange("A1:D");
    range.clear();

    this.getSheet().getRange(startRow, startColumn, howManyRows, howManyColumns).setValues(this.shopForRecipes);
  }
}