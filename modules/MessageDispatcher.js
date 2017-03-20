import Mailbox from './Mailbox';

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
