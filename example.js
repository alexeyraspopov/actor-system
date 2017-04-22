import MessageDispatcher from './modules/MessageDispatcher';
import ActorSystem from './modules/ActorSystem';
import Actor from './modules/Actor';

async function CounterAct(dispatcher) {
  for await (const message of dispatcher) {
    console.log('CounterAct::cycle', message.subject.name);
    switch (message.subject) {
    case IncrementCommand:
      dispatcher.dispatch(new IncrementEvent());
      break;
    default:
    }
  }
}

async function CounterStore(dispatcher) {
  let state = 0;
  for await (const message of dispatcher) {
    const newState = reduce(state, message);
    if (newState !== state) {
      state = newState;
      console.log('CounterStore::yield', message.subject.name, state);
      dispatcher.dispatch(new StateMessage(state));
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

class Logger extends Actor {
  receive(message) {
    switch (message.subject) {
    case StateMessage:
      console.log('Logger::cycle', message.subject.name, message.content);
      break;
    default:
      console.log('Logger::cycle', message.subject.name);
    }
  }
}

async function Main(dispatcher) {
  dispatcher.dispatch(new IncrementCommand());
  dispatcher.dispatch(new IncrementCommand());
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

const dispatcher = new MessageDispatcher();
const system = new ActorSystem(dispatcher);

system.spawn(CounterAct);
system.spawn(CounterStore);
system.actorOf(Logger);
system.spawn(Main);
