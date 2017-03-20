import ExecutionContext from './ExecutionContext';
import MessageDispatcher from './MessageDispatcher';
import ActorSystem from './ActorSystem';

async function* CounterAct(system) {
  for await (const message of system.dispatcher) {
    console.log('CounterAct::cycle', message.subject.name);
    switch (message.subject) {
    case IncrementCommand:
      yield system.dispatcher.dispatch(new IncrementEvent());
      break;
    default:
    }
  }
}

async function* CounterStore(system) {
  let state = 0;
  for await (const message of system.dispatcher) {
    const newState = reduce(state, message);
    if (newState !== state) {
      state = newState;
      console.log('CounterStore::yield', message.subject.name, state);
      yield system.dispatcher.dispatch(new StateMessage(state));
    }
  }
}

function reduce(state, message) {
  switch (message.subject) {
  case IncrementEvent:
    return state + 1;
  default:
    return state;
  }
}

async function* Logger(system) {
  for await (const message of system.dispatcher) {
    switch (message.subject) {
    case StateMessage:
      console.log('Logger::cycle', message.subject.name, message.content);
      break;
    default:
      console.log('Logger::cycle', message.subject.name);
    }
  }
}

async function* Main(system) {
  yield await system.dispatcher.dispatch(new IncrementCommand());
  yield await system.dispatcher.dispatch(new IncrementCommand());
}

class Message {
  constructor(content) {
    this.subject = this.constructor;
    this.content = content;
  }
}

class IncrementCommand extends Message {}
class IncrementEvent extends Message {}
class StateMessage extends Message {}

const context = new ExecutionContext(1);
const dispatcher = new MessageDispatcher(context);
const system = new ActorSystem(context, dispatcher);

system.spawn(CounterAct);
system.spawn(CounterStore);
system.spawn(Logger);
system.spawn(Main);
