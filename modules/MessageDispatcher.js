import Mailbox from './Mailbox.js';

export default class MessageDispatcher {
  constructor(context) {
    this.context = context;
    this.mailboxes = new Set();
    this.disposable = { dispose: mailbox => this.mailboxes.delete(mailbox) };
  }

  dispatch(message) {
    for (const mailbox of this.mailboxes) mailbox.push(message);
  }

  mailboxOf(MailboxType) {
    const mailbox = new MailboxType(this.context, this.disposable);
    this.mailboxes.add(mailbox);
    return mailbox;
  }

  [Symbol.asyncIterator]() {
    return this.mailboxOf(Mailbox);
  }

  [Symbol.iterator]() {
    return this.mailboxOf(Mailbox);
  }
}
