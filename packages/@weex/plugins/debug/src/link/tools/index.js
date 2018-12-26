exports.objectGet = function (object, prop, defaultValue) {
  const props = prop.split('.')
  let p = props.shift()
  let cur = object
  while (p) {
    cur = cur[p]
    if (cur === undefined || cur === null) break
    p = props.shift()
  }
  return cur || defaultValue
}
exports.objectLocate = function objectLocate (object, prop) {
  if (!prop) return object
  const props = prop.split('.')
  let p = props.shift()
  let cur = object
  while (p) {
    if (cur[p] === undefined) {
      cur[p] = {}
    }
    cur = cur[p]
    p = props.shift()
  }
  return cur
}
exports.clearObjectAt = function (object, prop) {
  const props = prop.split('.')
  let p = props.shift()
  let cur = object
  while (p) {
    if (props.length === 0) {
      cur[p] = {}
    }
    else {
      cur = cur[p]
    }

    if (!cur) break
    p = props.shift()
  }
  return cur
}
exports.matchHubId = function (base, target) {
  return (
    base === target ||
    (target.indexOf(base) === 0 && target.charAt(base.length) === '.')
  )
}
