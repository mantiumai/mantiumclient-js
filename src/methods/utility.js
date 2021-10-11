module.exports = {
  isNil(val) {
    return [null, undefined].includes(val);
  },

  isNull(val) {
    return val === null;
  },

  isNotNil(val) {
    return !this.isNil(val);
  },

  isNotNull(val) {
    return !this.isNull(val);
  },

  isObject(val) {
    return typeof val === 'object' && this.isNotNull(val);
  },

  objToQueryStr(obj) {
    return this.isNotNil(obj) && this.isObject(obj)
      ? '?' +
          Object.keys(obj)
            .map((key) => key + '=' + obj[key])
            .join('&')
      : '';
  },

  isString(val) {
    return typeof val === 'string';
  },

  isNotEmpty(val) {
    return this.isNotNil(val) && val.length > 0;
  },

  isNotEmptyString(val) {
    return this.isString(val) && val.length > 0;
  },

  isNotNilOrEmptyString(val) {
    return this.isNotNil(val) && this.isNotEmptyString(val);
  },

  isNumber(val) {
    return typeof val === 'number';
  },

  isNotNumber(val) {
    return !this.isNumber(val);
  },

  hasProperty(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  },
};
