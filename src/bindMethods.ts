function bindMethods<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args)
      Object.getOwnPropertyNames(this)
        .filter((key) => typeof this[key] === 'function')
        .forEach((key) => {
          this[key] = this[key].bind(this)
        })
    }
  }
}

export default bindMethods