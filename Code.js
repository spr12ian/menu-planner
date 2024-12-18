class Config {
  constructor(spreadsheet) {
    this.sheetName = "Config";
    this.spreadsheet = spreadsheet;
    this.sheet = this.spreadsheet.getSheetByName(this.sheetName);
    
    if (!this.sheet) {
      throw new Error(`Sheet "${this.sheetName}" not found`);
    }
    
    this._cacheKeyValues(); // Cache the key-value pairs upon initialization
  }

  // Cache the key-value pairs to avoid multiple reads from the sheet
  _cacheKeyValues() {
    const keyRange = this.sheet.getRange("A2:B");
    this.keyValues = keyRange.getDisplayValues().reduce((acc, row) => {
      if (row[0] && row[1]) {
        acc[row[0]] = row[1];
      }
      return acc;
    }, {});
  }

  getSheet() {
    return this.sheet;
  }

  getSheetName() {
    return this.sheetName;
  }

  getShoppingStartDate() {
    return this.getValue("Shopping start date");
  }

  getValue(key) {
    if (key in this.keyValues) {
      return this.keyValues[key];
    }
    throw new Error(`Key "${key}" not found in config`);
  }

  isEnabledEmailTodaysMenu() {
    return this.getValue("Email today's menu");
  }
}


class DailyMenus {
  constructor(spreadsheet) {
    this.sheetName = "Daily Menus";
    this.spreadsheet = spreadsheet;
    this.sheet = this.spreadsheet.getSheetByName(this.sheetName);
  }

  getDateValues() {
    return this.sheet.getRange("A2:A").getDisplayValues();
  }

  getEndDateRow() {
    return this.getStartDateRow() + 6;
  }

  getHowManyMealsToShopFor() {
    const howManyMealsToShopFor = {};
    for (const meal of this.getMealsToShopFor()) {
      howManyMealsToShopFor[meal] = (howManyMealsToShopFor[meal] || 0) + 1;
    }
    return howManyMealsToShopFor;
  }

  getMealsToShopFor() {
    return this.mealsToShopFor ?? this.setDefaultMealsToShopFor();
  }

  getMealsToShopForFromSheet() {
    const startDateRowIndex = this.getStartDateRow();
    const endDateRowIndex = this.getEndDateRow();
    const mealsRange = this.sheet.getRange(`B${startDateRowIndex}:E${endDateRowIndex}`);
    return mealsRange.getValues().flat().filter(Boolean);
  }

  getOutputValues(seasonalMenus, howManyRowsToRefresh) {

    logIt('DailyMenus.getOutputValues started')

    function* makeInfiniteIterator(arr) {
      const start = 1;
      const end = arr.length;

      let nextIndex = start;

      while (true) {
        let result = arr[nextIndex - 1];
        if (nextIndex < end) {
          nextIndex++;
        } else {
          nextIndex = start;
        }
        yield result;
      }
    }

    function makeMealsIterator(seasonMenu) {
      logIt('makeMealsIterator started')
      logObjectArray(seasonMenu, 'seasonMenu')

      function getMealsFromRow(row) {
        logIt('getMeals started')
        logObject(row, 'row')

        const meals = row.meals
        logArray(meals, 'meals')

        return meals;
      }

      function getIteratorGrid(seasonMenu) {
        logIt('getIteratorGrid started')
        logObjectArray(seasonMenu, 'seasonMenu')

        const mealtimesArray = [
          'Breakfast',
          'Lunch',
          'Dinner',
          'Snacks',
        ];

        const iteratorGrid = {};
        let arrIndex = 0;

        getWeekDays().forEach(dayName => {
          logIt(`getWeekDays().forEach dayName: ${dayName} started`)

          iteratorGrid[dayName] = {};
          mealtimesArray.forEach(mealtime => {
            logIt(`mealtimesArray().forEach mealtime: ${mealtime} started`)

            const meals = getMealsFromRow(seasonMenu[arrIndex]);
            if (dayName === 'Sunday' && mealtime === 'Breakfast' && seasonMenu[arrIndex].season === 'Winter') {
              logArray(meals, 'meals')
            }

            const mealsiterator = makeInfiniteIterator(meals)
            iteratorGrid[dayName][mealtime] = mealsiterator
            arrIndex++
            logIt(`mealtimesArray().forEach mealtime: ${mealtime} finished`)
          });
          logIt(`getWeekDays().forEach dayName: ${dayName} finished`)
        });
        logObject(iteratorGrid, iteratorGrid)
        logIt('getIteratorGrid finished')
        return iteratorGrid;
      }

      const iteratorGrid = getIteratorGrid(seasonMenu)
      logObject(iteratorGrid, 'iteratorGrid')

      const start = 1;

      let nextIndex = start;
      let end = seasonMenu.length;

      const nextIterator = {
        next: function (pDayName) {
          logIt(`makeMealsIterator.nextIterator.next started`)
          logIt(`pDayName: ${pDayName}`)
          let prevIndex = nextIndex - 1
          logIt(`prevIndex: ${prevIndex}`)

          logIt(`seasonMenu[${prevIndex}].dayName: ${seasonMenu[prevIndex].dayName}`)

          while (seasonMenu[prevIndex].dayName != pDayName) {
            if (nextIndex < end) {
              nextIndex++
            } else {
              nextIndex = start
            }
            prevIndex = nextIndex - 1
          }

          const dayName = seasonMenu[prevIndex].dayName
          logIt(`dayName: ${dayName}`)

          const mealtime = seasonMenu[prevIndex].mealtime
          logIt(`mealtime: ${mealtime}`)

          const meal = iteratorGrid[dayName][mealtime].next().value

          if (dayName === 'Sunday' && mealtime === 'Lunch' && seasonMenu[prevIndex].season === 'Summer') {
            logIt(`meal: ${meal}`)
          }

          const result = { dayName, mealtime, meal }

          if (nextIndex < end) {
            nextIndex++
          } else {
            nextIndex = start
          }

          logObject(result, 'result')

          logIt(`makeMealsIterator.nextIterator.next finished`)

          return result
        }
      }

      logIt('makeMealsIterator finished')
      return nextIterator
    }

    const winterMenu = seasonalMenus.getSeasonMenu('Winter')
    const springMenu = seasonalMenus.getSeasonMenu('Spring')
    logObjectArray(springMenu, 'springMenu')

    const summerMenu = seasonalMenus.getSeasonMenu('Summer')
    logObjectArray(summerMenu, 'summerMenu')

    const autumnMenu = seasonalMenus.getSeasonMenu('Autumn')

    const winterIterator = makeMealsIterator(winterMenu)
    const springIterator = makeMealsIterator(springMenu)
    const summerIterator = makeMealsIterator(summerMenu)
    const autumnIterator = makeMealsIterator(autumnMenu)

    let mealsIterator
    const output = []

    output.push(this.getUpdateRangeHeader())

    const { first, iterator: days } = setupDaysIterator(getFirstDateOfYear())
    let day = first

    for (let dayIndex = 0; dayIndex < howManyRowsToRefresh; dayIndex++) {
      const dayName = day.dayName // Sunday

      const season = day.season // Winter, Spring, Summer, Autumn

      logIt(`dayName: ${dayName}, season: ${season}`)

      switch (season) {
        case 'Winter': mealsIterator = winterIterator
          break
        case 'Spring': mealsIterator = springIterator
          break
        case 'Summer': mealsIterator = summerIterator
          break
        case 'Autumn': mealsIterator = autumnIterator
          break
        default: crash(`Unexpected season: ${season}`)
      }

      const nextMeal = mealsIterator.next(dayName)

      const breakfast = nextMeal.meal
      const lunch = mealsIterator.next(dayName).meal
      const dinner = mealsIterator.next(dayName).meal
      const eveningSnack = mealsIterator.next(dayName).meal

      output.push([day.day, breakfast, lunch, dinner, eveningSnack])

      day = days.next()
      logObject(day, 'day')
    }

    logIt('DailyMenus.getOutputValues finished')

    return output;
  }


  getRowIndexByDateValue(dateValue) {
    const dateValues = this.getDateValues();

    let rowIndex = dateValues.findIndex(row => row[0] === dateValue);

    if (rowIndex !== -1) {
      rowIndex = rowIndex + 2
    }

    return rowIndex;
  }

  getSheet() {
    return this.sheet
  }

  getSheetName() {
    return this.sheet.getName()
  }

  getSpreadsheet() {
    return this.spreadsheet;
  }

  getShoppingStartDate() {
    return this.shoppingStartDate || this.spreadsheet.getShoppingStartDate();
  }

  getStartDateRow() {
    const shoppingStartDate = this.getShoppingStartDate();

    const rowIndex = this.getRowIndexByDateValue(shoppingStartDate);

    if (rowIndex === -1) {
      const sheetName = this.getSheetName();
      throw new Error(`Shopping start date not found in ${sheetName}: ${shoppingStartDate}`);
    }

    return rowIndex
  }

  getTodaysMeals() {
    const todayDate = Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy");
    const rowIndex = this.getRowIndexByDateValue(todayDate);

    if (rowIndex === -1) {
      throw new Error(`Date not found in ${this.sheetName}: ${dateValue}`);
    }

    const meals = this.sheet.getRange(`B${rowIndex}:E${rowIndex}`).getValues()[0];

    return {
      Breakfast: meals[0],
      Lunch: meals[1],
      Dinner: meals[2],
      Snacks: meals[3]
    };
  }

  goToTodaysMenu() {
    const sheet = this.sheet;
    const dateToday = getFormattedDate(new Date(), "GMT+1", "dd/MM/yyyy");

    const rowIndex = this.getRowIndexByDateValue(dateToday);

    if (rowIndex === -1) {
      const sheetName = this.getSheetName();
      throw new Error(`Date not found in ${sheetName}: ${dateToday}`);
    }

    const menuRange = sheet.getRange(`A${rowIndex}:E${rowIndex + 6}`);

    sheet.setActiveRange(menuRange);
  }

  getUpdateRangeHeader() {
    // TODO: Replace this with a call to get the actual header from Daily Menus
    const header = ['Day', 'Breakfast', 'Lunch', 'Dinner', 'Evening snack'];
    return header;
  }

  refreshData(seasonalMenus) {
    logIt(`DailyMenus.refreshData started`)
    const howManyRowsToRefresh = 366;

    const outputValues = this.getOutputValues(seasonalMenus, howManyRowsToRefresh);

    const range = this.sheet.getRange(1, 1, howManyRowsToRefresh + 1, 5)

    range.setValues(outputValues)
    logIt(`DailyMenus.refreshData finished`)
  }

  setDefaultMealsToShopFor() {
    return this.setMealsToShopFor(this.getMealsToShopForFromSheet());
  }

  setMealsToShopFor(mealsToShopFor) {
    this.validateMealsToShopFor(mealsToShopFor);
    this.mealsToShopFor = mealsToShopFor;
    return mealsToShopFor;
  }

  setStartDate(startDate) {
    this.startDate = startDate;
  }

  setValues(values) {
    const startRow = 1;
    const startColumn = 1;
    const howManyRows = values.length;
    const howManyColumns = values[0].length;

    this.sheet.getRange(startRow, startColumn, howManyRows, howManyColumns).setValues(values);
  }

  validateMealsToShopFor(mealsToShopFor) {
    if (typeof mealsToShopFor === "undefined") {
      throw new RangeError("mealsToShopFor is undefined");
    }
  }
}

class DateChange {
  constructor(spreadsheet) {
    this.spreadsheet = spreadsheet
  }

  // Called by function onDateChange which is triggered daily
  executeDateChangeEvents() {
    if (this.isEnabledEmailTodaysMenu()) {
      this.emailTodaysMenu();
    }
  }

  emailTodaysMenu() {
    const spreadsheet = this.spreadsheet
    const dailyMenus = new DailyMenus(spreadsheet);
    const meals = new Meals(spreadsheet);
    const recipes = new Recipes(spreadsheet);
    const todaysMeals = dailyMenus.getTodaysMeals();

    let emailBody = "Meals\n";

    Object.keys(todaysMeals).forEach(meal => {
      const menuItem = todaysMeals[meal]
      emailBody += "\n";
      emailBody += meal;
      emailBody += ": ";
      emailBody += menuItem;
      emailBody += ": ";
      emailBody += meals.getMealUrl(menuItem);
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

    emailBody += `\n\nSent from (onDateChange): ${spreadsheet.getUrl()}\n`

    sendMeEmail("Today's Menu (" + getToday() + ")", emailBody)
  }

  isEnabledEmailTodaysMenu() {
    const config = new Config(this.spreadsheet)
    return config.isEnabledEmailTodaysMenu()
  }
}

class IngredientsToShopFor {
  constructor(spreadsheet) {
    this.sheetName = 'Ingredients To Shop For'
    this.spreadsheet = spreadsheet
    this.sheet = this.spreadsheet.getSheetByName(this.sheetName, logIt)
  }

  getDefaultSheetName() {
    const defaultSheetName = "Ingredients To Shop For"
    return defaultSheetName;
  }

  getIngredients() {
    const ingredients = this.getSheet().getDataRange().getValues();
    ingredients.shift();
    ingredients.shift();
    return ingredients;
  }

  getSheet() {
    return this.sheet;
  }

  getSheetName() {
    return this.sheetName;
  }
}

class LinkChecker {
  checkLinks(links) {
    let msg;
    let title;
    const failedLinks = [];
    const goodLinks = [];
    links.forEach(function (link) {
      const fetch = this.fetch(link);
      const statusCode = fetch.getResponseCode();
      if (statusCode === 200) {
        goodLinks.push([link, statusCode]);
      } else {
        failedLinks.push([link, statusCode, fetch.getError()]);
      }
    }, this);

    title = links.length + " links checked";
    if (failedLinks.length) {
      msg = failedLinks.length + " link(s) failed. " + goodLinks.length + " links OK.";
      failedLinks.forEach(function (link) {
        msg += ' ' + link[0] + ' ' + link[1] + ' ' + link[2]
      });
    } else {
      msg = "All links OK";
    }
    this.addToast(msg, title, 3);
  }

  fetch(url) {
    return this.getMyUrlFetch().fetch(url);
  }

  getDefaultMyUrlFetch() {
    return new MyUrlFetch();
  }

  getDefaultToastMessages() {
    return [];
  }

  getMyUrlFetch() {
    if (typeof this.myUrlFetch === "undefined") {
      return this.setDefaultMyUrlFetch();
    } else {
      return this.myUrlFetch;
    }
  }

  getStatusCode(url) {
    const statusCode = this.fetch(url).getResponseCode();

    return statusCode;
  }

  getToastMessages() {
    if (typeof this.toastMessages === "undefined") {
      return this.setDefaultToastMessages();
    } else {
      return this.toastMessages;
    }
  }

  setDefaultToastMessages() {
    return this.setToastMessages(this.getDefaultToastMessages());
  }

  setToastMessages(toastMessages) {
    this.validatetoastMessages(toastMessages);
    this.toastMessages = toastMessages;
    return toastMessages;
  }

  validatetoastMessages(toastMessages) {
    if (typeof toastMessages === "undefined") {
      throw new RangeError("toastMessages is undefined");
    }
  }

  addToast(msg, title, timeoutSeconds) {
    const item = {
      'msg': msg,
      'title': title,
      'timeoutSeconds': timeoutSeconds
    };
    this.getToastMessages().push(item);
  }

  setDefaultMyUrlFetch() {
    return this.setMyUrlFetch(this.getDefaultMyUrlFetch());
  }

  setMyUrlFetch(myUrlFetch) {
    this.validatemyUrlFetch(myUrlFetch);
    this.myUrlFetch = myUrlFetch;
    return myUrlFetch;
  }

  validatemyUrlFetch(myUrlFetch) {
    if (typeof myUrlFetch === "undefined") {
      throw new RangeError("myUrlFetch is undefined");
    }
  }
}

class Meals {
  constructor(spreadsheet) {
    this.sheetName = 'Meals'
    this.spreadsheet = spreadsheet
    this.sheet = this.spreadsheet.getSheetByName(this.sheetName, logIt)

    this.allMeals = this.getAllMeals()
  }

  getAllMeals() {
    const typeofThisAllMeals = typeof this.allMeals
    let allMeals;
    if (typeofThisAllMeals === 'undefined') {
      allMeals = this.sheet.getDataRange().getValues();
      allMeals.shift();
      this.allMeals = allMeals;
    } else {
      allMeals = this.allMeals;
    }
    return allMeals;
  }

  getLinks() {
    const links = [];
    const urlColumn = 2;
    let allMeals = this.getAllMeals()
    for (let mealIndex in allMeals) {
      const url = allMeals[mealIndex][urlColumn];
      if (url.length) {
        links.push(url);
      }
    }
    return links;
  }

  getMeals() {
    const meals = [];
    const mealColumn = 0;
    const allMeals = this.getAllMeals()
    for (let mealIndex in allMeals) {
      const meal = allMeals[mealIndex][mealColumn];
      meals.push(meal);
    }
    return meals
  }

  getMealUrl(meal) {
    const howManyMeals = this.allMeals.length;
    let url = ''

    for (let i = 0; i < howManyMeals; i++) {
      const mealRow = this.allMeals[i]
      const currentMeal = mealRow[0]
      const mealUrl = mealRow[2]
      if (currentMeal === meal) {
        url = mealUrl
      }
    }
    return url;
  }

  getServingsPerMeal(meal) {
    const allMeals = this.allMeals
    let servingsPerMeal;
    for (const mealIndex in allMeals) {
      if (meal === allMeals[mealIndex][0]) {
        servingsPerMeal = allMeals[mealIndex][1]
        return servingsPerMeal;
      }
    }
    return servingsPerMeal;
  }

  getSheet() {
    return this.sheet;
  }

  getSheetName() {
    return this.sheetName;
  }

  getUniqueMeals() {
    return new Set(this.getMeals())
  }
}

class MealsToShopFor {
  constructor(spreadsheet) {
    this.sheetName = 'Meals To Shop For'
    this.spreadsheet = spreadsheet
    this.sheet = this.spreadsheet.getSheetByName(this.sheetName, logIt)
  }

  getMealsToShopFor() {
    return this.sheet.getDataRange().getValues();
  }

  getSheet() {
    return this.sheet;
  }

  getSheetName() {
    return this.sheetName;
  }

  setActiveCell(a1Notation) {
    this.sheet.setActiveCell(this.getSheet().getRange(a1Notation))
  }

  getMealsToShopForFromDailyMenus() {
    const dailyMenus = new DailyMenus(this.spreadsheet)
    return dailyMenus.getMealsToShopFor()
  }

  updateMealsToShopFor() {
    function endsWith(str, search) {
      return str.substring(str.length - search.length, str.length) === search;
    };

    const mealsToShopFor = this.getMealsToShopForFromDailyMenus()
    logArray(mealsToShopFor, 'mealsToShopFor')
    mealsToShopFor.sort();

    let previousMeal = "";
    const reducedMeals = [];
    mealsToShopFor.forEach(function (meal) {
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

    this.sheet.clearContents();

    const values = reducedMeals.map(meal => [meal]);

    this.sheet.getRange(1, 1, values.length, 1).setValues(values);
    /*
        reducedMeals.forEach(function (meal) {
          this.sheet.appendRow([meal])
        }, this);
    */
    return reducedMeals;
  }
}

class MenuPlannerSpreadsheet {
  constructor() {
    this.spreadsheet = getActiveSpreadsheet();
  }

  getDailyMenus() {
    const dailyMenus = this.dailyMenus || new DailyMenus(this)
    return dailyMenus;
  }

  getDefaultIngredientsToShopFor() {
    return new IngredientsToShopFor(this);
  }

  getDefaultShoppingList() {
    return new ShoppingList(this);
  }

  getHowManyMealsToShopFor() {
    const howManyMealsToShopFor = this.getDailyMenus().getHowManyMealsToShopFor()
    return howManyMealsToShopFor;
  }

  getIngredientsToShopFor() {
    if (typeof this.ingredientsToShopFor === "undefined") {
      return this.setDefaultIngredientsToShopFor();
    } else {
      return this.ingredientsToShopFor;
    }
  }

  getMeals() {
    const meals = this.meals || new Meals(this)
    return meals;
  }

  getMealsToShopFor() {
    return this.getDailyMenus().getMealsToShopFor();
  }

  getName() {
    return this.spreadsheet.getName()
  }

  getServingsToShopFor() {
    const mealsToShopFor = this.getMealsToShopFor();
    let servingsPerMeal;
    const servingsToShopFor = [];
    for (const mealIndex in mealsToShopFor) {
      servingsPerMeal = this.getMeals().getServingsPerMeal(mealsToShopFor[mealIndex])
      servingsToShopFor.push([mealsToShopFor[mealIndex], servingsPerMeal]);
    }
    return servingsToShopFor;
  }

  getSheetByName(sheetName, logIt) {
    return this.spreadsheet.getSheetByName(sheetName, logIt)
  }

  getShoppingList() {
    if (typeof this.shoppingList === "undefined") {
      return this.setDefaultShoppingList();
    } else {
      return this.shoppingList;
    }
  }

  getShoppingStartDate() {
    logIt(`MenuPlannerSpreadsheet.getShoppingStartDate started`);

    const config = new Config(this.spreadsheet)
    const shoppingStartDate = config.getShoppingStartDate();
    logIt(`shoppingStartDate: ${shoppingStartDate}`);

    return shoppingStartDate;
  }

  onlyUnique(value, index, self) {
    const posArr = self.map(function (e) { return e[0]; })
    const pos = posArr.indexOf(value[0])
    const onlyUnique = (pos === index)
    return onlyUnique;
  }

  setDefaultIngredientsToShopFor() {
    return this.setIngredientsToShopFor(this.getDefaultIngredientsToShopFor());
  }

  setDefaultShoppingList() {
    return this.setShoppingList(this.getDefaultShoppingList());
  }

  setIngredientsToShopFor(ingredientsToShopFor) {
    this.validateIngredientsToShopFor(ingredientsToShopFor);
    this.ingredientsToShopFor = ingredientsToShopFor;
    return ingredientsToShopFor;
  }

  setShoppingList(shoppingList) {
    this.validateShoppingList(shoppingList);
    this.shoppingList = shoppingList;
    return shoppingList;
  }

  validateIngredientsToShopFor(ingredientsToShopFor) {
    if (typeof ingredientsToShopFor === "undefined") {
      throw new RangeError("ingredientsToShopFor is undefined");
    }
  }

  validateShoppingList(shoppingList) {
    if (typeof shoppingList === "undefined") {
      throw new RangeError("shoppingList is undefined");
    }
  }
}

class MyHTTPResponse {
  getDefaultResponseCode() {
    return -1;
  }

  getResponseCode() {
    if (typeof this.responseCode === "undefined") {
      return this.setDefaultResponseCode();
    } else {
      return this.responseCode;
    }
  }

  setDefaultResponseCode() {
    return this.setResponseCode(this.getDefaultResponseCode());
  }

  setResponseCode(responseCode) {
    this.validateResponseCode(responseCode);
    this.responseCode = responseCode;
    return responseCode;
  }

  validateResponseCode(responseCode) {
    if (typeof responseCode === "undefined") {
      throw new RangeError("responseCode is undefined");
    }
  }

  getDefaultError() {
    return new Error();
  }

  getError() {
    if (typeof this.error === "undefined") {
      return this.setDefaultError();
    } else {
      return this.error;
    }
  }

  setDefaultError() {
    return this.setError(this.getDefaultError());
  }

  setError(error) {
    this.validateResponseCode(error);
    this.error = error;
    return error;
  }

  validateError(error) {
    if (typeof error === "undefined") {
      throw new RangeError("error is undefined");
    }
  }
}

class MyUrlFetch {
  fetch(url) {
    let response;
    try {
      response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    } catch (e) {
      response = this.getHTTPResponse();
      response.setError(e);
    }
    return response;
  }

  getDefaultHTTPResponse() {
    return new MyHTTPResponse();
  }

  getHTTPResponse() {
    if (typeof this.HTTPResponse === "undefined") {
      return this.setDefaultHTTPResponse();
    } else {
      return this.HTTPResponse;
    }
  }

  getResponseCode(response) {
    const statusCode = response.getResponseCode();

    return statusCode;
  }

  setDefaultHTTPResponse() {
    return this.setHTTPResponse(this.getDefaultHTTPResponse());
  }

  setHTTPResponse(HTTPResponse) {
    this.validateHTTPResponse(HTTPResponse);
    this.HTTPResponse = HTTPResponse;
    return HTTPResponse;
  }

  validateHTTPResponse(HTTPResponse) {
    if (typeof HTTPResponse === "undefined") {
      throw new RangeError("HTTPResponse is undefined");
    }
  }
}

class Recipes {
  constructor(spreadsheet) {
    this.sheetName = 'Recipes'
    this.spreadsheet = spreadsheet
    this.sheet = this.spreadsheet.getSheetByName(this.sheetName, logIt)
  }

  // Check we have a recipe for every meal
  getMissingRecipes(meals) {
    logArray(meals, 'meals')

    const dataRangeValues = this.getDataRangeValues();
    logArray(dataRangeValues, 'dataRangeValues')

    const uniqueRecipeNames = new Set(dataRangeValues.map(row => row[0]));
    logSet(uniqueRecipeNames, 'uniqueRecipeNames')

    const missingRecipes = meals.filter(meal => !uniqueRecipeNames.has(meal));
    logArray(missingRecipes, 'missingRecipes')

    return missingRecipes;
  }

  getDataRangeValues() {
    const typeofThisDataRangeValues = typeof this.dataRangeValues
    let dataRangeValues;
    if (typeofThisDataRangeValues === 'undefined') {
      dataRangeValues = this.getSheet().getDataRange().getValues();
      dataRangeValues.shift();
      this.dataRangeValues = dataRangeValues;
    } else {
      dataRangeValues = this.dataRangeValues;
    }

    return dataRangeValues;
  }

  getDefaultSheetName() {
    const defaultSheetName = "Recipes"
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
    const typeofThisRecipesList = typeof this.recipesList
    let recipesList;
    if (typeofThisRecipesList === 'undefined') {
      recipesList = this.getSheet().getDataRange().getValues();
      recipesList.shift();
      this.recipesList = recipesList;
    } else {
      recipesList = this.recipesList;
    }

    return recipesList;
  }

  getSheet() {
    return this.sheet;
  }

  getSheetName() {
    return this.sheetName;
  }
}

class SeasonalMenus {
  constructor(spreadsheet) {
    this.sheetName = "Seasonal Menus";
    this.spreadsheet = spreadsheet;
    this.sheet = this.spreadsheet.getSheetByName(this.sheetName, logIt);
  }

  // Check that meals listed on the Seasonal Menus are listed on the Meals sheet
  checkMeals() {
    const meals = new Meals(this.spreadsheet)
    const uniqueMeals = meals.getUniqueMeals()

    const uniqueSeasonalMeals = this.getUniqueMeals();

    if (!isSuperset(uniqueMeals, uniqueSeasonalMeals)) {
      crash([...difference(uniqueSeasonalMeals, uniqueMeals)])
    }
  }

  getDataRangeValues() {
    return this.sheet.getDataRange().getValues();
  }

  getDataValuesNoHeader() {
    const dataRangeValues = this.getDataRangeValues();
    // Get rid of the header
    dataRangeValues.shift();

    return dataRangeValues;
  }

  getGridArray() {
    logIt('SeasonalMenus.getGridArray started');

    const values = this.getDataValuesNoHeader();
    const gridArray = values.map(value => ({
      season: value[0],
      dayName: value[1],
      mealtime: value[2],
      meals: value.slice(3)
    }));

    logIt('SeasonalMenus.getGridArray finished')
    return gridArray
  }

  getRange(...args) {
    return this.sheet.getRange(...args)
  }

  getSpreadsheet() {
    return this.spreadsheet;
  }

  getSeasonMenu(season) {
    logIt('SeasonalMenus.getSeasonMenu started')
    logIt(`season: ${season}`)
    if (!this.gridArray) {
      this.gridArray = this.getGridArray()
    }
    const seasonMenu = this.gridArray.filter(element => {
      return (element.season === season);
    })
    logIt('SeasonalMenus.getSeasonMenu finished')

    return seasonMenu
  }

  getSheetName() {
    return this.sheetName;
  }

  getSheet() {
    return this.sheet;
  }

  getUniqueMeals() {
    // Ignore first row. 4 seasons * 28 = 112. 4 meals * 7 = 28
    const grid = this.sheet.getRange("D2:G113").getValues();

    const unique = new Set()

    grid.forEach(gridRow => {
      let col = 0;
      while (typeof gridRow[col] !== "undefined" && gridRow[col].length) {
        unique.add(gridRow[col++]);
      }
    });

    return unique;
  }
}

class ShoppingList {
  constructor(spreadsheet) {
    this.sheetName = 'Shopping List'
    this.spreadsheet = spreadsheet
    this.sheet = this.spreadsheet.getSheetByName(this.sheetName, logIt)
  }

  clearShoppingList() {
    const fullSheetRange = this.sheet.getRange(1, 1, this.getSheet().getMaxRows(), this.sheet.getMaxColumns())
    this.sheet.unhideColumn(fullSheetRange);
    this.sheet.unhideRow(fullSheetRange);

    this.sheet.clearContents();
  }

  getHowManyMealsToShopFor() {
    const howManyMealsToShopFor = this.spreadsheet.getHowManyMealsToShopFor()
    return howManyMealsToShopFor;
  }

  getIngredientsToShopFor() {
    const ingredientsToShopFor = this.spreadsheet.getIngredientsToShopFor()
    return ingredientsToShopFor;
  }

  getMealsToShopFor() {
    const mealsToShopFor = this.spreadsheet.getMealsToShopFor()
    return mealsToShopFor;
  }

  getQuery() {
    const data = "B1:D";
    const query = "SELECT B, SUM(C), D GROUP BY B, D LABEL B 'Ingredient', SUM(C) 'Quantity'";
    return '=QUERY(' + data + ', "' + query + '")';
  }

  getServingsToShopFor() {
    const servingsToShopFor = this.spreadsheet.getServingsToShopFor()
    return servingsToShopFor;
  }

  getSheet() {
    return this.sheet;
  }

  getSheetName() {
    const sheetName = this.sheetName
    return sheetName;
  }

  getShopForRecipes() {
    return this.getSheet().getDataRange().getValues();
  }

  getShoppingListType(abbreviation) {
    for (const typeListIndex in this.quantityTypeList) {
      if (abbreviation === this.quantityTypeList[typeListIndex][0]) {
        const shoppingListType = this.quantityTypeList[typeListIndex][2];
        return shoppingListType;
      }
    }
    return abbreviation + ' not found in Quantity Types';
  }

  howManyIngredients() {
    const ingredientsToBuy = this.sheet.getRange("E1:E").getValues()
    const howManyIngredients = ingredientsToBuy.filter(String).length
    return howManyIngredients;
  }

  readQuantityTypes() {
    const a1QuantityTypes = "Quantity Types!A2:D"
    this.quantityTypeList = this.sheet.getRange(a1QuantityTypes).getValues()
  }

  setShopForRecipes(shopForRecipes) {
    this.shopForRecipes = shopForRecipes
  }

  setWeekToShopFor(weekToShopFor) {
    this.weekToShopFor = weekToShopFor
  }

  updateList() {
    this.getMealsToShopFor()
    this.getHowManyMealsToShopFor()
    this.getServingsToShopFor()
    this.getIngredientsToShopFor()
  }

  updateRecipeQuantities() {
    for (const typeListIndex in this.quantityTypeList) {
      for (const recipeIndex in this.recipesValues) {
        if (this.recipesValues[recipeIndex][3] === this.quantityTypeList[typeListIndex][0]) {
          this.recipesValues[recipeIndex][2] *= this.quantityTypeList[typeListIndex][3];
          this.recipesValues[recipeIndex][3] = this.quantityTypeList[typeListIndex][2];
        }
      }
    }
  }

  writeList() {
    const startRow = 1;
    const startColumn = 1;
    const howManyRows = this.shopForRecipes.length;
    const howManyColumns = this.shopForRecipes[0].length;
    const range = this.getSheet().getRange("A1:D");
    range.clear();

    this.getSheet().getRange(startRow, startColumn, howManyRows, howManyColumns).setValues(this.shopForRecipes);
  }
}

function allSteps() {
  // Check URL links are still valid
  checkLinks()

  // Check we have a recipe for every meal
  checkRecipes()

  // Check we have a meal for every Seasonal Menus item
  checkSeasonalMenus()

  // Propogate Seasonal Menus for the entire year
  updateDailyMenus()

  updateMealsToShopFor()

  updateShoppingList()

  emailShoppingList()

  fnOnDateChange();

  goToTodaysMenu()
}

function checkLinks() {
  const spreadsheet = new MenuPlannerSpreadsheet()

  const startMessage = 'Checking links'
  const startTitle = 'checkLinks'
  const timeoutSeconds = 30
  toast(startMessage, startTitle, timeoutSeconds);

  const linkChecker = new LinkChecker();
  const meals = new Meals(spreadsheet);
  linkChecker.checkLinks(meals.getLinks());
  linkChecker.getToastMessages().forEach(function (item) {
    toast(item.msg, item.title, item.timeoutSeconds);
  });
  logIt('checkLinks finished')
}

function checkRecipes() {
  const spreadsheet = new MenuPlannerSpreadsheet()
  logObject(spreadsheet, 'spreadsheet')

  const meals = new Meals(spreadsheet);
  const allMeals = meals.getAllMeals();
  const mealNames = allMeals.map(mealRow => mealRow[0]);
  logArray(mealNames, 'mealNames')

  const recipes = new Recipes(spreadsheet);
  const missingRecipes = recipes.getMissingRecipes(mealNames);

  if (missingRecipes.length > 0) {
    const errorMessage = `Recipes: No recipe found for ${missingRecipes.join(", ")}`;
    throw new Error(errorMessage); // Optionally throw an error if needed
  }
  logIt('checkLinks checkRecipes')
}

function checkSeasonalMenus() {
  logIt('checkSeasonalMenus started')

  const spreadsheet = new MenuPlannerSpreadsheet()
  const seasonalMenus = new SeasonalMenus(spreadsheet);

  // Check that meals listed on the Seasonal Menus sheet are listed on the Meals sheet
  seasonalMenus.checkMeals()

  logIt('checkSeasonalMenus finished')
}

function createGasMenu() {
  const itemArray = [
    ['All Steps', 'allSteps'],
    ['Check Links', 'checkLinks'],
    ['Check Recipes', 'checkRecipes'],
    ['Check Seasonal Menus', 'checkSeasonalMenus'],
    ['Update Daily Menus', 'updateDailyMenus'],
    ['Update Meals To Shop For', 'updateMealsToShopFor'],
    ['Update Shopping List', 'updateShoppingList'],
    ['Go to today\'s menu', 'goToTodaysMenu'],
    ['Email weekly shopping list', 'emailShoppingList'],
    ['Update Menu', 'updateMenu'],
  ]
  createUiMenu('GAS Menu', itemArray)
  logIt('checkLinks createGasMenu')
}

function emailShoppingList() {
  let spreadsheet = new MenuPlannerSpreadsheet()
  let shoppingList = new ShoppingList(spreadsheet);
  let ingredientsToShopFor = new IngredientsToShopFor(spreadsheet);
  let shopForRecipes = shoppingList.getShopForRecipes();
  let ingredients = ingredientsToShopFor.getIngredients();
  let emailBody = "Ingredients To Shop For\n\n";
  let previousRecipe = "";
  let menuItems = [];
  ingredients.forEach(function (ingredient) {
    emailBody += ingredient[0];
    emailBody += " [" + ingredient[1];
    if (ingredient[2].length) {
      emailBody += " " + ingredient[2];
    }
    emailBody += "]\n";
  });

  emailBody += "\nMeals\n";

  shopForRecipes.forEach(function (recipeItem) {
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
  })
  sendMeEmail("Shopping List", emailBody)
}

function goToTodaysMenu() {
  const spreadsheet = new MenuPlannerSpreadsheet()
  const dailyMenus = new DailyMenus(spreadsheet);
  dailyMenus.goToTodaysMenu();
}

function fnOnDateChange() {
  const spreadsheet = getActiveSpreadsheet();
  const dateChange = new DateChange(spreadsheet);
  dateChange.executeDateChangeEvents();
}

// Trigger functions

function onDateChange() {
  fnOnDateChange();
}

function onOpen() {
  const spreadsheet = getActiveSpreadsheet()

  toast("Please wait while I do a few tasks", "Please wait!", 500);

  createGasMenu()

  const dailyMenus = new DailyMenus(spreadsheet);
  dailyMenus.goToTodaysMenu();

  toast("You can do your thing now.", "I'm finished!", 3);
}

function updateDailyMenus() {
  //logItLevel++;
  const spreadsheet = new MenuPlannerSpreadsheet()
  const seasonalMenus = new SeasonalMenus(spreadsheet)

  const dailyMenus = new DailyMenus(spreadsheet);
  dailyMenus.refreshData(seasonalMenus)

  logIt('updateDailyMenus finished')
}

function updateMealsToShopFor() {
  const spreadsheet = new MenuPlannerSpreadsheet();
  const mealsToShopFor = new MealsToShopFor(spreadsheet);

  mealsToShopFor.updateMealsToShopFor();
  mealsToShopFor.setActiveCell("A1");
}

function updateMenu() {
  const spreadsheet = new MenuPlannerSpreadsheet()
  spreadsheet.createMenu();
}

function updateShoppingList() {
  function getMealIngredients(meal, recipeList) {
    const mealIngredients = [];

    recipeList.forEach(function (recipeItem) {
      if (meal === recipeItem[0]) {
        mealIngredients.push(recipeItem);
      }
    });

    return mealIngredients;
  }

  let spreadsheet = new MenuPlannerSpreadsheet()
  let mealsToShopFor = new MealsToShopFor(spreadsheet);
  let recipes = new Recipes(spreadsheet);
  let shoppingList = new ShoppingList(spreadsheet);

  let reducedMeals = mealsToShopFor.getMealsToShopFor();
  let recipeList = recipes.getRecipesList();
  let shopFor = [];

  reducedMeals.forEach(function (meal) {
    logIt(`meal: ${meal}`)
    mealIngredients = getMealIngredients(String(meal), recipeList);
    if (!mealIngredients.length) {
      throw new Error("No ingredients found for " + meal);
    }

    mealIngredients.forEach(function (ingredient) {
      shopFor.push(ingredient);
    });
  });

  shoppingList.setShopForRecipes(shopFor)
  shoppingList.writeList();

  let ingredientsToShopForSheet = spreadsheet.getIngredientsToShopFor().getSheet();
  ingredientsToShopForSheet.setActiveCell(ingredientsToShopForSheet.getRange("A1"));

  logIt('checkLinks updateShoppingList')
}