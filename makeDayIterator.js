    function makeDayIterator(start = 1, end = 7, step = 1) {
      let days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      let nextIndex = start;
      let iterationCount = 0;

      const rangeIterator = {
        next: function() {
          let result = { day: days[nextIndex-1], dayNumber: nextIndex };
          if (nextIndex < end) {
            nextIndex += step;
          } else {
            nextIndex = start;
          }
          return result;
        }
      };
      return rangeIterator;
    }
    
    function test() {
      let it = makeDayIterator();
      for (let i = 0; i < 30; i++) {
        console.log(it.next().day);
      }
    }