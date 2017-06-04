jest.mock('../ExecutionContext');

import Mailbox from '../Mailbox';
import ExecutionContext from '../ExecutionContext';

describe('Mailbox', () => {
  const context = new ExecutionContext();
  const disposable = { dispose: jest.fn() };

  it('should push message to pendings', () => {
    const mailbox = new Mailbox(context, disposable);
    const pendings = [jest.fn(), jest.fn()];
    const message = { content: 'message' };
    mailbox.pendings = pendings.slice();

    mailbox.push(message);
    context.flush();

    expect(pendings[0])
      .toHaveBeenCalledWith({ value: message, done: false });

    expect(pendings[1])
      .toHaveBeenCalledWith({ value: message, done: false });
  });

  it('should postpone message delivery', () => {
    const mailbox = new Mailbox(context, disposable);
    const message = { content: 'message' };

    mailbox.push(message);

    expect(context.routines)
      .toEqual(expect.arrayContaining([]));

    expect(mailbox.messages)
      .toEqual(expect.arrayContaining([message]));
  });

  it('should register listeners of the next message', () => {
    const mailbox = new Mailbox(context, disposable);
    const listener = mailbox.next();

    expect(listener.constructor)
      .toBe(Promise);

    expect(mailbox.pendings)
      .toEqual(expect.arrayContaining([expect.any(Function)]));
  });

  it('should deliver postponed message', async () => {
    expect.assertions(3);
    const mailbox = new Mailbox(context, disposable);
    const message = { content: 'message' };

    mailbox.messages = [message];

    const listenerA = mailbox.next();
    const listenerB = mailbox.next();

    context.flush();

    expect(mailbox.messages)
      .toEqual(expect.arrayContaining([]));

    await expect(listenerA)
      .resolves.toEqual({ value: message, done: false });

    await expect(listenerB)
      .resolves.toEqual({ value: message, done: false });
  });

  it('should be used as an iterator', () => {
    const mailbox = new Mailbox(context, disposable);

    expect(mailbox[Symbol.asyncIterator]())
      .toBe(mailbox);

    expect(mailbox[Symbol.iterator]())
      .toBe(mailbox);
  });

  it('should be disposable by iterator', () => {
    const mailbox = new Mailbox(context, disposable);

    mailbox.return();

    expect(disposable.dispose)
      .toHaveBeenCalledWith(mailbox);
  });

  it('should be disposable by failure', () => {
    const mailbox = new Mailbox(context, disposable);

    mailbox.throw();

    expect(disposable.dispose)
      .toHaveBeenCalledWith(mailbox);
  });
});
