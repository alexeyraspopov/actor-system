export default class ActorSystem {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }

  spawn(coroutine) {
    coroutine(this.dispatcher).next();
  }
}
