import Message from '../Message';

describe('Message', () => {
  class SomeMessage extends Message { }

  it('should keep the reference to its constructor', () => {
    const message = new SomeMessage();

    expect(message.subject)
      .toBe(SomeMessage);
  });

  it('should provide an access to the content', () => {
    const content = { name: 'Liza' };
    const message = new SomeMessage(content);

    expect(message.content)
      .toBe(content);
  });
});
