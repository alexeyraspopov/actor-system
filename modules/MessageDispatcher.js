export default class MessageDispatcher {
  constructor() {
    this.mailboxes = new Set();
  }

  dispatch(message) {
    for (const mailbox of this.mailboxes) mailbox.push(message);
  }

  [Symbol.asyncIterator]() {
    return new Mailbox(this);
  }
}

class Mailbox {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
    this.messages = [];
    this.pendings = [];
    this.dispatcher.mailboxes.add(this);
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
    this.dispatcher.mailboxes.delete(this);
  }
}
