export default class Mailbox {
  constructor(context, disposable) {
    this.context = context;
    this.disposable = disposable;
    this.messages = [];
    this.pendings = [];
  }

  push(message) {
    this.messages.push(message);

    if (this.pendings.length > 0) {
      const nextMessage = this.messages.shift();
      while (this.pendings.length > 0) {
        const pending = this.pendings.shift();
        this.context.execute(() => pending({ value: nextMessage, done: false }));
      }
    }
  }

  next() {
    return new Promise(resolve => {
      this.pendings.push(resolve);

      if (this.messages.length > 0) {
        const message = this.messages.shift();
        this.context.execute(() => this.push(message));
      }
    });
  }

  throw() {
    this.disposable.dispose(this);
  }

  return() {
    this.disposable.dispose(this);
  }

  [Symbol.asyncIterator]() {
    return this;
  }

  [Symbol.iterator]() {
    return this;
  }
}
