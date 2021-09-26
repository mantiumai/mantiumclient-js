export const objToQueryStr = (obj) => isNotNil(obj) && isObject(obj)
  ? '?' + Object.keys(obj).map(key => key + '=' + obj[key]).join('&')
  : '';

export const isNil = (val) => [null, undefined].includes(val);

export const isNull = (val) => val === null;

export const isNotNil = (val) => !isNil(val);

export const isNotNull = (val) => !isNull(val);

export const isObject = (val) => typeof val === 'object' && isNotNull(val);
