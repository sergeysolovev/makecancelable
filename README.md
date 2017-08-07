# makecancelable
Yet another makeCancelable Promise wrapper,
inspired by [this](https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html) article from React blog.

## Usage
For React components, that use [fetch](https://developer.mozilla.org/en/docs/Web/API/Fetch_API) to update the state, unmounting can lead to the following issue:
```
setState(…): Can only update a mounted or mounting component.
This usually means you called setState() on an unmounted component. This is a no-op
```
The correct way to fix this issue, according to [the article](https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html), is to cancel any callbacks in `componentWillUnmount`, prior to unmounting.
Suggested `makeCancelable` wraps target promise and returns `cancel()` function, which can be called in `componentWillUnmount`.

The advantage of this implementation is that it wraps and handles the promise in a single statement. Check out Example section below to see how simple it is.

For complete specification, see [makeCancellable.test.js](https://github.com/sergeysolovev/makecancelable/blob/master/src/makeCancelable.test.js).

## Example: React container component
Without `makeCancelable`:
```javascript
componentDidMount() {
  fetchResource(this.props.resource)
    .then(fetched => this.setState(fetched))
    .catch(error => console.error(error));
}
componentWillUnmount() {
  /* nothing to cancel */
}
```
With `makeCancelable`:
```javascript
componentDidMount() {
  this.cancelFetch = makeCancelable(
    fetchResource(this.props.resource),
    fetched => this.setState(fetched),
    error => console.error(error)
  );
}
componentWillUnmount() {
  this.cancelFetch();
}
```

## Code
The implementation is simple and straighforward, so it can be copied to your project as-is from this snippet or installed as [npm package](https://www.npmjs.com/package/makecancelable).
```javascript
const makeCancelable = (promise, onfulfilled, onrejected) => {
  let hasCanceled = false;
  new Promise((resolve, reject) => promise
    .then(val => hasCanceled ? reject({isCanceled: true}) : resolve(val))
    .catch(err => hasCanceled ? reject({isCanceled: true}) : reject(err))
  )
    .then(onfulfilled)
    .catch(err => { if (err && !err.isCanceled) { throw(err); } })
    .catch(onrejected);
  return function() { hasCanceled = true; };
};
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

[SemVer](http://semver.org/) is used for versioning. For the versions available, see the [tags on this repository](https://github.com/sergeysolovev/makecancelable/tags).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits
- [@istarkov](https://github.com/istarkov) for original makeCancelable implementation [here](https://github.com/facebook/react/issues/5465#issuecomment-157888325);
- [@jwbay](https://github.com/jwbay) for suggesting flushPromises [here](https://github.com/facebook/jest/issues/2157#issuecomment-279171856) to use in tests.
