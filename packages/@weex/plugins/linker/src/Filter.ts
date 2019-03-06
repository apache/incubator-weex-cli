import * as DEBUG from 'debug'
const debug = DEBUG('filter')

import Handler from './Handler'
import Message from './Message'

export default class Filter {
  static async resolveFilterChain(message: Message, filterChain: any[], currentIndex: number = 0) {
    return new Promise(async (reject, resolve) => {
      let handler: Handler = filterChain[currentIndex]
      if (handler) {
        let result
        try {
          result = await handler.run(message)
        } catch (error) {
          reject(error)
        }
        if (currentIndex + 1 < filterChain.length) {
          try {
            result = await Filter.resolveFilterChain(message, filterChain, currentIndex + 1)
          } catch (error) {
            reject(error)
          }
        }
        resolve(result)
      } else {
        reject(new Error(`There has not handler for index[${currentIndex}]`))
        debug(`There has not handler for index[${currentIndex}]`)
      }
    })
  }
  private condition: any
  handler: any
  constructor(handler: any, condition?: any) {
    this.condition = condition
    this.handler = handler
    if (typeof this.condition === 'string') {
      this.condition = new Function('message', `with(message) {return ${this.condition};}`)
    }
  }

  when(condition: any) {
    if (condition === 'string') {
      this.condition = new Function('message', 'with(message) {return ' + condition + ';}')
    } else {
      this.condition = condition
    }
  }

  async run(message: Message) {
    if (!this.condition || this.condition(message)) {
      debug(`Filter run(${message})`)
      await this.handler(message)
      return true
    } else {
      return false
    }
  }
}
