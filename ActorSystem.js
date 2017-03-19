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

    for await (const state of iterator) {
      await this.context.execute(() => {
        this.states.set(coroutine, state);
      });
    }
  }

  dispose(coroutine) {
    const iterator = this.iterators.get(coroutine);

    if (iterator) {
      iterator.return();
    }
  }

  getStateOf(coroutine) {
    return this.states.get(coroutine);
  }
}
