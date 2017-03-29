export default class ActorSystem {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }

  spawn(coroutine, ...args) {
    const iterator = coroutine(this.dispatcher, ...args);
    iterator.next();
    return iterator;
  }
}
