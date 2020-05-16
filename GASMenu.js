function getGASMenu() {
  const itemArray = [
    ['All Steps', 'allSteps'],
    ['Check Links', 'checkLinks'],
    ['Generate Daily Menus', 'generateDailyMenus'],
    ['Get Meals To Shop For', 'getMealsToShopFor'],
    ['Update Shopping List', 'updateShoppingList'],
    ['Go to today\'s menu', 'goToTodaysMenu'],
    ['Email weekly shopping list', 'emailShoppingList'],
    ['Update Menu', 'updateMenu'],
  ];
  //console.log(itemArray);
  const items = itemArray.map(function(item) {
    return {
      'caption': item[0], 
      'functionName': item[1]
    };
  });
  //console.log(items);
  return {
    'menu': 'GAS Menu',
    'items': items
  }
}

function allSteps() {
  goToTodaysMenu();
  checkLinks();
  getMealsToShopFor();
  updateShoppingList();
  emailShoppingList();
}

function checkLinks() {
  const mySpreadsheet = new MySpreadsheet();
  let linkChecker = new LinkChecker(mySpreadsheet);
  let meals = new Meals(mySpreadsheet);
  linkChecker.checkLinks(meals.getLinks());
  linkChecker.getToastMessages().forEach(function(item) {
    mySpreadsheet.toast(item.msg, item.title, item.timeoutSeconds);
  });
}

function emailShoppingList() {
  let mySpreadsheet = new MySpreadsheet();
  let shoppingList = new ShoppingList(mySpreadsheet);
  let ingredientsToShopFor = new IngredientsToShopFor(mySpreadsheet);
  let shopForRecipes = shoppingList.getShopForRecipes();
  let ingredients = ingredientsToShopFor.getIngredients();
  let emailBody = "Ingredients To Shop For\n\n";
  let previousRecipe = "";
  let menuItems = [];
  ingredients.forEach(function(ingredient) {
    emailBody += ingredient[0];
    emailBody += " [" + ingredient[1];
    if (ingredient[2].length) {
      emailBody += " " + ingredient[2];
    }
    emailBody += "]\n";
  });
  
  emailBody += "\nMeals\n";
  
  shopForRecipes.forEach(function(recipeItem) {
    if (previousRecipe !== recipeItem[0]) {
      menuItems = [];
      emailBody += "\n";
      previousRecipe = recipeItem[0];
      emailBody += recipeItem[0];
      emailBody += "\n";
      emailBody += "\n";
    }
    if (menuItems.indexOf(recipeItem[1]) < 0) {
      menuItems.push(recipeItem[1])
      emailBody += recipeItem[1];
      emailBody += " [" + recipeItem[2];
      if (recipeItem[3].length) {
        emailBody += " " + recipeItem[3];
      }
      emailBody += "]\n";
    }
  });
  console.log(emailBody);
  GmailApp.sendEmail("hope.survives@gmail.com", "Shopping List", emailBody)
}

function generateDailyMenus() {  
  let mySpreadsheet = new MySpreadsheet();
  let menuRota = new MenuRota(mySpreadsheet);
  let rotaOutput = new RotaOutput(mySpreadsheet);
  
  rotaOutput.setValues(menuRota.getOutput());
}

function goToTodaysMenu() {
  const mySpreadsheet = new MySpreadsheet();
  const dailyMenus = new DailyMenus(mySpreadsheet);
  dailyMenus.goToTodaysMenu();
}

function getMealsToShopFor() {
  const mySpreadsheet = new MySpreadsheet();
  const mealsToShopFor = new MealsToShopFor(mySpreadsheet);
  
  mealsToShopFor.updateMealsToShopFor();
  mealsToShopFor.setActiveCell("A1");
}

function updateMenu() {
  let mySpreadsheet = new MySpreadsheet();
  mySpreadsheet.createMenu();
}

function updateShoppingList() {
  function getMealIngredients(meal, recipeList) {
    const mealIngredients = [];
    
    recipeList.forEach(function(recipeItem) {
      if (meal === recipeItem[0]) {
        mealIngredients.push(recipeItem);
      }
    });
    
    return mealIngredients;
  }
  
  let mySpreadsheet = new MySpreadsheet();
  let mealsToShopFor = new MealsToShopFor(mySpreadsheet);
  let recipes = new Recipes(mySpreadsheet);
  let shoppingList = new ShoppingList(mySpreadsheet);
  
  let reducedMeals = mealsToShopFor.getMealsToShopFor();
  let recipeList = recipes.getRecipes();
  let shopFor = [];
  
  reducedMeals.forEach(function(meal) {
    mealIngredients = getMealIngredients(String(meal), recipeList);
    if (!mealIngredients.length) {
      throw new Error("No ingredients found for " + meal);
    }
    
    mealIngredients.forEach(function(ingredient) {
      shopFor.push(ingredient);
    });
  });
  
  shoppingList.setShopForRecipes(shopFor)
  shoppingList.writeList();
  
  let ingredientsToShopForSheet = mySpreadsheet.getIngredientsToShopFor().getSheet();
  ingredientsToShopForSheet.setActiveCell(ingredientsToShopForSheet.getRange("A1"));
}