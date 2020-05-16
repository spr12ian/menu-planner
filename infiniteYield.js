function test() {
function* foo(index) {
  const start = index;
  while (true) {
    if (index < 3) {
      index++;
    } else {
      index = start;
    }
    yield index;
  }
}

const iterator = foo(0);
let result = iterator.next();
//while (!result.done) {

for (let i = 5; i < 15; i++) {
  console.log(result.value);
  
  result = iterator.next();
}

}
function test2() {
function* makeInfiniteIteratorStar(arr) {
      const start = 1;
      const end = arr.length;
      
      let nextIndex = start;

      while (true) {
          let result = { x:arr[nextIndex - 1 ] };
          if (nextIndex < end) {
            nextIndex++;
          } else {
            nextIndex = start;
          }
          yield result;
        }
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
    
    
    let it = makeInfiniteIteratorStar(daysArray);
    for (let i = 0; i< 10; i++) {
    console.log(it.next());
    }
    }
    
    
    
    
    
    function test3() {
    function makeMealtimeIterator() {
      const daysInYear = 366;
      const mealtimes = [
        'Breakfast',
        'Lunch',
        'Dinner',
        'Snacks',
      ];
      const start = 1;
      let nextIndex = start;

      const rangeIterator = {
        next: function() {
          let result = { mealtime: mealtimes[nextIndex-1]};
            if (nextIndex < mealtimes.length) {
              nextIndex++;
          } else {
            nextIndex = start;
          }
          return result;
        }
      };
      return rangeIterator;
    }
    }
    function test4() {
      const x = {};
      x.a = 'b';
      console.log(x);
    }