import makeCancelable from './makeCancelable'
import flushPromises from './flushPromises'
import sinon from 'sinon'

describe('makeCancelable', () => {
  it('should return a function', () => {
    const promise = Promise.resolve();
    const cancel = makeCancelable(promise);
    expect(typeof cancel).toBe('function');
  });

  it('calls @onfulfilled with the same value as resolved @promise', () => {
    const obj = Object();
    const promise = Promise.resolve(obj);
    const onfulfilled = sinon.spy();
    makeCancelable(promise, onfulfilled);
    return flushPromises().then(() =>
      expect(onfulfilled.calledWith(obj)).toBe(true));
  });

  it('calls @onrejected with the same value @promise to be rejected', () => {
    const obj = Object();
    const promise = Promise.reject(obj);
    const onrejected = sinon.spy();
    makeCancelable(promise, null, onrejected);
    return flushPromises().then(() =>
      expect(onrejected.calledWith(obj)).toBe(true));
  });

  it(`should not call @onfulfilled
      when cancelled on @promise to be resolved`, () => {
    const obj = Object();
    const promise = Promise.resolve(obj);
    const onfulfilled = sinon.spy();
    const cancel = makeCancelable(promise, onfulfilled);
    cancel();
    return flushPromises().then(() =>
      expect(onfulfilled.notCalled).toBe(true));
  });

  it(`should not call @onrejected
      when cancelled on @promise to be resolved`, () => {
    const obj = Object();
    const promise = Promise.resolve(obj);
    const onrejected = sinon.spy();
    const cancel = makeCancelable(promise, null, onrejected);
    cancel();
    return flushPromises().then(() =>
      expect(onrejected.notCalled).toBe(true));
  });

  it(`should not call @onrejected and @onrejected
      when cancelled on @promise to be resolved`, () => {
    const obj = Object();
    const promise = Promise.resolve(obj);
    const onrejected = sinon.spy();
    const onfulfilled = sinon.spy();
    const cancel = makeCancelable(promise, onfulfilled, onrejected);
    cancel();
    return flushPromises().then(() => {
      expect(onrejected.notCalled).toBe(true);
      expect(onfulfilled.notCalled).toBe(true);
    });
  });

  it(`should not call @onfulfilled
      when cancelled on @promise to be rejected`, () => {
    const obj = Object();
    const promise = Promise.reject(obj);
    const onfulfilled = sinon.spy();
    const cancel = makeCancelable(promise, onfulfilled);
    cancel();
    return flushPromises().then(() =>
      expect(onfulfilled.notCalled).toBe(true));
  });

  it(`should not call @onrejected
      when cancelled on @promise to be rejected`, () => {
    const obj = Object();
    const promise = Promise.reject(obj);
    const onrejected = sinon.spy();
    const cancel = makeCancelable(promise, null, onrejected);
    cancel();
    return flushPromises().then(() =>
      expect(onrejected.notCalled).toBe(true));
  });

  it(`should not call @onrejected and @onrejected
      when cancelled on @promise to be rejected`, () => {
    const obj = Object();
    const promise = Promise.reject(obj);
    const onrejected = sinon.spy();
    const onfulfilled = sinon.spy();
    const cancel = makeCancelable(promise, onfulfilled, onrejected);
    cancel();
    return flushPromises().then(() => {
      expect(onrejected.notCalled).toBe(true);
      expect(onfulfilled.notCalled).toBe(true);
    });
  });
});