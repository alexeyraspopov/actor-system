declare module ActorSystem {
  export class ActorSystem {
    constructor(dispatcher: MessageDispatcher);
    actorOf(ActorType: typeof Actor, name: ?string): ActorRef;
    spawn(coroutine: AsyncFunction): any;
  }

  export class ActorRef {
    constructor(mailbox: Mailbox);
    tell(message: Message<*>): void;
  }

  export class Actor {
    constructor();
    receive(): void;
    dispose(): void;
  }

  export class MessageDispatcher {
    constructor(context: ExecutionContext);
    mailboxOf(MailboxType: typeof Mailbox): Mailbox;
    dispatch(message: Message<*>): void;
  }

  export class Mailbox implements AsyncIterator {
    constructor();
    push();
    next();
    throw();
    return();
  }

  export class Message<T> {
    subject: typeof Message<*>;
    content: T;
    constructor(content: T);
  }

  export interface Executor {
    async execute(routines: Array<Function>): void;
  }

  export class ExecutionContext {
    constructor(executor: Executor);
    async execute(routine: Function): any;
  }

  export class AnimationFrameExecutor implements Executor {
    maxDeadline: number;
    constructor(targetFPS: number);
    async execute(routines: Array<Function>): void;
  }

  export class AnimationFrameExecutor implements Executor {
    batchSize: number;
    constructor(batchSize: ?number);
    async execute(routines: Array<Function>): void;
  }
}
