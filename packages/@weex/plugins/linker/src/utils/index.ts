const getEventHanlderByNamespace = (hanlders:any, namespace: string, defaultValue: any = []) => {
  if (!namespace) {
    return hanlders
  }
  const props = namespace.split('.')
  let p = props.shift()
  let cur = hanlders
  while (p) {
    cur = cur[p]
    if (cur === undefined || cur === null) break
    p = props.shift()
  }
  return cur || defaultValue
}

const locateEventHanlderByNamespace = (hanlders:any, namespace:string) => {
  if (!namespace) {
    return hanlders
  }
  const props = namespace.split('.')
  let p = props.shift()
  let cur = hanlders
  while (p) {
    if (cur[p] === undefined) {
      cur[p] = {}
    }
    cur = cur[p]
    p = props.shift()
  }
  return cur
}

const clearEventHandlerByNamespace = (handlers:any, namespace:string) => {
  const props = namespace.split('.')
  let p = props.shift()
  let cur = handlers
  if (!namespace) {
    cur.__handlers__ = []
    return cur
  }
  while (p) {
    if (props.length === 0) {
      cur[p] = {}
    } else {
      cur = cur[p]
    }

    if (!cur) break
    p = props.shift()
  }
  return cur
}
const matchHubId = (base, target) => {
  return base === target || (target.indexOf(base) === 0 && target.charAt(base.length) === '.')
}

const containHubId = (data: { hubId: string; [key: string]: any }[], hubId: string) => {
  let len = data.length
  let result = false
  for (let i = 0; i < len; i++) {
    if (!data[i].hubId || matchHubId(data[i].hubId, hubId)) {
      result = true
    }
  }
  return result
}

const isAsyncFuction = (fn: any) => {
  return Object.prototype.toString.call(fn) === '[object AsyncFunction]'
}

export default {
  getEventHanlderByNamespace,
  locateEventHanlderByNamespace,
  clearEventHandlerByNamespace,
  matchHubId,
  containHubId,
  isAsyncFuction
}
