# makecancelable

[![CircleCI](https://circleci.com/gh/sergeysolovev/makecancelable.svg?style=shield)](https://circleci.com/gh/sergeysolovev/makecancelable)

Yet another makeCancelable Promise wrapper, inspired by
[this](https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html) article
from React blog.

## Quickstart

Install from the command line:

```shell
npm install makecancelable
```

Import into the source code:

```js
import makeCancelable from 'makecancelable';
```

Use to make a promise _cancelable_\*:

```js
// User interface:
const renderOpeningCrawl = ({ opening_crawl }) => console.log(opening_crawl);

// Target promise:
const downloadEpisodeIV = fetch(
  'https://swapi.co/api/films/1/?format=json'
).then(response => response.json());

// Make rendering opening crawl cancelable:
const cancel = makeCancelable(
  downloadEpisodeIV,
  renderOpeningCrawl,
  console.error
);

// Cancel rendering opening crawl if it doesn’t download in one second:
setTimeout(() => {
  console.log('Too late, young Luke Skywalker');
  cancel();
}, 1000);
```

\* It’s worth mentioning that calling `cancel` doesn’t cancel fetching the
resource. Instead, it cancels rendering opening crawl (and errors if any).

For complete specification, see
[makeCancellable.test.js](https://github.com/sergeysolovev/makecancelable/blob/master/src/makeCancelable.test.js).

## Using in React components

For a good reason, updating the state of an unmounted React component can lead
to the following error in the console:

```
setState(…): Can only update a mounted or mounting component.
This usually means you called setState() on an unmounted component. This is a no-op
```

A typical example would be requesting a remote API in `componentDidMount` and
updating the state _after_ the API has responded. The user’s actions can lead to
unmounting of the component (e.g. navigating to another app’s page) before
calling `setState`.

The correct way to fix this issue, according to
[the article](https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html),
is to cancel any callbacks in `componentWillUnmount`, prior to unmounting.

Without `makeCancelable`:

```javascript
componentDidMount() {
  getDataFromApi()
    .then(data => this.setState({ data }))
    .catch(console.error);
}
componentWillUnmount() {
  /* nothing to cancel */
}
```

With `makeCancelable`:

```javascript
componentDidMount() {
  this.cancelRequest = makeCancelable(
    getDataFromApi(),
    data => this.setState({ data }),
    console.error
  );
}
componentWillUnmount() {
  this.cancelRequest();
}
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of
conduct, and the process for submitting pull requests.

## Versioning

[SemVer](http://semver.org/) is used for versioning. For the versions available,
see the
[tags on this repository](https://github.com/sergeysolovev/makecancelable/tags).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## Credits

- [@istarkov](https://github.com/istarkov) for original makeCancelable
  implementation
  [here](https://github.com/facebook/react/issues/5465#issuecomment-157888325);
- [@jwbay](https://github.com/jwbay) for suggesting flushPromises
  [here](https://github.com/facebook/jest/issues/2157#issuecomment-279171856) to
  use in tests.
