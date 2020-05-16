class MenuRota {
  constructor(mySpreadsheet) { //console.log("MenuRota");
    this.mySpreadsheet = mySpreadsheet; //console.log("MenuRota mySpreadsheet: %s", mySpreadsheet);
  }
  
  getDataRangeValues() {
    return this.getSheet().getDataRange().getValues();
  }

  getDefaultSheetName() { //console.log("MenuRota.getDefaultSheetName");
    const defaultSheetName = "Menu Rota"; //console.log("defaultSheetName: [%s]", defaultSheetName);
    return defaultSheetName;
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
  
  getOutput() {
  
    function* makeInfiniteIterator(arr) {
      console.log("makeInfiniteIterator: arr = %s", arr);
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
    
    function makeMealsIterator(arr) {
    
      function getMeals(row) {
        const meals = [];
        let i = 2;
        while (row[i]) {
          meals.push(row[i]);
          i++;
        }
        return meals;
      }
      
      function getIteratorGrid() {
        const iteratorGrid = {};
        let arrIndex = 0;
        console.log("getIteratorGrid: daysArray = %s", daysArray);
        daysArray.forEach(day => {
          iteratorGrid[day] = {};
          mealtimesArray.forEach(mealtime => {
            const meals = getMeals(arr[arrIndex++]);
            iteratorGrid[day][mealtime] = makeInfiniteIterator(meals);
          
            for (let mealIndex = 0; mealIndex <= meals.length; mealIndex++) {
              console.log(iteratorGrid[day][mealtime].next());
            }
          });
        });
        
        return iteratorGrid;
      }
      
      console.log("makeMealsIterator: arr = %s", arr);
      let start = 1
      let nextIndex = start;
      let end = arr.length;
      console.log("makeMealsIterator: end = %s", end);
      
      const iteratorGrid = getIteratorGrid();
      console.log("makeMealsIterator: iteratorGrid = %s", iteratorGrid);
      
      console.log("makeMealsIterator: iteratorGrid has %s keys", Object.keys(iteratorGrid).length);
      Object.keys(iteratorGrid).forEach(day => {
        console.log("makeMealsIterator: day = %s", day);
        console.log("makeMealsIterator: iteratorGrid["+day+"] has %s keys", Object.keys(iteratorGrid[day]).length);
        Object.keys(iteratorGrid[day]).forEach(mealtime => {
          console.log("makeMealsIterator: mealtime = %s", mealtime);
        });
      });

      const rangeIterator = {
        next: function() {
          console.log("rangeIterator: nextIndex = %s", nextIndex);
          
          const day = arr[nextIndex-1][0];
          console.log("rangeIterator: day = %s", day);
          
          const mealtime = arr[nextIndex-1][1];
          console.log("rangeIterator: mealtime = %s", mealtime);
          
          const meal = iteratorGrid[day][mealtime].next().value;
          console.log("rangeIterator: meal = %s", meal);
          
          let result = { day: day, mealtime: mealtime, meal: meal };
          console.log("rangeIterator: result = %s", result);
          
          if (nextIndex < end) {
            nextIndex++;
          } else {
            nextIndex = start;
          }
          return result;
        }
      };
      return rangeIterator;
    }
      
    const daysArray = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
    console.log("getOutput: daysArray = %s", daysArray);
    
    const mealtimesArray = [
      'Breakfast',
      'Lunch',
      'Dinner',
      'Snacks',
    ];
    console.log("getOutput: mealtimesArray = %s", mealtimesArray);
    
    const days = makeInfiniteIterator(daysArray);
    console.log("getOutput: days = %s", days);
    
    const mealtimes = makeInfiniteIterator(mealtimesArray);
    console.log("getOutput: mealtimes = %s", mealtimes);
    
    const dataRangeValues = this.getDataRangeValues();
    // Get rid of the header
    dataRangeValues.shift();
    console.log("getOutput: dataRangeValues = %s", dataRangeValues);
    
    const meals = makeMealsIterator(dataRangeValues);
    console.log("getOutput: meals = %s", meals);
    
    const output = [];
    output.push(this.getDailyMenusHeader());
    
    const daysInYear = 366;
    console.log("getOutput: daysInYear = %s", daysInYear);
    
    for (let dayIndex = 0; dayIndex < daysInYear; dayIndex++) {
      console.log("getOutput: dayIndex = %s", dayIndex);
      
      const next = meals.next();
      console.log("getOutput: next = %s", next);
      
      const day = next.day;
      
      const breakfast = next.meal;
      const lunch = meals.next().meal;
      const dinner = meals.next().meal;
      const eveningSnack = meals.next().meal;
      
      const row = [day, breakfast, lunch, dinner, eveningSnack];
      output.push(row);
    }
    return output;
  }
  
  getDailyMenusHeader() {
    // TODO: Replace this with a call to get the actual header from Daily Menus
    const header = ["Date",	"Breakfast", "Lunch", "Dinner", "Evening snack" ];
    return header;
  }
}
