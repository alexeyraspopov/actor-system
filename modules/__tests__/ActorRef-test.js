jest.mock('../Mailbox');

import ActorRef from '../ActorRef';
import Mailbox from '../Mailbox';

describe('ActorRef', () => {
  it('should push message to mailbox', () => {
    const mailbox = new Mailbox()
    const ref = new ActorRef(mailbox);
    const message = { content: 'message' };

    ref.tell(message);

    expect(mailbox.push)
      .toHaveBeenCalledWith(message);
  });
});
