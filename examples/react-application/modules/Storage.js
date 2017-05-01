export default class Storage {
  constructor() {
    this.state = new Map();
  }

  retrieve(key) {
    return this.state.get(key);
  }

  update(key, value) {
    this.state.set(key, value);
  }
}
