import ExecutionContext from './ExecutionContext';
import MessageDispatcher from './MessageDispatcher';
import ActorSystem from './ActorSystem';

async function* CounterAct(system) {
  for await (const message of system.dispatcher) {
    switch (message.subject) {
    case IncrementCommand:
      system.dispatcher.dispatch(new IncrementEvent());
      break;
    default:
    }
  }
}

async function* CounterStore(system) {
  let state = 0;
  for await (const message of system.dispatcher) {
    state = reduce(state, message);
    yield state;
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
  }
}

async function* Main(system) {
  await system.dispatcher.dispatch(new IncrementCommand());
  await system.dispatcher.dispatch(new IncrementCommand());
}

class Message {
  constructor() {
    this.subject = this.constructor;
  }
}

class IncrementCommand extends Message {}
class IncrementEvent extends Message {}

const context = new ExecutionContext();
const dispatcher = new MessageDispatcher(context);
const system = new ActorSystem(context, dispatcher);

system.spawn(CounterAct);
system.spawn(CounterStore);
system.spawn(Logger);
system.spawn(Main);
