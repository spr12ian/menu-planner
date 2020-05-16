class testClass {
  constructor() {
    console.log("this.fredVal", this.fredVal);
    console.log("this.fred", this.fred);
    console.log("this.get()", this.getfred());
  }
  
  get fred() {
    console.log(typeof this.fredVal);
    if (typeof this.fredVal === "undefined") {
      this.fredVal = 42;
    }
    return this.fredVal;
  }
  
  set fred(val) {
    this.fredVal = val;
  }
}

function zzz() {
  const tc = new testClass();
  console.log("tc.fred %s", tc.fred);
  tc.fred = 6;
  console.log("tc.fred %s", tc.fred);
}
