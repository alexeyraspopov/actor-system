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
    const ref = new ActorRef();

    this.actors.set(name, instance);
    this.refs.set(name, ref);

    this.spawn(async function process(system, instance, mailbox) {
      for await (const message of mailbox) instance.receive(message);
    }, instance, mailbox);

    return ref;
  }

  spawn(coroutine, ...args) {
    return coroutine(this, ...args);
  }
}
