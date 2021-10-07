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
    return !this.isNull(val)
  },

  isObject(val) {
    return  typeof val === 'object' && this.isNotNull(val);
  },

  objToQueryStr(obj) {
    return this.isNotNil(obj) && this.isObject(obj)
      ? '?' + Object.keys(obj).map(key => key + '=' + obj[key]).join('&')
      : '';
  }
}
