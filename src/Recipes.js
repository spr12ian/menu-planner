class Recipes {
  constructor(mySpreadsheet) { //console.log("Recipes");
    this.mySpreadsheet = mySpreadsheet; //console.log(mySpreadsheet);
  }

  checkRecipes(meals) { //console.log("Recipes.checkRecipes");
    const dataRangeValues = this.getDataRangeValues();
    //console.log(dataRangeValues);
    const recipeNames = dataRangeValues.map(row => row[0]);
    //console.log(recipeNames);
    const uniqueRecipeNames = new Set(recipeNames);
    meals.forEach(meal => {
      if (!uniqueRecipeNames.has(meal)) {
        throw new Error("No recipe found for " + meal);
      }
    });
  }

  getDataRangeValues() { //console.log("Recipes.getDataRangeValues");
    const typeofThisDataRangeValues = typeof this.dataRangeValues; //console.log("typeofThisDataRangeValues %s", typeofThisDataRangeValues);
    let dataRangeValues;
    if (typeofThisDataRangeValues === 'undefined') { //console.log("typeofThisDataRangeValues === 'undefined'");
      dataRangeValues = this.getSheet().getDataRange().getValues();
      dataRangeValues.shift();
      this.dataRangeValues = dataRangeValues;
    } else {
      dataRangeValues = this.dataRangeValues;
    }
    
    return dataRangeValues;
  }
  
  getDefaultSheetName() { //console.log("Recipes.getDefaultSheetName");
    const defaultSheetName = "Recipes"; //console.log("defaultSheetName: [%s]", defaultSheetName);
    return defaultSheetName;
  }
  
  getIngredients(meal) {
    const recipeIngredients = [];
    
    this.getRecipesList().forEach(recipeItem => {
      if (meal === recipeItem[0]) {
        let ingredient = {};
        ingredient.ingredientName = recipeItem[1];
        ingredient.quantity = recipeItem[2];
        ingredient.quantityType = recipeItem[3];
        recipeIngredients.push(ingredient);
      }
    });
    
    return recipeIngredients;
  }

  getRecipesList() {
    const typeofThisRecipesList = typeof this.recipesList; //console.log("typeofThisRecipesList %s", typeofThisRecipesList);
    let recipesList;
    if (typeofThisRecipesList === 'undefined') { //console.log("typeofThisRecipesList === 'undefined'");
      recipesList = this.getSheet().getDataRange().getValues();
      recipesList.shift();
      this.recipesList = recipesList;
    } else {
      recipesList = this.recipesList;
    }
    
    return recipesList;
  }

  getSheet() { //console.log("Recipes.getSheet");  
    const sheet = this.mySpreadsheet.getActiveSpreadsheet().getSheetByName(this.getSheetName()); //console.log(sheet);
    return sheet;
  }

  getSheetName() { //console.log("Recipes.getSheetName");
    const sheetName = this.sheetName || this.getDefaultSheetName(); //console.log("sheetName: [%s]", sheetName);
    return sheetName;
  }
}