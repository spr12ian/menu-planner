class Meals {
  constructor(menuPlanner) { //console.log("Meals");
    this.menuPlanner = menuPlanner; //console.log(menuPlanner);
    this.allMeals = this.getAllMeals();
    //console.log(this);  
  }

  getAllMeals() { //console.log("Meals.getAllMeals");
    const typeofThisAllMeals = typeof this.allMeals; //console.log("typeofThisAllMeals %s", typeofThisAllMeals);
    let allMeals;
    if (typeofThisAllMeals === 'undefined') { //console.log("typeofThisAllMeals === 'undefined'");
      allMeals = this.getSheet().getDataRange().getValues();
      allMeals.shift();
      this.allMeals = allMeals;
    } else {
      allMeals = this.allMeals;
    }
    //console.log("Meals.getAllMeals: allMeals %s", allMeals);
    //console.log("Meals.getAllMeals: this.allMeals %s", this.allMeals);
    return allMeals;
  }

  getDefaultSheetName() { //console.log("Meals.getDefaultSheetName");
    const defaultSheetName = "Meals"; //console.log("defaultSheetName: [%s]", defaultSheetName);
    return defaultSheetName;
  }

  getLinks() { //console.log("Meals.getLinks");
    const links = [];
    const urlColumn = 2;
    let allMeals = this.getAllMeals(); //console.log("allMeals %s", allMeals);
    for (let mealIndex in allMeals) {
      let url = allMeals[mealIndex][urlColumn];
      if (url.length) {
        links.push(url);
      }
    }
    return links;
  }

getServingsPerMeal(meal) { //console.log("Meals.getServingsPerMeal");
  //console.log("Meals.getServingsPerMeal: meal: [%s]", meal);
  var mealIndex;
  const allMeals = this.allMeals; //console.log("allMeals %s", allMeals);
  var servingsPerMeal;
  for (mealIndex in allMeals) {
    //console.log(mealIndex);
    //console.log(allMeals[mealIndex]);
    //console.log(allMeals[mealIndex][0]);
    //console.log(allMeals[mealIndex][1]);
    if (meal === allMeals[mealIndex][0]) {
      servingsPerMeal = allMeals[mealIndex][1]; //console.log("servingsPerMeal: [%s]", servingsPerMeal);
      return servingsPerMeal;
    }
  }
  //console.log("servingsPerMeal NOT assigned", servingsPerMeal);
  return servingsPerMeal;
}

getSheet() { //console.log("Meals.getSheet");  
  const sheet = this.menuPlanner.getActiveSpreadsheet().getSheetByName(this.getSheetName()); //console.log(sheet);
  return sheet;
}

getSheetName() { //console.log("Meals.getSheetName");
  const sheetName = this.sheetName || this.getDefaultSheetName(); //console.log("sheetName: [%s]", sheetName);
  return sheetName;
}
}