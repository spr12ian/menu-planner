class DateChange {
  // Called by function onDateChange which is triggered daily
  executeDateChangeEvents() {
    this.updateMealsToShopFor();
    this.updateShoppingList();
    this.emailTodaysMenu();
  }

  emailTodaysMenu() {
    const mySpreadsheet = new MySpreadsheet();
    const shoppingList = new ShoppingList(mySpreadsheet);
    const ingredientsToShopFor = new IngredientsToShopFor(mySpreadsheet);
    const shopForRecipes = shoppingList.getShopForRecipes();
    const ingredients = ingredientsToShopFor.getIngredients();
    let emailBody = "Meals\n";
    let previousRecipe = "";
    let menuItems = [];  
  
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
    GmailApp.sendEmail("hope.survives@gmail.com", "Today's Menu", emailBody)
  }
  
  updateMealsToShopFor() {
    const daysToShopFor = 1;
    const mySpreadsheet = new MySpreadsheet();
    const mealsToShopFor = new MealsToShopFor(mySpreadsheet);
  
    mealsToShopFor.updateMealsToShopFor(daysToShopFor);
  }
  
  updateShoppingList() {
  }
}
