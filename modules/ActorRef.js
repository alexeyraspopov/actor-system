export default class ActorRef {
  constructor(mailbox) {
    this.mailbox = mailbox;
  }

  tell(message) {
    this.mailbox.push(message);
  }
}
