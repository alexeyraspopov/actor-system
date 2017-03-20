export default class ActorSystem {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
    this.iterators = new Map();
  }

  async spawn(coroutine) {
    const iterator = coroutine(this.dispatcher);
    this.iterators.set(coroutine, iterator);
    for await (const state of iterator) continue;
  }

  dispose(coroutine) {
    const iterator = this.iterators.get(coroutine);
    if (iterator) iterator.return();
  }
}
