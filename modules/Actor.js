export default class Actor {
  receive() {
    throw new Error('Actor::receive is an abstract method and should be overriden');
  }

  dispose() {
    this.disposable.dispose();
  }
}
