# JavaScript Actors

This lib is a proof of concept implementation of actor system in JavaScript.

## How to use

```javascript
import { ActorSystem, MessageDispatcher } from 'thislib';

const dispatcher = new MessageDispatcher();
const system = new ActorSystem(dispatcher);
```

```javascript
async function* PingActor(dispatcher) {
  for await (const message of dispatcher) {
    switch (message.subject) {
    case 'Ping':
      dispatcher.dispatch({ subject: 'Pong' });
      break;
    }
  }
}

async function* PongActor(dispatcher) {
  for await (const message of dispatcher) {
    switch (message.subject) {
    case 'Pong':
      dispatcher.dispatch({ subject: 'Ping' });
      break;
    }
  }
}

async function* Main(dispatcher) {
  dispatcher.dispatch({ subject: 'Ping' });
}

system.spawn(PingActor);
system.spawn(PongActor);
system.spawn(Main);
```