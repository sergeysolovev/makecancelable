export default function makeCancelable(promise, onfulfilled, onrejected) {
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