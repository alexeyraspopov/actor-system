import Mailbox from './Mailbox';

export default class ActorSystem {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
    this.actors = new Map();
  }

  actorOf(Actor, name = Actor.constructor.name) {
    if (this.actors.has(name)) {
      return this.actors.get(name);
    }

    const instance = new Actor();
    const mailbox = new Mailbox(this.dispatcher.disposable);

    this.actors.set(name, instance);
    this.dispatcher.mailboxes.add(mailbox);

    const iterator = this.spawn(async function* process(dispatcher, instance) {
      for await (const message of dispatcher) instance.receive(message);
    }, instance);

    return instance;
  }

  spawn(coroutine, ...args) {
    const iterator = coroutine(this.dispatcher, ...args);
    iterator.next();
    return iterator;
  }
}
