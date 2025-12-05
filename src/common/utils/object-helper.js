class ObjectHelper {
  static pick(source, fields = []) {
    return fields.reduce((filteredObj, key) => {
      if (source.hasOwnProperty(key)) {
        filteredObj[key] = source[key];
      }

      return filteredObj;
    }, {});
  }

  static pickAndReplace(source, fields = []) {
    const keysSet = new Set(fields);

    Object.keys(source).forEach((key) => {
      if (!keysSet.has(key)) {
        delete source[key];
      }
    });

    return source;
  }

  static delete(source, fields = []) {
    const keysSet = new Set(fields);

    Object.keys(source).forEach((key) => {
      if (keysSet.has(key)) {
        delete source[key];
      }
    });
  }

  static omit(source, fields = []) {
    return Object.keys(source).reduce((result, key) => {
      if (!fields.includes(key)) {
        result[key] = source[key];
      }

      return result;
    }, {});
  }
}

export default ObjectHelper;
