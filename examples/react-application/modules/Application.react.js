import React, { Component } from 'react';
import { ActorSystemType, StorageType } from './CustomPropTypes';

export default class Application extends Component {
  static get childContextTypes() {
    return { system: ActorSystemType,
             storage: StorageType };
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
