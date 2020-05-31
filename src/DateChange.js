class DateChange {
  // Called by function onDateChange which is triggered daily
  executeDateChangeEvents() {
    this.emailTodaysMenu();
  }

  emailTodaysMenu() {
    const mySpreadsheet = new MySpreadsheet();
    const dailyMenus = new DailyMenus(mySpreadsheet);
    const recipes = new Recipes(mySpreadsheet);
    const todaysMeals = dailyMenus.getTodaysMeals();
    
    let emailBody = "Meals\n";
    let previousRecipe = "";
    let menuItems = [];
    
    Object.keys(todaysMeals).forEach(meal => {
      emailBody += "\n";
      emailBody += meal;
      emailBody += ": ";
      emailBody += todaysMeals[meal];
    });
    
    emailBody += "\n";
    emailBody += "\n";
    
    Object.keys(todaysMeals).forEach(meal => {
      emailBody += "\n";
      emailBody += todaysMeals[meal];
      emailBody += " ingredients:";
      emailBody += "\n";
      const ingredients = recipes.getIngredients(todaysMeals[meal]);
      ingredients.forEach(ingredient => {
        emailBody += "\t";
        emailBody += ingredient.quantity;
        emailBody += " ";
        emailBody += ingredient.quantityType;
        emailBody += " ";
        emailBody += ingredient.ingredientName;
        emailBody += "\n";
      });
    });
    
    GmailApp.sendEmail("hope.survives@gmail.com,ianbernard66@gmail.com", "Today's Menu ("+this.getToday()+")", emailBody)
  }
  
  getToday() {
      const date = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const dtf = new Intl.DateTimeFormat('en-GB', options);
      const today = dtf.format(date);
      
      return today;
  }
}
