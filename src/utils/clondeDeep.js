/**
 * @link https://gist.github.com/cassaram09/e6eb7b289f97128e4e45f0d720475c12
 * @param {*} source
 */
function deepClone(source) {
  // If the source isn't an Object or Array, throw an error.
  if (
    !(source instanceof Object) ||
    source instanceof Date ||
    source instanceof String
  ) {
    throw "Only Objects or Arrays are supported."
  }

  // Set the target data type before copying.
  var target = source instanceof Array ? [] : {}

  for (let prop in source) {
    // Make sure the property isn't on the protoype
    if (
      source instanceof Object &&
      !(source instanceof Array) &&
      !source.hasOwnProperty(prop)
    ) {
      continue
    }

    // If the current property is an Array or Object, recursively clone it, else copy it's value
    if (
      source[prop] instanceof Object &&
      !(source[prop] instanceof Date) &&
      !(source[prop] instanceof String)
    ) {
      target[prop] = deepClone(source[prop])
    } else {
      target[prop] = source[prop]
    }
  }

  return target
}

export default deepClone
