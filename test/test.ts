import test from 'ava';

import { GoogleAuth } from 'google-auth-library';
import ImaginaryClient from '../src/index';

const BASE_URL = process.env.IMAGINARY_URI;
const auth = new GoogleAuth();


// setup client
const client = new ImaginaryClient({
  url: BASE_URL,
  async headers() {
    if (process.env.GOOGLE_ID_TOKEN !== undefined) {
      return { Authorization: `Bearer ${process.env.GOOGLE_ID_TOKEN}` };
    }
    const readyClient = await auth.getIdTokenClient(BASE_URL);
    return readyClient.getRequestHeaders(BASE_URL);
  },
});

test('ping', async t => {
  await client.ping();
  t.pass();
});

test('info', async t => {
  const info = await client.getInfo('https://upload.wikimedia.org/wikipedia/commons/5/53/Congo_painting_2.jpg')
  t.is(info.width, 580);
  t.is(info.height, 326);
  t.is(info.type, 'jpeg');
});

test('resize', async t => {
  const stream = await client.get('resize', {
    width: 120,
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Congo_painting_2.jpg',
    type: 'png',
  });

  const info = await client.postInfo(stream);

  t.is(info.width, 120);
  t.is(info.height, 67);
  t.is(info.type, 'png');

  t.pass();
});
