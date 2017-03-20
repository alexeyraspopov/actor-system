export default class MessageDispatcher {
  constructor() {
    this.mailboxes = [];
  }

  dispatch(message) {
    for (const mailbox of this.mailboxes) mailbox.push(message);
  }

  [Symbol.asyncIterator]() {
    const mailbox = new Mailbox();
    this.mailboxes.push(mailbox);
    return mailbox;
  }
}

class Mailbox {
  constructor() {
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
}
