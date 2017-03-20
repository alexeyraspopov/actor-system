export default class ActorSystem {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }

  spawn(coroutine, ...args) {
    coroutine(this.dispatcher, ...args).next();
  }
}
