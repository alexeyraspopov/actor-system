export default class ExecutionContext {
  constructor(concurrent) {
    this.executor = new ImmediateExecutor(concurrent);
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

class ImmediateExecutor {
  constructor(concurrent) {
    this.concurrent = parseInt(concurrent) || 1;
  }

  execute(queue) {
    return new Promise(resolveQueue => {
      for (let i = 0; i < Math.min(this.concurrent, queue.length); i++) {
        const task = queue.shift();
        task.run();
      }

      if (queue.length > 0) {
        return resolveQueue(Promise.resolve().then(() => this.execute(queue)));
      }

      resolveQueue();
    });
  }
}

class IdleCallbackExecutor {
  constructor(timeout) {
    this.timeout = parseInt(timeout) || 1000;
  }

  execute(queue) {
    return new Promise(resolveQueue => {
      requestIdleCallback(deadline => {
        while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && queue.length > 0) {
          const task = queue.shift();
          task.run();
        }

        if (queue.length > 0) {
          return resolveQueue(this.execute(queue));
        }

        resolveQueue();
      }, { timeout: this.timeout });
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
