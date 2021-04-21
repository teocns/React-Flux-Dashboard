/* eslint-disable import/no-anonymous-default-export */
export const isFunction = function (obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
};

export const waitForEitherPromise = (promises) => {
  const newPromises = promises.map(
    (p) =>
      new Promise((resolve, reject) =>
        p.then((v) => v && resolve(true), reject)
      )
  );
  newPromises.push(Promise.all(promises).then(() => false));
  return Promise.race(newPromises);
};
