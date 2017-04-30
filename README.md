# JavaScript Actors

This lib is a proof of concept implementation of actor system in JavaScript.

## How to use

1. Bootstrap actor system.

```javascript
import { ActorSystem, MessageDispatcher, ExecutionContext, AnimationFrameExecutor } from 'actor-system';

const executor = new AnimationFrameExecutor();
const context = new ExecutionContext(executor);
const dispatcher = new MessageDispatcher(context);
const system = new ActorSystem(dispatcher);
```

2. Define message types.

```javascript
import { Message } from 'actor-system';

class Ping extends Message { }
class Pong extends Message { }
```

3. Implement actors.

```javascript
async function PingActor(dispatcher) {
  for await (const message of dispatcher) {
    switch (message.subject) {
    case Ping:
      dispatcher.dispatch(new Pong());
      break;
    }
  }
}

async function PongActor(dispatcher) {
  for await (const message of dispatcher) {
    switch (message.subject) {
    case Pong:
      dispatcher.dispatch(new Ping());
      break;
    }
  }
}

async function Main(dispatcher) {
  dispatcher.dispatch(new Ping());
}
```

4. Spawn them.

```javascript
system.spawn(PingActor);
system.spawn(PongActor);
system.spawn(Main);
```
