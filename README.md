creebet is a simple & modern [imaginary](https://github.com/h2non/imaginary) client for nodejs.

It does not support everything that imaginary offers, but should be enough for most use cases.

## Usage

```js
const ImaginaryClient = require('creebet');
const client = new ImaginaryClient({ url: 'http://localhost:9000' });

// use the resize op with a given url
const stream = await client.get('resize', {
  width: 120, // resize to 120x?
  url: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Congo_painting_2.jpg',
  type: 'png', // convert to png
});

// save the result somehow
stream.pipe(fs.createWriteStream('./rezized.png'));
```

## Usage with cloud run

```js
const ImaginaryClient = require('creebet');
const { GoogleAuth } = require('google-auth-library');

const BASE_URL = 'https://imaginary-api-foo-bar.a.run.app';
const idTokenClient = new GoogleAuth().getIdTokenClient(BASE_URL);

// setup client
const client = new ImaginaryClient({
  url: BASE_URL,
  async headers() {
    const readyClient = await idTokenClient;
    return readyClient.getRequestHeaders(BASE_URL);
  },
});

// test the client
client.preheat().then(console.log);
```

## Development

Please open an issue if you would like to contribute.
The current project architecture does not allow for easy contributing …
