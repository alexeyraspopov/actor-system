export default class ExecutionContext {
  constructor(executor) {
    this.executor = executor;
    this.queue = [];
    this.current = Promise.resolve();
  }

  execute(routine) {
    return new Promise((resolve, reject) => {
      this.queue.push(new Task(routine, resolve, reject));
      if (this.queue.length === 1) this.flush();
    });
  }

  flush() {
    return this.current.then(() => {
      this.current = this.executor.execute(this.queue);
    });
  }
}

class Task {
  constructor(routine, resolve, reject) {
    this.routine = routine;
    this.resolve = resolve;
    this.reject = reject;
  }

  run() {
    try {
      this.resolve(this.routine());
    } catch (error) {
      this.reject(error);
    }
  }
}
