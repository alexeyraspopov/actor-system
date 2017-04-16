export default class Actor {
  constructor(disposable) {
    this.disposable = disposable;
  }

  receive() {
    throw new Error('Actor::receive is an abstract method and should be overriden');
  }

  dispose() {
    this.disposable.dispose();
  }
}
