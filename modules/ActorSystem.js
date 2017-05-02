import Mailbox from './Mailbox.js';

export default class ActorSystem {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
    this.actors = new Map();
  }

  actorOf(Actor, name = Actor.name) {
    if (this.actors.has(name)) {
      return this.actors.get(name);
    }

    const instance = new Actor(this);
    this.actors.set(name, instance);

    this.spawn(async function process(system, instance) {
      for await (const message of system.dispatcher) instance.receive(message);
    }, instance);

    return instance;
  }

  spawn(coroutine, ...args) {
    return coroutine(this, ...args);
  }
}
