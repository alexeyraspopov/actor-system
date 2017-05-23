import Mailbox from './Mailbox.js';
import ActorRef from './ActorRef.js';

export default class ActorSystem {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
    this.actors = new Map();
    this.refs = new Map();
  }

  actorOf(Actor, name = Actor.name) {
    if (this.refs.has(name)) return this.refs.get(name);

    const mailbox = this.dispatcher.mailboxOf(Mailbox);
    const instance = new Actor(this, mailbox.disposable);
    const ref = new ActorRef(mailbox);

    this.actors.set(name, instance);
    this.refs.set(name, ref);

    this.spawn(function process(system, instance, mailbox) {
      return mailbox.next().then(({ value, done }) => {
        if (value !== undefined) instance.receive(value);
        if (!done) return process(system, instance, mailbox);
      });
    }, instance, mailbox);

    return ref;
  }

  spawn(coroutine, ...args) {
    return coroutine(this, ...args);
  }
}
