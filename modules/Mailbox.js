export default class Mailbox {
  constructor(disposable) {
    this.disposable = disposable;
    this.messages = [];
    this.pendings = [];
  }

  push(message) {
    if (this.pendings.length > 0) {
      while (this.pendings.length > 0) {
        this.pendings.shift()({ value: message, done: false });
      }
    } else {
      this.messages.push(message);
    }
  }

  next() {
    return new Promise(resolve => {
      if (this.messages.length > 0) {
        resolve({ value: this.messages.shift(), done: false });
      } else {
        this.pendings.push(resolve);
      }
    });
  }

  return() {
    this.disposable.dispose(this);
  }
}
