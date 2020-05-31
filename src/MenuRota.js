class MenuRota {
  constructor(mySpreadsheet) { //console.log("MenuRota");
    this.mySpreadsheet = mySpreadsheet; //console.log("MenuRota mySpreadsheet: %s", mySpreadsheet);
  }
  
  getDataRangeValues() {
    return this.getSheet().getDataRange().getValues();
  }

  getDataValuesNoHeader() {
    const dataRangeValues = this.getDataRangeValues();
    // Get rid of the header
    dataRangeValues.shift();
    
    return dataRangeValues;
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

  getSheet() {
    const sheet = this.mySpreadsheet.getActiveSpreadsheet().getSheetByName(this.getSheetName()); //console.log(sheet);
    return sheet;
  }
  
  getOutput() {
    
    function getDaysArray() {
      const date = getFirstDateOfYear();
      const options = { weekday: 'long'};
      const dtf = new Intl.DateTimeFormat('en-GB', options);
      const daysArray = [];
      for (let i = 0; i < 7; i++) {
        daysArray.push(dtf.format(date));
        date.setDate(date.getDate() + 1);
      }
      //console.log(daysArray);
      return daysArray;
    }
    
    function getFirstDateOfYear() {
      const date = new Date();
      date.setMonth(0,1);
      
      return date;
    }
    
    function getFirstDayOfYear() {
      const date = getFirstDateOfYear();
      const options = { weekday: 'long'};
      const dtf = new Intl.DateTimeFormat('en-US', options);
      const day = dtf.format(date);
      
      return day;
    }
    
    function makeDaysIterator() {
      const date = getFirstDateOfYear();
      const dtf = new Intl.DateTimeFormat('en-GB');

      const nextIterator = {
        next: function() {      
          const result = { day: dtf.format(date) };
          date.setDate(date.getDate()+1);    
          return result;
        }
      };
      return nextIterator;
    }
  
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
      
      function getIteratorGrid(arr) {
        const iteratorGrid = {};
        let arrIndex = 0;
        
        const mealtimesArray = [
          'Breakfast',
          'Lunch',
          'Dinner',
          'Snacks',
        ];
      
        getDaysArray().forEach(day => {
          iteratorGrid[day] = {};
          mealtimesArray.forEach(mealtime => {
            const meals = getMeals(arr[arrIndex++]);
            iteratorGrid[day][mealtime] = makeInfiniteIterator(meals);
          });
        });
        
        return iteratorGrid;
      }
      
      if (getFirstDayOfYear() !== arr[0][0]) {
        throw new Error("Menu Rota should start on a " + getFirstDayOfYear() + " not on a " + arr[0][0]);
      }
      
      const iteratorGrid = getIteratorGrid(arr);
      
      const start = 1;
      
      let nextIndex = start;
      let end = arr.length;

      const nextIterator = {
        next: function() {          
          const day = arr[nextIndex-1][0];          
          const mealtime = arr[nextIndex-1][1];          
          const meal = iteratorGrid[day][mealtime].next().value;
          
          let result = { day: day, mealtime: mealtime, meal: meal };
          
          if (nextIndex < end) {
            nextIndex++;
          } else {
            nextIndex = start;
          }
          return result;
        }
      };
      return nextIterator;
    }
    
    const days = makeDaysIterator();
    const meals = makeMealsIterator(this.getDataValuesNoHeader());
    
    const output = [];
    
    output.push(this.getDailyMenusHeader());
    
    const daysInYear = 366;
  
    for (let dayIndex = 0; dayIndex < daysInYear; dayIndex++) {      
      const day = days.next().day;
      
      const breakfast = meals.next().meal;
      const lunch = meals.next().meal;
      const dinner = meals.next().meal;
      const eveningSnack = meals.next().meal;
      
      output.push([day, breakfast, lunch, dinner, eveningSnack]);
    }
    
    return output;
  }
  
  getDailyMenusHeader() {
    // TODO: Replace this with a call to get the actual header from Daily Menus
    const header = ["Date",	"Breakfast", "Lunch", "Dinner", "Evening snack" ];
    return header;
  }
}
