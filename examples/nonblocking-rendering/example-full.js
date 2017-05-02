import ExecutionContext from '../../modules/ExecutionContext.js';
import AnimationFrameExecutor from '../../modules/AnimationFrameExecutor.js';
import Actor from '../../modules/Actor.js';
import ActorSystem from '../../modules/ActorSystem.js';
import Message from '../../modules/Message.js';
import MessageDispatcher from '../../modules/MessageDispatcher.js';

async function CounterAct(system) {
  for await (const message of system.dispatcher) {
    console.log('CounterAct', message.subject.name);
    switch (message.subject) {
    case IncrementCommand:
      dispatcher.dispatch(new IncrementEvent());
      break;
    }
  }
}

async function CounterStore(system) {
  let state = 0;
  for await (const message of system.dispatcher) {
    const newState = reduce(state, message);
    if (newState !== state) {
      state = newState;
      console.log('CounterStore', message.subject.name, state);
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
    console.log('Logger', message.subject.name, message.content);
  }
}

class Render extends Actor {
  receive(message) {
    switch (message.subject) {
    case StateMessage:
      value.value = message.content;
    }
  }
}

async function Main(system) {
  start.addEventListener('click', () => {
    dispatcher.dispatch(new IncrementCommand());
  });

  let flag = true;

  for await (const message of system.dispatcher) {
    switch (message.subject) {
    case IncrementEvent:
      if (flag) dispatcher.dispatch(new IncrementCommand());
      break;
    case StateMessage:
      if (message.content > 100) {
        flag = false;
      }
    }
  }
}

class IncrementCommand extends Message {}
class IncrementEvent extends Message {}
class StateMessage extends Message {}

const executor = new AnimationFrameExecutor();
const context = new ExecutionContext(executor);
const dispatcher = new MessageDispatcher(context);
const system = new ActorSystem(dispatcher);

system.spawn(CounterAct);
system.spawn(CounterStore);
system.spawn(CounterStore);
system.spawn(CounterStore);
system.spawn(CounterStore);
system.spawn(CounterStore);
system.spawn(CounterStore);
system.spawn(CounterStore);
system.actorOf(Logger);
system.actorOf(Render);
system.spawn(Main);
