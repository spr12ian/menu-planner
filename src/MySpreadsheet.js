class MySpreadsheet {
  constructor() {
    //Logger.log("MySpreadsheet constructor");
  }

  createMenu() { //console.log("MySpreadsheet.createMenu");
    const gasMenu = getGASMenu();
  
    const ui = SpreadsheetApp.getUi();
    const menu = ui.createMenu(gasMenu.menu);
  
    gasMenu.items.forEach(function(item) {
      menu.addItem(item.caption, item.functionName);
    });
  
    menu.addToUi();
  }

  getActiveSpreadsheet() { //console.log("MySpreadsheet.getActiveSpreadsheet");
    this.spreadsheet = SpreadsheetApp.getActiveSpreadsheet(); //console.log(this.spreadsheet);
    return this.spreadsheet;
  }

  getConfig() { //console.log("MySpreadsheet.getConfig");
    if (typeof this.config === "undefined") {
      return this.setDefaultConfig();
    } else {
      return this.config;
    }
  }

  getDailyMenus() { //console.log("MySpreadsheet.getDailyMenus");
    const dailyMenus = this.dailyMenus || new DailyMenus(this); //console.log(dailyMenus);
    return dailyMenus;
  }

  getDefaultConfig() { //console.log("MySpreadsheet.getDefaultConfig");
    return new Config(this);
  }

  getDefaultIngredientsToShopFor() { //console.log("MySpreadsheet.getDefaultIngredientsToShopFor");
    return new IngredientsToShopFor(this);
  }

  getDefaultShoppingList() { //console.log("MySpreadsheet.getDefaultShoppingList");
    return new ShoppingList(this);
  }

  getHowManyMealsToShopFor() { //console.log("MySpreadsheet.getHowManyMealsToShopFor");
    const howManyMealsToShopFor = this.getDailyMenus().getHowManyMealsToShopFor(); //console.log(howManyMealsToShopFor);
    return howManyMealsToShopFor;
  }

  getIngredientsToShopFor() { //console.log("MySpreadsheet.getIngredientsToShopFor");
    if (typeof this.ingredientsToShopFor === "undefined") {
      return this.setDefaultIngredientsToShopFor();
    } else {
      return this.ingredientsToShopFor;
    }
  }

  getMeals() { //console.log("MySpreadsheet.getMeals");
    const meals = this.meals || new Meals(this); //console.log(meals);
    return meals;
  }

  getMealsToShopFor() { //console.log("MySpreadsheet.getMealsToShopFor");
    return this.getDailyMenus().getMealsToShopFor();
  }

  getServingsToShopFor() { //console.log("MySpreadsheet.getServingsToShopFor");
    const mealsToShopFor = this.getMealsToShopFor();
    let servingsPerMeal;
    const servingsToShopFor = [];
    for (const mealIndex in mealsToShopFor) {
      //console.log(mealIndex);
      //console.log(mealsToShopFor[mealIndex]);
      servingsPerMeal = this.getMeals().getServingsPerMeal(mealsToShopFor[mealIndex]); //console.log(servingsPerMeal);
      servingsToShopFor.push([mealsToShopFor[mealIndex], servingsPerMeal]);
    }
    //console.log("MenuPlanner.getServingsToShopFor: servingsToShopFor: [%s]", servingsToShopFor);
    return servingsToShopFor;
  }

  getShoppingList() { //console.log("MySpreadsheet.getShoppingList");
    if (typeof this.shoppingList === "undefined") {
      return this.setDefaultShoppingList();
    } else {
      return this.shoppingList;
    }
  }

  getShoppingStartDate() { //console.log("MySpreadsheet.getShoppingStartDate");
    const shoppingStartDate = this.getConfig().getShoppingStartDate(); //console.log("shoppingStartDate: [%s]", shoppingStartDate);
    return shoppingStartDate;
  }

  onlyUnique(value, index, self) { //console.log("MySpreadsheet.onlyUnique");
    //console.log('value: [%s]', value);
    //console.log('value[0]: [%s]', value[0]);
    //console.log('index: [%s]', index);
    //console.log('self: [%s]', self);
    //console.log('self.indexOf('+value+'): [%s]', self.indexOf(value));
    //console.log('self.indexOf('+value+')[0]: [%s]', self.indexOf(value)[0]);
    const posArr = self.map(function(e) { return e[0]; }); //console.log('posArr: [%s]', posArr);
    const pos = posArr.indexOf(value[0]); //console.log('pos: [%s]', pos);
    const onlyUnique = (pos === index);
    //console.log('onlyUnique: [%s]', onlyUnique);
    //throw new Error("onlyUnique");
    return onlyUnique;
  }

  setConfig(config) { //console.log("MySpreadsheet.setConfig config: %s", config);
    this.validateConfig(config);
    this.config = config;
    return config;
  }

  setDefaultConfig() { //console.log("MySpreadsheet.setDefaultConfig");
    return this.setConfig(this.getDefaultConfig());
  }

  setDefaultIngredientsToShopFor() { //console.log("MySpreadsheet.setDefaultIngredientsToShopFor");
    return this.setIngredientsToShopFor(this.getDefaultIngredientsToShopFor());
  }

  setDefaultShoppingList() { //console.log("MySpreadsheet.setDefaultShoppingList");
    return this.setShoppingList(this.getDefaultShoppingList());
  }

  setIngredientsToShopFor(ingredientsToShopFor) { //console.log("MySpreadsheet.setIngredientsToShopFor ingredientsToShopFor: %s", ingredientsToShopFor);
    this.validateIngredientsToShopFor(ingredientsToShopFor);
    this.ingredientsToShopFor = ingredientsToShopFor;
    return ingredientsToShopFor;
  }

  setShoppingList(shoppingList) { //console.log("MySpreadsheet.setShoppingList shoppingList: %s", shoppingList);
    this.validateShoppingList(shoppingList);
    this.shoppingList = shoppingList;
    return shoppingList;
  }

  toast(msg, title, timeoutSeconds) { //console.log("MySpreadsheet.toast");
    SpreadsheetApp.getActiveSpreadsheet().toast(msg, title, timeoutSeconds);
  }

  validateConfig(config) { //console.log("MySpreadsheet.validateConfig config: %s", config);
    if (typeof config === "undefined") {
      throw new RangeError("config is undefined");
    }
  }

  validateIngredientsToShopFor(ingredientsToShopFor) { //console.log("MySpreadsheet.validateIngredientsToShopFor ingredientsToShopFor: %s", ingredientsToShopFor);
    if (typeof ingredientsToShopFor === "undefined") {
      throw new RangeError("ingredientsToShopFor is undefined");
    }
  }

  validateShoppingList(shoppingList) { //console.log("MySpreadsheet.validateShoppingList shoppingList: %s", shoppingList);
    if (typeof shoppingList === "undefined") {
      throw new RangeError("shoppingList is undefined");
    }
  }
}