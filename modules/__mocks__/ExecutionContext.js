export default class ExecutionContext {
  constructor() {
    this.routines = [];
  }

  execute(fn) {
    this.routines.push(fn);
  }

  flush() {
    new Promise(resolve => {
      while (this.routines.length > 0) {
        this.routines.shift()();
      }

      resolve();
    });
  }
}
