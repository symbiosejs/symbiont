const path = require('path')

/**
 * Constructor for Symbiont (Package of Symbiose), should be registed in Symbiose's Kernel to be used.
 *
 * @class
 */
function Symbiont() {
  /**
   * Registered controllers list, whitout registration controller can't be used in router.yml
   *
   * @type  {Object}
   * @private
   */
  const controllers = {}


  /**
   * Register controller
   *
   * @param     {String}    name    Controller name
   * @param     {function}    listener    Callback for {name} event
   */
  this.registerController = function(name, controller) {
    if (typeof name !== 'string') {
      throw new Error('First argument "name" of registerController should be a string.')
    }

    if (typeof controller !== 'object') {
      throw new Error(`Second argument "controller" of registerController should be an object, not a ${typeof controller}.`)
    }

    if (controllers[name]) {
      throw new Error(`"${name}" controller was already registered.`)
    }

    controllers[name] = controller
  }


  /**
   * Package events list, theses events will be registered on Symbiose.
   *
   * @type  {Object}
   * @private
   */
  const listeners = {}


  /**
   * Register event listener
   *
   * @param    {String}     name       Controller name
   * @param    {function}   listener   Callback for {name} event
   */
  this.registerEventListener = function(name, listener) {
    if (typeof name !== 'string') {
      throw new Error('First argument "name" of registerEventListener should be a string.')
    }

    if (typeof listener !== 'function') {
      throw new Error(`Second argument "listener" of registerEventListener should be a function, not a ${typeof listener}.`)
    }

    if (!listeners[name]) {
      listeners[name] = []
    }

    listeners[name].push(listener)
  }


  /**
   * Register event listener
   *
   * @alias   Symbiont.registerEventListener
   */
  this.on = this.registerEventListener


  /**
   * Get private storage (controllers & listeners), this function is used by Symbiose's Kernel.
   *
   * @param     {String}    name       Controller name
   * @param     {function}  listener   Callback for {name} event
   *
   * @return    {Object}    Return controllers & listeners storages
   */
  this.getPrivateStorage = function() {
    return {
      controllers: controllers,
      listeners: listeners
    }
  }
}


/**
 * Constructor name
 *
 * @name nameString
 * @memberOf Symbiont
 */
Object.defineProperty(Symbiont.prototype, 'constructorNameString', {
  value: 'Symbiont'
})


/**
 * Constructor version
 *
 * @name nameString
 * @memberOf Symbiont
 */
Object.defineProperty(Symbiont.prototype, 'versionSymbiontConstructor', {
  value: require(path.resolve(__dirname, '..', 'package.json')).version
})

module.exports = Symbiont
