import React, { Component } from 'react';
import MessageMonitor from './MessageMonitor.react';

export default class Wrapper extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { placeholder: 'No messages received yet.' };
  }

  updatePlaceholder() {
    this.setState(() => ({
      placeholder: 'Success'
    }));
  }

  render() {
    return (
      <section>
        <button onClick={() => this.updatePlaceholder()}>Click Me</button>
        <MessageMonitor placeholder={this.state.placeholder} />
      </section>
    );
  }
}
