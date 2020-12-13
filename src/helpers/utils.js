/* eslint-disable import/no-anonymous-default-export */
export const isFunction = function (obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
};
