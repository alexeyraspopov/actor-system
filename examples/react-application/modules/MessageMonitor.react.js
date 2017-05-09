import React from 'react';
import Coroutine from 'react-coroutine';
import { ActorSystemType } from './CustomPropTypes';

export default Coroutine.create(MessageMonitor, getVariables);

async function* MessageMonitor({ placeholder, dispatcher }) {
  yield <p>{placeholder}</p>;
  let index = 0;
  for await (const message of dispatcher)
    yield <p>{message.subject.name} ({index++}): {message.content}</p>;
}

MessageMonitor.contextTypes = {
  system: ActorSystemType
};

function getVariables(props, context) {
  return { dispatcher: context.system.dispatcher };
}
