function makeDayIterator() {
      const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const start = 1;
      
      let nextIndex = start;

      const rangeIterator = {
        next: function() {
          let result = { day: days[nextIndex-1], dayNumber: nextIndex };
          if (nextIndex < days.length) {
            nextIndex++;
          } else {
            nextIndex = start;
          }
          return result;
        }
      };
      return rangeIterator;
    }
    
    function test() {
    let mm = makeDayIterator();
    for (let i = 0;i<30;i++) {
    console.log(mm.next().day);
    }
    }