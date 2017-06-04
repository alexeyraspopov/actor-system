# JavaScript Actors

This lib is a proof of concept implementation of actor system in JavaScript.

## Install

    npm install actor-system

Thanks to [@kt3k](https://github.com/kt3k) for providing the name in NPM registry.

## How to use

1. Bootstrap actor system.

```javascript
import { ActorSystem, MessageDispatcher, ExecutionContext, AnimationFrameExecutor } from 'actor-system';

const executor = new AnimationFrameExecutor(60);
const context = new ExecutionContext(executor);
const dispatcher = new MessageDispatcher(context);
const system = new ActorSystem(dispatcher);
```

Or by using default set of tools:

```javascript
import { ActorSystem } from 'actor-system';

const system = ActorSystem.fromDefaults();
```

2. Define message types.

```javascript
import { Message } from 'actor-system';

class Ping extends Message { }
class Pong extends Message { }
```

3. Implement actors.

```javascript
async function PingActor(system) {
  for await (const message of system.dispatcher) {
    switch (message.subject) {
    case Ping:
      system.dispatcher.dispatch(new Pong());
      break;
    }
  }
}

async function PongActor(system) {
  for await (const message of system.dispatcher) {
    switch (message.subject) {
    case Pong:
      system.dispatcher.dispatch(new Ping());
      break;
    }
  }
}

async function Main(system) {
  system.dispatcher.dispatch(new Ping());
}
```

4. Spawn them.

```javascript
system.spawn(PingActor);
system.spawn(PongActor);
system.spawn(Main);
```

## Articles

 * [Tasks, microtasks, queues and schedules — Jake Archibald](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
