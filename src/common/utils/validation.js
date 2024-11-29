function isNull(value) {
  return value === null;
}

function isUndefined(value) {
  return value === undefined;
}

function isEmptyString(value) {
  return typeof value === 'string' && value.trim() === '';
}

function isEmptyArray(value) {
  return Array.isArray(value) && value.length === 0;
}

function isEmptyObject(value) {
  return typeof value === 'object' && Object.keys(value).length === 0;
}

function isEmpty(data) {
  return (
    isNull(data) ||
    isUndefined(data) ||
    isEmptyString(data) ||
    isEmptyArray(data) ||
    isEmptyObject(data)
  );
}

export {
  isNull,
  isUndefined,
  isEmptyString,
  isEmptyArray,
  isEmptyObject,
  isEmpty,
}