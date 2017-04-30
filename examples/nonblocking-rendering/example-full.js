class ExecutionContext {
  constructor(executor) {
    this.executor = executor;
    this.queue = [];
    this.current = Promise.resolve();
  }

  execute(routine) {
    return new Promise((resolve, reject) => {
      this.queue.push(new Task(routine, resolve, reject));
      if (this.queue.length === 1) this.flush();
    });
  }

  flush() {
    this.current = this.current.then(() => {
      return this.executor.execute(this.queue);
    });
  }
}

class Task {
  constructor(routine, resolve, reject) {
    this.routine = routine;
    this.resolve = resolve;
    this.reject = reject;
  }

  run() {
    try {
      this.resolve(this.routine());
    } catch (error) {
      this.reject(error);
    }
  }
}

class AnimationFrameExecutor {
  constructor(targetFPS = 60) {
    this.maxDeadline = Math.floor(1000 / targetFPS);
  }

  execute(queue) {
    return new Promise(resolveQueue => {
      requestAnimationFrame((timestamp) => {
        const deadline = new Deadline(this.maxDeadline, timestamp);

        while (deadline.timeRemaining() > 0 && queue.length > 0) {
          const task = queue.shift();
          task.run();
        }

        if (queue.length > 0) {
          return resolveQueue(this.execute(queue));
        }

        resolveQueue();
      });
    });
  }
}

class Deadline {
  constructor(max, start) {
    this.max = max;
    this.start = start;
  }

  timeRemaining() {
    const remaining = this.max - (performance.now() - this.start);
    return remaining > 0 ? remaining : 0;
  }
}

class Actor {
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

class Message {
  constructor(content) {
    this.subject = this.constructor;
    this.content = content;
  }
}

class Mailbox {
  constructor(context, disposable) {
    this.context = context;
    this.disposable = disposable;
    this.messages = [];
    this.pendings = [];
  }

  push(message) {
    if (this.pendings.length > 0) {
      while (this.pendings.length > 0) {
        const pending = this.pendings.shift();
        this.context.execute(() => pending({ value: message, done: false }));
      }
    } else {
      this.messages.push(message);
    }
  }

  next() {
    return new Promise(resolve => {
      if (this.messages.length > 0) {
        const message = this.messages.shift();
        this.context.execute(() => resolve({ value: message, done: false }));
      } else {
        this.pendings.push(resolve);
      }
    });
  }

  return() {
    this.disposable.dispose(this);
  }
}

class MessageDispatcher {
  constructor(context) {
    this.context = context;
    this.mailboxes = new Set();
    this.disposable = { dispose: mailbox => this.mailboxes.delete(mailbox) };
  }

  dispatch(message) {
    for (const mailbox of this.mailboxes) mailbox.push(message);
  }

  [Symbol.asyncIterator]() {
    const mailbox = new Mailbox(this.context, this.disposable);
    this.mailboxes.add(mailbox);
    return mailbox;
  }
}

class ActorSystem {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
    this.actors = new Map();
  }

  actorOf(Actor, name = Actor.name) {
    if (this.actors.has(name)) {
      return this.actors.get(name);
    }

    const instance = new Actor();
    this.actors.set(name, instance);

    this.spawn(async function process(dispatcher, instance) {
      for await (const message of dispatcher) instance.receive(message);
    }, instance);

    return instance;
  }

  spawn(coroutine, ...args) {
    return coroutine(this.dispatcher, ...args);
  }
}

async function CounterAct(dispatcher) {
  for await (const message of dispatcher) {
    console.log('CounterAct', message.subject.name);
    switch (message.subject) {
    case IncrementCommand:
      dispatcher.dispatch(new IncrementEvent());
      break;
    }
  }
}

async function CounterStore(dispatcher) {
  let state = 0;
  for await (const message of dispatcher) {
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

async function Main(dispatcher) {
  start.addEventListener('click', () => {
    dispatcher.dispatch(new IncrementCommand());
  });

  let flag = true;

  for await (const message of dispatcher) {
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
