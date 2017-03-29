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
    return instance;
  }

  spawn(coroutine, ...args) {
    const iterator = coroutine(this.dispatcher, ...args);
    iterator.next();
    return iterator;
  }
}
