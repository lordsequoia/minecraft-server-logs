import test from 'ava';

import { createLoggedMessage } from './utils';

test('createLoggedMessage', async (t) => {
  const message = createLoggedMessage(`[00:00:00] [Dummy/INFO] Hello world`);

  t.is(message.level, 'INFO');
  t.is(message.timestamp, '00:00:00');
  t.is(message.thread, 'Dummy');
  t.is(message.message, 'Hello world');
});
