import React, { Component } from 'react';

export default class Application extends Component {
  static get childContextTypes() {
    return { system() { return null; },
             storage() { return null; } };
  }

  getChildContext() {
    return { system: this.props.system,
             storage: this.props.storage };
  }

  render() {
    return (
      <div>{this.props.children}</div>
    );
  }
}
