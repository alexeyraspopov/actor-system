export default class ActorSystem {
  constructor(context, dispatcher) {
    this.context = context;
    this.dispatcher = dispatcher;
    this.iterators = new Map();
    this.states = new Map();
  }

  async spawn(coroutine) {
    const iterator = coroutine(this);

    this.iterators.set(coroutine, iterator);

    for await (const state of iterator) continue;
  }

  dispose(coroutine) {
    const iterator = this.iterators.get(coroutine);

    if (iterator) {
      iterator.return();
    }
  }
}
