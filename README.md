# make-cancelable
Yet another make-cancelable Promise wrapper.
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

## Example: React container component
```javascript
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = { resource: {} };
  }
  componentDidMount() {
    this.cancelFetch = makeCancelable(
      fetchResource(resource),
      fetched => this.setState({resource}),
      error => console.error(error)
    );
  }
  componentWillUnmount() {
    this.cancelFetch();
  }
  render() { /* renders component */ }
}
```