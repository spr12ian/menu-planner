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

  getDefaultSheetName() { //console.log("ShoppingList.getDefaultSheetName");
    const defaultSheetName = "Shopping List"; //console.log("defaultSheetName: [%s]", defaultSheetName);
    return defaultSheetName;
  }

  getHowManyMealsToShopFor() { //console.log("ShoppingList.getHowManyMealsToShopFor");
    const howManyMealsToShopFor = this.getMySpreadsheet().getHowManyMealsToShopFor(); //console.log("getHowManyMealsToShopFor: howManyMealsToShopFor", howManyMealsToShopFor);
    return howManyMealsToShopFor;
  }

  getIngredientsToShopFor() { //console.log("ShoppingList.getIngredientsToShopFor");
    const ingredientsToShopFor = this.getMySpreadsheet().getIngredientsToShopFor(); //console.log("getIngredientsToShopFor: ingredientsToShopFor", ingredientsToShopFor);
    return ingredientsToShopFor;
  }

  getMealsToShopFor() { //console.log("ShoppingList.getMealsToShopFor");
    const mealsToShopFor = this.getMySpreadsheet().getMealsToShopFor(); //console.log("getMealsToShopFor: mealsToShopFor", mealsToShopFor);
    //console.log("ShoppingList.getMealsToShopFor typeof mealsToShopFor: %s", typeof mealsToShopFor);
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

  howManyIngredients() { //console.log('ShoppingList.howManyIngredients');
    const IngredientsToBuy = this.sheet.getRange("E1:E").getValues(); //console.log('IngredientsToBuy: [%s]', IngredientsToBuy);
    const howManyIngredients = IngredientsToBuy.filter(String).length; //console.log('howManyIngredients: [%s]', howManyIngredients);
    return howManyIngredients;
  }

  readQuantityTypes() { //console.log("ShoppingList.readQuantityTypes");
    const a1QuantityTypes = "Quantity Types!A2:D"; //console.log(a1QuantityTypes);
    this.quantityTypeList = this.sheet.getRange(a1QuantityTypes).getValues(); //console.log(this.quantityTypeList);
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
      for (const recipeIndex in this.recipesValues) {
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