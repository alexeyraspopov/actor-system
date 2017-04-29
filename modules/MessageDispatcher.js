import Mailbox from './Mailbox';

export default class MessageDispatcher {
  constructor(context) {
    this.context = context;
    this.mailboxes = new Set();
    this.disposable = { dispose: mailbox => this.mailboxes.delete(mailbox) };
  }

  dispatch(message) {
    for (const mailbox of this.mailboxes) mailbox.push(message);
  }

  [Symbol.asyncIterator]() {
    const mailbox = new Mailbox(this.context, this.disposable);
    this.mailboxes.add(mailbox);
    return mailbox;
  }
}
