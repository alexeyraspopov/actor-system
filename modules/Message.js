export default class Message {
  constructor(content) {
    this.subject = this.constructor;
    this.content = content;
    Object.freeze(this);
  }
}
