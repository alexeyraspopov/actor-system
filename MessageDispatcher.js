export default class MessageDispatcher {
  constructor() {
    this.queue = [];
  }

  async dispatch(message) {
    await Promise.resolve();
    while (this.queue.length > 0) {
      const resolve = this.queue.shift();
      resolve(message);
    }
  }

  [Symbol.asyncIterator]() {
    return new DispatcherAsyncIterator(this);
  }
}

class DispatcherAsyncIterator {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }

  next() {
    return new Promise(resolve => {
      const resolver = (value) => resolve({ value, done: false });
      this.dispatcher.queue.push(resolver);
    });
  }
}
