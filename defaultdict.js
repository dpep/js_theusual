module.exports = function defaultdict(defaultVal = undefined, initVal = {}) {
  if (initVal instanceof Array || ! initVal instanceof Object) {
    throw TypeError("initVal must be of type `Object`")
  }

  let getDefault
  if (typeof defaultVal === 'function') {
    getDefault = defaultVal
  } else if (defaultVal instanceof Object) {
    if (Object.keys(defaultVal).length > 0) {
      throw Error("default value must be empty, use a callback instead")
    }

    // clone function
    getDefault = () => defaultVal.constructor()
  } else {
    // immutable primative
    getDefault = () => defaultVal
  }


  let proxy = new Proxy({}, {
    get: function(target, name) {
      if (typeof name === 'symbol') {
        return target[name]
      }

      return target[name] || (target[name] = getDefault())
    },
  })

  // copy initial initVals
  for (let p in initVal) {
    proxy[p] = initVal[p]
  }

  return proxy
}
